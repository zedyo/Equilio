<?php

namespace App\Services;

use App\Models\Absence;
use App\Models\Employee;
use App\Models\Preference;
use App\Models\Shift;
use App\Models\ShiftType;
use App\Models\Wish;
use Carbon\Carbon;

/**
 * Heuristischer Monats-Dienstplan-Generator (greedy + Fairness).
 * Liest Stammdaten, erzeugt einen Vorschlag und bewertet ihn über den
 * StrainIndex. Schreibt NICHT in die DB (Controller persistiert).
 *
 * Siehe .claude/memory/algorithm-notes.md.
 */
class RosterGenerator
{
    private StrainIndex $strain;

    /** Reihenfolge, in der aktive Schichtarten besetzt werden. */
    private array $typePriority = ['Frühschicht', 'Spätschicht', 'Nachtschicht'];

    public function __construct(?StrainIndex $strain = null)
    {
        $this->strain = $strain ?? new StrainIndex();
    }

    public function generate(int $year, int $month): array
    {
        $days = Carbon::create($year, $month, 1)->daysInMonth;

        $employees = Employee::with('qualification')->orderBy('id')->get();
        $shiftTypes = ShiftType::all()->keyBy('id');
        $shifts = Shift::orderBy('id')->get();

        $reqQual = $this->strain->requiredQualification();
        $isQualified = function ($employee) use ($reqQual): bool {
            if ($reqQual === null) {
                return true;
            }

            return optional($employee->qualification)->description === $reqQual;
        };

        // Repräsentativer Shift je aktiver Schichtart (kleinste id).
        $shiftByTypeName = [];
        foreach ($shifts as $shift) {
            $type = $shiftTypes[$shift->shift_type_id] ?? null;
            if ($type && $type->active_duty && ! isset($shiftByTypeName[$type->name])) {
                $shiftByTypeName[$type->name] = $shift;
            }
        }

        $activeTypes = [];
        foreach ($this->typePriority as $name) {
            if (isset($shiftByTypeName[$name])) {
                $activeTypes[$name] = $shiftTypes->firstWhere('name', $name);
            }
        }

        // Abwesenheiten je MA als Datums-Prüfung
        $absences = Absence::whereDate('start_date', '<=', sprintf('%04d-%02d-%02d', $year, $month, $days))
            ->whereDate('end_date', '>=', sprintf('%04d-%02d-01', $year, $month))
            ->get()
            ->groupBy('employee_id');

        $isAbsent = function (int $empId, int $day) use ($absences, $year, $month): bool {
            $date = sprintf('%04d-%02d-%02d', $year, $month, $day);
            foreach ($absences[$empId] ?? [] as $a) {
                if ($a->coversDate($date)) {
                    return true;
                }
            }

            return false;
        };

        $wishes = Wish::where('month', $month)->where('year', $year)->get()
            ->groupBy(fn ($w) => $w->employee_id.'-'.$w->day);
        $preferences = Preference::all()
            ->groupBy(fn ($p) => $p->employee_id.'-'.$p->shift_id);

        // Soll-Stunden-Kalibrierung: Vollzeit-Wochenstunden (Tarif) auf den
        // Monat skaliert; Soll-Dienstanzahl = Soll-Stunden / Ø-Schichtdauer.
        $fullTimeWeekly = (float) ((function_exists('config')
            ? config('rostering.full_time_weekly_hours') : null) ?? 39);
        $activeShiftHours = [];
        foreach ($shiftByTypeName as $sh) {
            $activeShiftHours[] = (float) $sh->h_duration;
        }
        $avgShiftHours = $activeShiftHours
            ? array_sum($activeShiftHours) / count($activeShiftHours)
            : 8.0;
        if ($avgShiftHours <= 0) {
            $avgShiftHours = 8.0;
        }

        // Zustand
        $assigned = [];          // [empId][day] = Shift
        $dutyCount = [];         // [empId] => int
        $runLen = [];            // [empId] => aktuelle Dienste-in-Folge
        $prevType = [];          // [empId] => ShiftType-Name am Vortag (oder null)
        $target = [];            // [empId] => Soll-Dienstanzahl
        $sollHours = [];         // [empId] => Soll-Stunden im Monat
        foreach ($employees as $e) {
            $dutyCount[$e->id] = 0;
            $runLen[$e->id] = 0;
            $prevType[$e->id] = null;
            $ratio = (float) ($e->employment_ratio ?: 100);
            $sollHours[$e->id] = round($fullTimeWeekly * ($ratio / 100) * ($days / 7), 2);
            $target[$e->id] = max(0, (int) round($sollHours[$e->id] / $avgShiftHours));
        }

        // Objektiv-Kontext: Tages-Wunsch je MA, Schicht-Präferenzen je MA,
        // Gewichte. Wird zusätzlich zur Sequenz-Belastung in die Akzeptanz
        // der Metaheuristiken und in den Gesamt-Index einbezogen.
        $wishMap = [];
        foreach ($wishes as $key => $group) {
            [$eid, $dy] = explode('-', $key);
            $wishMap[(int) $eid][(int) $dy] = (int) $group->first()->shift_id;
        }
        $prefByEmp = [];
        foreach ($preferences as $key => $group) {
            [$eid, $sid] = explode('-', $key);
            $prefByEmp[(int) $eid][(int) $sid] = true;
        }
        $obj = [
            'soll' => $sollHours,
            'wish' => $wishMap,
            'pref' => $prefByEmp,
            'w' => [
                'hours' => (float) ((function_exists('config')
                    ? config('rostering.monthly_hours_deviation') : null) ?? 1.5),
                'wish' => (float) ((function_exists('config')
                    ? config('rostering.wish_violation') : null) ?? 25.0),
                'pref' => (float) ((function_exists('config')
                    ? config('rostering.preference_miss') : null) ?? 0.5),
            ],
        ];

        for ($day = 1; $day <= $days; $day++) {
            $assignedToday = [];

            foreach ($activeTypes as $typeName => $type) {
                $slots = max((int) $type->opt_occupation, (int) $type->min_occupation);
                if ($slots <= 0) {
                    continue;
                }

                $candidates = [];
                foreach ($employees as $e) {
                    $id = $e->id;
                    if (isset($assignedToday[$id])) {
                        continue;
                    }
                    if ($isAbsent($id, $day)) {
                        continue;
                    }
                    if ($dutyCount[$id] >= $target[$id]) {
                        continue;
                    }
                    if ($runLen[$id] >= $this->strain->maxConsecutive()) {
                        continue;
                    }
                    if ($this->isForbidden($prevType[$id], $typeName)) {
                        continue;
                    }

                    $bonus = 0;
                    $wishKey = $id.'-'.$day;
                    foreach ($wishes[$wishKey] ?? [] as $w) {
                        if ($w->shift_id === $shiftByTypeName[$typeName]->id) {
                            $bonus -= 3; // Wunsch trifft -> bevorzugen
                        }
                    }
                    if (isset($preferences[$id.'-'.$shiftByTypeName[$typeName]->id])) {
                        $bonus -= 1;
                    }

                    $candidates[] = [
                        'e' => $e,
                        'score' => [$bonus, $dutyCount[$id], $id],
                    ];
                }

                usort($candidates, function ($a, $b) {
                    return $a['score'] <=> $b['score'];
                });

                $fill = array_slice($candidates, 0, $slots);

                // Mind. eine examinierte Fachkraft je Schicht/Tag erzwingen,
                // sofern ein qualifizierter Kandidat verfügbar ist.
                if ($reqQual !== null && $fill) {
                    $hasQual = false;
                    foreach ($fill as $c) {
                        if ($isQualified($c['e'])) {
                            $hasQual = true;
                            break;
                        }
                    }
                    if (! $hasQual) {
                        foreach ($candidates as $c) {
                            if ($isQualified($c['e'])) {
                                array_pop($fill); // unwichtigsten Slot ersetzen
                                array_unshift($fill, $c);
                                break;
                            }
                        }
                    }
                }

                foreach ($fill as $c) {
                    $e = $c['e'];
                    $shift = $shiftByTypeName[$typeName];
                    $assigned[$e->id][$day] = $shift;
                    $assignedToday[$e->id] = true;
                    $dutyCount[$e->id]++;
                }
            }

            // Run-/Vortag-Status fortschreiben
            foreach ($employees as $e) {
                if (isset($assigned[$e->id][$day])) {
                    $runLen[$e->id]++;
                    $stid = $assigned[$e->id][$day]->shift_type_id;
                    $prevType[$e->id] = $shiftTypes[$stid]->name ?? null;
                } else {
                    $runLen[$e->id] = 0;
                    $prevType[$e->id] = null;
                }
            }
        }

        $this->localSearch($assigned, $employees, $shiftTypes, $isAbsent, $isQualified, $days, $obj);
        $this->simulatedAnnealing($assigned, $employees, $shiftTypes, $isAbsent, $isQualified, $days, $obj);

        return $this->buildResult(
            $employees, $assigned, $shiftTypes, $wishes, $preferences,
            $activeTypes, $year, $month, $days, $sollHours, $obj
        );
    }

