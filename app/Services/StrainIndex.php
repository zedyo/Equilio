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

    private ?string $requiredQualification;

    public function __construct(?array $config = null)
    {
        $config ??= (function_exists('config') ? config('rostering') : null) ?? [];

        $this->maxConsecutive = $config['max_consecutive_duties'] ?? 6;
        $this->forbiddenTransitions = $config['forbidden_transitions'] ?? [];
        $this->requiredQualification = $config['required_qualification'] ?? null;
        $this->w = array_merge([
            'consecutive_over_max' => INF,
            'forbidden_transition' => INF,
            'understaffed_shift' => 50.0,
            'isolated_free_day' => 8.0,
            'third_consecutive_duty' => -2.0,
            'two_free_days_in_row' => -5.0,
            'missing_required_qualification' => 30.0,
        ], $config['strain_weights'] ?? []);
    }

    public function requiredQualification(): ?string
    {
        return $this->requiredQualification;
    }

    /**
     * Belastung durch Schicht/Tag-Kombinationen, die keine Kraft mit der
     * geforderten Qualifikation enthalten.
     */
    public function qualificationStrain(int $missingShiftDays): float
    {
        return $this->w['missing_required_qualification'] * max(0, $missingShiftDays);
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

    /**
     * Inkrementelle, beweisbar exakte Δ-Bewertung eines 2-Tausch-artigen
     * Eingriffs: liefert `strain(neu) − strain(alt)`, OHNE die ganze Sequenz
     * neu zu bewerten.
     *
     * Idee: Außerhalb der geänderten Tage sind alt/neu identisch. Erweitert
     * man die betroffenen Tage links/rechts bis zu einem Tag, der in BEIDEN
     * Sequenzen frei ist (so dass keine Dienstserie und kein Übergang die
     * Fenstergrenze kreuzt), heben sich alle Rand- und Außenterme im Δ
     * exakt auf. Damit gilt
     *   Δ = Σ_Fenster [ ESS(Ausschnitt_neu) − ESS(Ausschnitt_alt) ]
     * und ESS ist die bereits getestete `employeeSequenceStrain`.
     *
     * Aufwand ≈ O(Serienlänge) statt O(Monatslänge) → ermöglicht schnelle
     * Metaheuristiken. Korrektheit per Property-Test abgesichert.
     *
     * @param  array<int,?string>  $old   Tag (1-basiert) -> ShiftType|null
     * @param  array<int,?string>  $new
     * @param  array<int,int>      $changedDays
     */
    public function sequenceStrainDelta(array $old, array $new, array $changedDays, int $days): float
    {
        if (empty($changedDays)) {
            return 0.0;
        }
        sort($changedDays);

        $duty = fn (array $s, int $d): bool => $d >= 1 && $d <= $days && ! empty($s[$d]);

        // Pro geändertem Tag ein bis zu freien Rändern erweitertes Fenster.
        $windows = [];
        foreach ($changedDays as $cd) {
            $lo = $cd;
            while ($lo > 1 && ($duty($old, $lo - 1) || $duty($new, $lo - 1))) {
                $lo--;
            }
            $hi = $cd;
            while ($hi < $days && ($duty($old, $hi + 1) || $duty($new, $hi + 1))) {
                $hi++;
            }
            // ±2 Polsterung: garantiert, dass die zwei Slice-Randtage
            // mind. 2 Tage von jedem geänderten Tag entfernt sind. Damit
            // hängen ihre Run-/Übergangs-/Freitag-Pattern-Terme nur von
            // unveränderten Tagen ab -> in alt/neu identisch -> kürzen sich
            // im Δ exakt heraus (Sequenzanfang/-ende analog).
            $windows[] = [max(1, $lo - 2), min($days, $hi + 2)];
        }

        // Überlappende/angrenzende Fenster verschmelzen.
        usort($windows, fn ($a, $b) => $a[0] <=> $b[0]);
        $merged = [];
        foreach ($windows as $w) {
            if ($merged && $w[0] <= end($merged)[1] + 1) {
                $merged[count($merged) - 1][1] = max($merged[count($merged) - 1][1], $w[1]);
            } else {
                $merged[] = $w;
            }
        }

        $slice = function (array $s, int $a, int $b): array {
            $out = [];
            $i = 1;
            for ($d = $a; $d <= $b; $d++, $i++) {
                $out[$i] = $s[$d] ?? null;
            }

            return $out;
        };

        $delta = 0.0;
        foreach ($merged as [$a, $b]) {
            $newStrain = $this->employeeSequenceStrain($slice($new, $a, $b));
            if (is_infinite($newStrain)) {
                return INF;
            }
            $oldStrain = $this->employeeSequenceStrain($slice($old, $a, $b));
            if (is_infinite($oldStrain)) {
                return -INF;
            }
            $delta += $newStrain - $oldStrain;
        }

        return $delta;
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
