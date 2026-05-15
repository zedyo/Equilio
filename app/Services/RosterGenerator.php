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

        $employees = Employee::orderBy('id')->get();
        $shiftTypes = ShiftType::all()->keyBy('id');
        $shifts = Shift::orderBy('id')->get();

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

        // Zustand
        $assigned = [];          // [empId][day] = Shift
        $dutyCount = [];         // [empId] => int
        $runLen = [];            // [empId] => aktuelle Dienste-in-Folge
        $prevType = [];          // [empId] => ShiftType-Name am Vortag (oder null)
        $target = [];            // [empId] => Soll-Dienstanzahl
        foreach ($employees as $e) {
            $dutyCount[$e->id] = 0;
            $runLen[$e->id] = 0;
            $prevType[$e->id] = null;
            $ratio = (float) ($e->employment_ratio ?: 100);
            $target[$e->id] = (int) round($days * ($ratio / 100) * 5 / 7);
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

        $this->localSearch($assigned, $employees, $shiftTypes, $isAbsent, $days);

        return $this->buildResult(
            $employees, $assigned, $shiftTypes, $wishes, $preferences,
            $activeTypes, $year, $month, $days
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
     * Akzeptiert nur Tausche, die den Soft-Strain senken und keine
     * unzulässige Konstellation erzeugen. Siehe algorithm-notes.md.
     */
    private function localSearch(array &$assigned, $employees, $shiftTypes, callable $isAbsent, int $days): void
    {
        $maxPasses = 6;

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

                $aStrain = $this->strain->employeeSequenceStrain(
                    $this->seqOf($assigned, $aId, $shiftTypes, $days)
                );

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

                            $bStrain = $this->strain->employeeSequenceStrain(
                                $this->seqOf($assigned, $bId, $shiftTypes, $days)
                            );
                            $before = $aStrain + $bStrain;
                            if (is_infinite($before)) {
                                $before = PHP_FLOAT_MAX;
                            }

                            // Tausch anwenden
                            unset($assigned[$aId][$d]);
                            $assigned[$aId][$e] = $shiftB;
                            unset($assigned[$bId][$e]);
                            $assigned[$bId][$d] = $shiftA;

                            $aNew = $this->strain->employeeSequenceStrain(
                                $this->seqOf($assigned, $aId, $shiftTypes, $days)
                            );
                            $bNew = $this->strain->employeeSequenceStrain(
                                $this->seqOf($assigned, $bId, $shiftTypes, $days)
                            );

                            if (! is_infinite($aNew) && ! is_infinite($bNew)
                                && ($aNew + $bNew) < $before - 0.0001) {
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
        array $activeTypes, int $year, int $month, int $days
    ): array {
        $duties = [];
        $countByTypeByDay = [];

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

        return [
            'duties' => $duties,
            'summary' => [
                'employee_strain' => round($employeeStrainSum, 2),
                'occupation_strain' => round($occupationStrain, 2),
                'total_strain' => round($employeeStrainSum + $occupationStrain, 2),
                'forbidden' => $forbidden,
                'assigned_duties' => count($duties),
            ],
        ];
    }
}