    /**
     * Tag-Sequenz eines Mitarbeiters: Tag -> ShiftType-Name oder null.
     */
    private function seqOf(array $assigned, int $empId, $shiftTypes, int $days): array
    {
        $seq = [];
        for ($d = 1; $d <= $days; $d++) {
            $shift = $assigned[$empId][$d] ?? null;
            $seq[$d] = $shift ? ($shiftTypes[$shift->shift_type_id]->name ?? null) : null;
        }

        return $seq;
    }

    /**
     * Zusätzliche Mitarbeiter-Belastung neben der Sequenz-Belastung:
     *  - Monats-Stunden: Strafe je Stunde Abweichung Ist↔Soll
     *    (Mitarbeiter sollen auf ihre Monatsstunden kommen),
     *  - Wünsche: hohe Strafe je nicht erfülltem Tages-Wunsch,
     *  - Präferenzen: kleine Strafe je Dienst ohne passende Präferenz
     *    (nur falls der MA überhaupt Präferenzen hinterlegt hat).
     * Reine Funktion von $assigned[$empId] -> wie seqOf memoisierbar.
     */
    private function employeeExtraStrain(array $assigned, int $empId, array $obj, int $days): float
    {
        $ist = 0.0;
        $wishViol = 0;
        $prefMiss = 0;
        $prefSet = $obj['pref'][$empId] ?? [];
        $hasPref = ! empty($prefSet);
        $wishDay = $obj['wish'][$empId] ?? [];

        for ($d = 1; $d <= $days; $d++) {
            $sh = $assigned[$empId][$d] ?? null;
            if ($sh) {
                $ist += (float) $sh->h_duration;
                if ($hasPref && empty($prefSet[(int) $sh->id])) {
                    $prefMiss++;
                }
            }
            if (isset($wishDay[$d]) && ! ($sh && (int) $sh->id === $wishDay[$d])) {
                $wishViol++;
            }
        }

        $w = $obj['w'];

        return $w['hours'] * abs($ist - (float) ($obj['soll'][$empId] ?? 0.0))
            + $w['wish'] * $wishViol
            + $w['pref'] * $prefMiss;
    }

