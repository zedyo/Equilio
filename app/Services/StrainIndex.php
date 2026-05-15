<?php

namespace App\Services;

/**
 * Belastungsindex — bewertet eine Dienstplan-Konstellation numerisch.
 * Höher = höhere Belastung. INF = unzulässig.
 *
 * Bewusst entkoppelt von Eloquent (reine Arrays) -> unit-testbar.
 * Regeln/Gewichte stammen aus config/rostering.php.
 * Siehe .claude/memory/algorithm-notes.md.
 */
class StrainIndex
{
    private int $maxConsecutive;

    /** @var array<int,array{from:string,to:string}> */
    private array $forbiddenTransitions;

    /** @var array<string,float> */
    private array $w;

    public function __construct(?array $config = null)
    {
        $config ??= (function_exists('config') ? config('rostering') : null) ?? [];

        $this->maxConsecutive = $config['max_consecutive_duties'] ?? 6;
        $this->forbiddenTransitions = $config['forbidden_transitions'] ?? [];
        $this->w = array_merge([
            'consecutive_over_max' => INF,
            'forbidden_transition' => INF,
            'understaffed_shift' => 50.0,
            'isolated_free_day' => 8.0,
            'third_consecutive_duty' => -2.0,
            'two_free_days_in_row' => -5.0,
        ], $config['strain_weights'] ?? []);
    }

    /**
     * Belastung einer einzelnen Mitarbeiter-Sequenz.
     *
     * @param  array<int,?string>  $shiftTypeByDay  Tag (1-basiert) -> ShiftType-Name
     *                                               eines aktiven Dienstes, oder null = frei.
     */
    public function employeeSequenceStrain(array $shiftTypeByDay): float
    {
        if (empty($shiftTypeByDay)) {
            return 0.0;
        }

        $days = max(array_keys($shiftTypeByDay));
        $strain = 0.0;
        $run = 0;

        for ($d = 1; $d <= $days; $d++) {
            $isDuty = ! empty($shiftTypeByDay[$d]);

            // Verbotene Übergänge Vortag -> heute
            if ($d > 1 && $isDuty && ! empty($shiftTypeByDay[$d - 1])) {
                foreach ($this->forbiddenTransitions as $t) {
                    if ($shiftTypeByDay[$d - 1] === ($t['from'] ?? null)
                        && $shiftTypeByDay[$d] === ($t['to'] ?? null)) {
                        return INF;
                    }
                }
            }

            if ($isDuty) {
                $run++;
            } else {
                $strain += $this->scoreRun($run);
                $run = 0;
            }
        }
        $strain += $this->scoreRun($run);

        // Freitag-Muster
        for ($d = 1; $d <= $days; $d++) {
            $free = empty($shiftTypeByDay[$d]);
            if (! $free) {
                continue;
            }
            $prevDuty = $d > 1 && ! empty($shiftTypeByDay[$d - 1]);
            $nextDuty = $d < $days && ! empty($shiftTypeByDay[$d + 1]);
            $nextFree = $d < $days && empty($shiftTypeByDay[$d + 1]);

            if ($prevDuty && $nextDuty) {
                $strain += $this->w['isolated_free_day'];
            } elseif ($nextFree) {
                // Beginn eines 2er-Freiblocks (nur einmal pro Block werten)
                $prevFree = $d > 1 && empty($shiftTypeByDay[$d - 1]);
                if (! $prevFree) {
                    $strain += $this->w['two_free_days_in_row'];
                }
            }
        }

        return $strain;
    }

    private function scoreRun(int $run): float
    {
        if ($run <= 0) {
            return 0.0;
        }
        if ($run > $this->maxConsecutive) {
            return $this->w['consecutive_over_max'];
        }
        if ($run === 3) {
            return $this->w['third_consecutive_duty'];
        }

        return 0.0;
    }

    /**
     * Besetzungs-Belastung: Defizit gegenüber min_occupation je aktiver
     * Schichtart und Tag.
     *
     * @param  array<string,array<int,int>>  $countByTypeByDay  [typeName][day] => Anzahl
     * @param  array<string,int>  $minByType  [typeName] => min_occupation
     */
    public function occupationStrain(array $countByTypeByDay, array $minByType): float
    {
        $strain = 0.0;
        foreach ($minByType as $type => $min) {
            if ($min <= 0) {
                continue;
            }
            foreach (($countByTypeByDay[$type] ?? []) as $count) {
                if ($count < $min) {
                    $strain += $this->w['understaffed_shift'] * ($min - $count);
                }
            }
        }

        return $strain;
    }

    public function weight(string $key): float
    {
        return $this->w[$key] ?? 0.0;
    }

    public function maxConsecutive(): int
    {
        return $this->maxConsecutive;
    }

    /** @return array<int,array{from:string,to:string}> */
    public function forbiddenTransitions(): array
    {
        return $this->forbiddenTransitions;
    }
}
