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

        $this->localSearch($assigned, $employees, $shiftTypes, $isAbsent, $isQualified, $days);

        return $this->buildResult(
            $employees, $assigned, $shiftTypes, $wishes, $preferences,
            $activeTypes, $year, $month, $days, $sollHours
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
     * Phase 2: arbeitslast- UND besetzungserhaltende 2-Tausch-Heuristik
     * (Hill-Climbing). Tauscht einen Dienst-Tag von A mit einem freien Tag
     * von B (B arbeitet an A's freiem Tag, A ist an B's Dienst-Tag frei):
     * jede Schicht-Instanz bleibt an ihrem Tag (Besetzung pro Tag/Art
     * unverändert), jede Person behält ihre Dienstanzahl (Fairness).
     * Akzeptiert nur Tausche, die den Soft-Strain senken, keine
     * unzulässige Konstellation erzeugen UND die Fachkraft-Abdeckung je
     * Schicht/Tag nicht verschlechtern. Siehe algorithm-notes.md.
     */
    private function localSearch(array &$assigned, $employees, $shiftTypes, callable $isAbsent, callable $isQualified, int $days): void
    {
        $maxPasses = 6;
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

                            $seqAOld = $this->seqOf($assigned, $aId, $shiftTypes, $days);
                            $seqBOld = $this->seqOf($assigned, $bId, $shiftTypes, $days);

                            // Tausch anwenden
                            unset($assigned[$aId][$d]);
                            $assigned[$aId][$e] = $shiftB;
                            unset($assigned[$bId][$e]);
                            $assigned[$bId][$d] = $shiftA;

                            // Inkrementelle Δ-Bewertung (nur betroffene Tage).
                            $delta = $this->strain->sequenceStrainDelta(
                                $seqAOld,
                                $this->seqOf($assigned, $aId, $shiftTypes, $days),
                                [$d, $e],
                                $days
                            ) + $this->strain->sequenceStrainDelta(
                                $seqBOld,
                                $this->seqOf($assigned, $bId, $shiftTypes, $days),
                                [$d, $e],
                                $days
                            );

                            $qualOk = (! $covAd || $qualCovered($typeA, $d))
                                && (! $covBe || $qualCovered($typeB, $e));

                            if ($qualOk && ! is_infinite($delta)
                                && $delta < -0.0001) {
                                $improved = true;
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
        array $activeTypes, int $year, int $month, int $days, array $sollHours
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

        return [
            'duties' => $duties,
            'hours' => $hours,
            'summary' => [
                'employee_strain' => round($employeeStrainSum, 2),
                'occupation_strain' => round($occupationStrain, 2),
                'qualification_strain' => round($qualificationStrain, 2),
                'missing_qualification' => $missingQualification,
                'hours_imbalance' => round($imbalance, 2),
                'total_strain' => round($total, 2),
                'forbidden' => $forbidden,
                'assigned_duties' => count($duties),
            ],
        ];
    }
}