    /**
     * Phase 2: arbeitslast- UND besetzungserhaltende 2-Tausch-Heuristik
     * (Hill-Climbing). Tauscht einen Dienst-Tag von A mit einem freien Tag
     * von B (B arbeitet an A's freiem Tag, A ist an B's Dienst-Tag frei):
     * jede Schicht-Instanz bleibt an ihrem Tag (Besetzung pro Tag/Art
     * unverändert), jede Person behält ihre Dienstanzahl (Fairness).
     * Akzeptiert nur Tausche, die den Soft-Strain senken, keine
     * unzulässige Konstellation erzeugen UND die Fachkraft-Abdeckung je
     * Schicht/Tag nicht verschlechtern. Siehe algorithm-notes.md.
     */
    private function localSearch(array &$assigned, $employees, $shiftTypes, callable $isAbsent, callable $isQualified, int $days, array $obj): void
    {
        // Die erschöpfende 2-Tausch-Lokalsuche ist O(E^2 * days^2) in der
        // MA-Zahl (Restart bei jeder Verbesserung) und wird für große
        // Bestände unbrauchbar (~77 s bei 36 MA). Oberhalb der Schwelle
        // übernimmt allein das nachgelagerte Simulated Annealing
        // (memoisiert, gedeckelt, „best-seen" -> nie schlechter als der
        // Greedy-Start). Schwelle bewusst > Test-Datensätze (<=22), damit
        // deren exaktes Verhalten unverändert bleibt.
        $maxEmployees = (int) ((function_exists('config')
            ? config('rostering.local_search_max_employees') : null) ?? 24);
        if ($employees->count() > $maxEmployees) {
            return;
        }

        $maxPasses = 6;
        $empById = $employees->keyBy('id');

        // Memoisierung: seqOf hängt nur an $assigned[$id] und ändert sich
        // erst nach einem *akzeptierten* Tausch -> Cache statt
        // Neuberechnung pro Kandidat (entfernt das dominante O(days) aus
        // der innersten Schleife; Verhalten bleibt bit-identisch).
        $seqCache = [];
        $extraCache = [];
        foreach ($employees as $emp) {
            $seqCache[$emp->id] = $this->seqOf($assigned, $emp->id, $shiftTypes, $days);
            $extraCache[$emp->id] = $this->employeeExtraStrain($assigned, $emp->id, $obj, $days);
        }
        $qualCovered = function (string $typeName, int $day) use (&$assigned, $shiftTypes, $empById, $isQualified): bool {
            foreach ($assigned as $empId => $byDay) {
                $shift = $byDay[$day] ?? null;
                if ($shift && ($shiftTypes[$shift->shift_type_id]->name ?? null) === $typeName
                    && isset($empById[$empId]) && $isQualified($empById[$empId])) {
                    return true;
                }
            }

            return false;
        };

        for ($pass = 0; $pass < $maxPasses; $pass++) {
            $improved = false;

            foreach ($employees as $a) {
                $aId = $a->id;
                $workDays = [];
                $freeDays = [];
                for ($d = 1; $d <= $days; $d++) {
                    if (isset($assigned[$aId][$d])) {
                        $workDays[] = $d;
                    } elseif (! $isAbsent($aId, $d)) {
                        $freeDays[] = $d;
                    }
                }
                if (! $workDays || ! $freeDays) {
                    continue;
                }

                foreach ($workDays as $d) {
                    foreach ($freeDays as $e) {
                        foreach ($employees as $b) {
                            $bId = $b->id;
                            if ($bId === $aId) {
                                continue;
                            }
                            // B arbeitet an e, ist an d frei und dort nicht abwesend
                            if (! isset($assigned[$bId][$e]) || isset($assigned[$bId][$d])) {
                                continue;
                            }
                            if ($isAbsent($bId, $d)) {
                                continue;
                            }

                            $shiftA = $assigned[$aId][$d]; // A: d -> frei, e -> shiftB
                            $shiftB = $assigned[$bId][$e]; // B: e -> frei, d -> shiftA

                            $typeA = $shiftTypes[$shiftA->shift_type_id]->name ?? '';
                            $typeB = $shiftTypes[$shiftB->shift_type_id]->name ?? '';
                            $covAd = $qualCovered($typeA, $d);
                            $covBe = $qualCovered($typeB, $e);

                            $seqAOld = $seqCache[$aId];
                            $seqBOld = $seqCache[$bId];

                            // Tausch anwenden
                            unset($assigned[$aId][$d]);
                            $assigned[$aId][$e] = $shiftB;
                            unset($assigned[$bId][$e]);
                            $assigned[$bId][$d] = $shiftA;

                            $seqANew = $this->seqOf($assigned, $aId, $shiftTypes, $days);
                            $seqBNew = $this->seqOf($assigned, $bId, $shiftTypes, $days);

                            // Inkrementelle Δ-Bewertung (nur betroffene Tage)
                            // + Stunden-/Wunsch-/Präferenz-Delta (nur A & B).
                            $exANew = $this->employeeExtraStrain($assigned, $aId, $obj, $days);
                            $exBNew = $this->employeeExtraStrain($assigned, $bId, $obj, $days);
                            $delta = $this->strain->sequenceStrainDelta(
                                $seqAOld, $seqANew, [$d, $e], $days
                            ) + $this->strain->sequenceStrainDelta(
                                $seqBOld, $seqBNew, [$d, $e], $days
                            ) + ($exANew - $extraCache[$aId])
                            + ($exBNew - $extraCache[$bId]);

                            $qualOk = (! $covAd || $qualCovered($typeA, $d))
                                && (! $covBe || $qualCovered($typeB, $e));

                            if ($qualOk && ! is_infinite($delta)
                                && $delta < -0.0001) {
                                $improved = true;
                                $seqCache[$aId] = $seqANew;
                                $seqCache[$bId] = $seqBNew;
                                $extraCache[$aId] = $exANew;
                                $extraCache[$bId] = $exBNew;
                                break 3;
                            }

                            // zurückrollen
                            unset($assigned[$aId][$e]);
                            $assigned[$aId][$d] = $shiftA;
                            unset($assigned[$bId][$d]);
                            $assigned[$bId][$e] = $shiftB;
                        }
                    }
                }
            }

            if (! $improved) {
                break;
            }
        }
    }

    /**
     * Phase 2g: Simulated Annealing auf derselben sicheren 2-Tausch-
     * Nachbarschaft wie die lokale Suche (Besetzung pro Tag/Art,
     * Dienstanzahl je MA und Fachkraft-Abdeckung bleiben invariant).
     * Bewertet jeden Zug inkrementell via StrainIndex::sequenceStrainDelta
     * (O(Serienlänge)), akzeptiert temporär verschlechternde Züge mit
     * Wahrscheinlichkeit exp(-Δ/T), um lokale Minima zu verlassen, und
     * liefert die beste je gesehene Lösung zurück (nie schlechter als die
     * Eingabe). Deterministisch über festen Seed → reproduzierbar/testbar.
     */
    private function simulatedAnnealing(array &$assigned, $employees, $shiftTypes, callable $isAbsent, callable $isQualified, int $days, array $obj): void
    {
        $cfg = (function_exists('config') ? config('rostering.annealing') : null) ?? [];
        if (($cfg['enabled'] ?? true) === false) {
            return;
        }
        $list = $employees->values();
        $n = $list->count();
        if ($n < 2) {
            return;
        }

        $iterations = (int) ($cfg['iterations'] ?? min(3000, $n * $days * 6));
        $temp = (float) ($cfg['start_temp'] ?? 10.0);
        $cooling = (float) ($cfg['cooling'] ?? 0.999);
        mt_srand((int) ($cfg['seed'] ?? 1337));

        $empById = $employees->keyBy('id');
        $qualCovered = function (string $typeName, int $day) use (&$assigned, $shiftTypes, $empById, $isQualified): bool {
            foreach ($assigned as $empId => $byDay) {
                $shift = $byDay[$day] ?? null;
                if ($shift && ($shiftTypes[$shift->shift_type_id]->name ?? null) === $typeName
                    && isset($empById[$empId]) && $isQualified($empById[$empId])) {
                    return true;
                }
            }

            return false;
        };
        $snapshot = function () use (&$assigned): array {
            $c = [];
            foreach ($assigned as $id => $byDay) {
                $c[$id] = $byDay;
            }

            return $c;
        };

        // Memoisierung wie in localSearch: seqOf nur nach akzeptiertem
        // Zug für die zwei betroffenen MA neu berechnen.
        $seqCache = [];
        $extraCache = [];
        foreach ($list as $emp) {
            $seqCache[$emp->id] = $this->seqOf($assigned, $emp->id, $shiftTypes, $days);
            $extraCache[$emp->id] = $this->employeeExtraStrain($assigned, $emp->id, $obj, $days);
        }

        $best = $snapshot();
        $cum = 0.0;        // kumulierte Δ relativ zur Eingabe
        $bestCum = 0.0;    // 0 = Eingabe (lokale Suche) als sichere Untergrenze

        for ($i = 0; $i < $iterations; $i++, $temp *= $cooling) {
            $a = $list[mt_rand(0, $n - 1)];
            $b = $list[mt_rand(0, $n - 1)];
            $aId = $a->id;
            $bId = $b->id;
            if ($aId === $bId) {
                continue;
            }

            $aDays = array_keys($assigned[$aId] ?? []);
            $bDays = array_keys($assigned[$bId] ?? []);
            if (! $aDays || ! $bDays) {
                continue;
            }
            $d = $aDays[mt_rand(0, count($aDays) - 1)];
            if (isset($assigned[$bId][$d]) || $isAbsent($bId, $d)) {
                continue;
            }
            $e = $bDays[mt_rand(0, count($bDays) - 1)];
            if (isset($assigned[$aId][$e]) || $isAbsent($aId, $e)) {
                continue;
            }

            $shiftA = $assigned[$aId][$d];
            $shiftB = $assigned[$bId][$e];
            $typeA = $shiftTypes[$shiftA->shift_type_id]->name ?? '';
            $typeB = $shiftTypes[$shiftB->shift_type_id]->name ?? '';
            $covAd = $qualCovered($typeA, $d);
            $covBe = $qualCovered($typeB, $e);

            $seqAOld = $seqCache[$aId];
            $seqBOld = $seqCache[$bId];

            unset($assigned[$aId][$d]);
            $assigned[$aId][$e] = $shiftB;
            unset($assigned[$bId][$e]);
            $assigned[$bId][$d] = $shiftA;

            $seqANew = $this->seqOf($assigned, $aId, $shiftTypes, $days);
            $seqBNew = $this->seqOf($assigned, $bId, $shiftTypes, $days);

            $exANew = $this->employeeExtraStrain($assigned, $aId, $obj, $days);
            $exBNew = $this->employeeExtraStrain($assigned, $bId, $obj, $days);
            $delta = $this->strain->sequenceStrainDelta(
                $seqAOld, $seqANew, [$d, $e], $days
            ) + $this->strain->sequenceStrainDelta(
                $seqBOld, $seqBNew, [$d, $e], $days
            ) + ($exANew - $extraCache[$aId])
            + ($exBNew - $extraCache[$bId]);

            $qualOk = (! $covAd || $qualCovered($typeA, $d))
                && (! $covBe || $qualCovered($typeB, $e));

            $accept = $qualOk && ! is_infinite($delta)
                && ($delta <= 0
                    || (mt_rand() / mt_getrandmax()) < exp(-$delta / max($temp, 1e-6)));

            if ($accept) {
                $seqCache[$aId] = $seqANew;
                $seqCache[$bId] = $seqBNew;
                $extraCache[$aId] = $exANew;
                $extraCache[$bId] = $exBNew;
                $cum += $delta;
                if ($cum < $bestCum - 1e-9) {
                    $bestCum = $cum;
                    $best = $snapshot();
                }
            } else {
                unset($assigned[$aId][$e]);
                $assigned[$aId][$d] = $shiftA;
                unset($assigned[$bId][$d]);
                $assigned[$bId][$e] = $shiftB;
            }
        }

        // Beste je gesehene Lösung wiederherstellen (≤ Eingabe-Strain).
        foreach (array_keys($assigned) as $id) {
            unset($assigned[$id]);
        }
        foreach ($best as $id => $byDay) {
            $assigned[$id] = $byDay;
        }
    }

    private function isForbidden(?string $fromType, string $toType): bool
    {
        if ($fromType === null) {
            return false;
        }
        foreach ($this->strain->forbiddenTransitions() as $t) {
            if (($t['from'] ?? null) === $fromType && ($t['to'] ?? null) === $toType) {
                return true;
            }
        }

        return false;
    }

    private function buildResult(
        $employees, array $assigned, $shiftTypes, $wishes, $preferences,
        array $activeTypes, int $year, int $month, int $days, array $sollHours,
        array $obj
    ): array {
        $duties = [];
        $countByTypeByDay = [];
        $istHours = [];
        $qualByTypeByDay = [];

        $reqQual = $this->strain->requiredQualification();
        $empQualified = [];
        foreach ($employees as $e) {
            $empQualified[$e->id] = $reqQual === null
                || optional($e->qualification)->description === $reqQual;
        }

        foreach ($employees as $e) {
            foreach (($assigned[$e->id] ?? []) as $day => $shift) {
                $typeName = $shiftTypes[$shift->shift_type_id]->name ?? '';

                $wishInjury = 0;
                foreach ($wishes[$e->id.'-'.$day] ?? [] as $w) {
                    $wishInjury = $w->shift_id === $shift->id ? 0 : 1;
                }
                $prefInjury = isset($preferences[$e->id.'-'.$shift->id]) ? 0 : 1;

                $duties[] = [
                    'employee_id' => $e->id,
                    'shift_id' => $shift->id,
                    'day' => $day,
                    'month' => $month,
                    'year' => $year,
                    'wish_injury' => $wishInjury,
                    'preference_injury' => $prefInjury,
                ];

                $countByTypeByDay[$typeName][$day] = ($countByTypeByDay[$typeName][$day] ?? 0) + 1;
                $qualByTypeByDay[$typeName][$day] =
                    ($qualByTypeByDay[$typeName][$day] ?? false) || $empQualified[$e->id];
                $istHours[$e->id] = ($istHours[$e->id] ?? 0.0) + (float) $shift->h_duration;
            }
        }

        $missingQualification = 0;
        if ($reqQual !== null) {
            foreach ($countByTypeByDay as $typeName => $byDay) {
                foreach ($byDay as $day => $cnt) {
                    if ($cnt > 0 && empty($qualByTypeByDay[$typeName][$day])) {
                        $missingQualification++;
                    }
                }
            }
        }

        // Strain-Auswertung
        $forbidden = false;
        $employeeStrainSum = 0.0;
        foreach ($employees as $e) {
            $seq = [];
            for ($d = 1; $d <= $days; $d++) {
                $shift = $assigned[$e->id][$d] ?? null;
                $seq[$d] = $shift ? ($shiftTypes[$shift->shift_type_id]->name ?? null) : null;
            }
            $s = $this->strain->employeeSequenceStrain($seq);
            if (is_infinite($s)) {
                $forbidden = true;

                continue;
            }
            $employeeStrainSum += $s;
        }

        $minByType = [];
        foreach ($activeTypes as $name => $type) {
            $minByType[$name] = (int) $type->min_occupation;
        }
        $occupationStrain = $this->strain->occupationStrain($countByTypeByDay, $minByType);
        $qualificationStrain = $this->strain->qualificationStrain($missingQualification);
        $total = $employeeStrainSum + $occupationStrain + $qualificationStrain;

        // Soll-/Ist-Stundenkonto je Mitarbeiter
        $hours = [];
        $imbalance = 0.0;
        foreach ($employees as $e) {
            $soll = round($sollHours[$e->id] ?? 0.0, 2);
            $ist = round($istHours[$e->id] ?? 0.0, 2);
            $diff = round($ist - $soll, 2);
            $hours[] = [
                'employee_id' => $e->id,
                'soll' => $soll,
                'ist' => $ist,
                'diff' => $diff,
            ];
            $imbalance += abs($diff);
        }

        // Zusatz-Belastung (Stunden/Wunsch/Präferenz) in den Gesamt-Index.
        $extraSum = 0.0;
        $wishViolations = 0;
        $preferenceMisses = 0;
        foreach ($employees as $e) {
            $extraSum += $this->employeeExtraStrain($assigned, $e->id, $obj, $days);
            $prefSet = $obj['pref'][$e->id] ?? [];
            $hasPref = ! empty($prefSet);
            $wishDay = $obj['wish'][$e->id] ?? [];
            for ($d = 1; $d <= $days; $d++) {
                $sh = $assigned[$e->id][$d] ?? null;
                if ($sh && $hasPref && empty($prefSet[(int) $sh->id])) {
                    $preferenceMisses++;
                }
                if (isset($wishDay[$d]) && ! ($sh && (int) $sh->id === $wishDay[$d])) {
                    $wishViolations++;
                }
            }
        }
        $total += $extraSum;

        return [
            'duties' => $duties,
            'hours' => $hours,
            'summary' => [
                'employee_strain' => round($employeeStrainSum, 2),
                'occupation_strain' => round($occupationStrain, 2),
                'qualification_strain' => round($qualificationStrain, 2),
                'missing_qualification' => $missingQualification,
                'hours_imbalance' => round($imbalance, 2),
                'hours_strain' => round($obj['w']['hours'] * $imbalance, 2),
                'wish_violations' => $wishViolations,
                'preference_misses' => $preferenceMisses,
                'total_strain' => round($total, 2),
                'forbidden' => $forbidden,
                'assigned_duties' => count($duties),
            ],
        ];
    }
}
