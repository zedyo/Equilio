<?php

namespace Tests\Unit;

use App\Services\StrainIndex;
use PHPUnit\Framework\TestCase;

class StrainIndexTest extends TestCase
{
    private function index(): StrainIndex
    {
        return new StrainIndex([
            'max_consecutive_duties' => 6,
            'forbidden_transitions' => [['from' => 'Nachtschicht', 'to' => 'Frühschicht']],
            'strain_weights' => [
                'consecutive_over_max' => INF,
                'forbidden_transition' => INF,
                'understaffed_shift' => 50.0,
                'isolated_free_day' => 8.0,
                'third_consecutive_duty' => -2.0,
                'two_free_days_in_row' => -5.0,
            ],
        ]);
    }

    public function test_sequence_strain_delta_matches_full_recomputation(): void
    {
        $idx = $this->index();
        $vals = [null, 'Frühschicht', 'Spätschicht', 'Nachtschicht'];
        mt_srand(20260515);

        for ($iter = 0; $iter < 400; $iter++) {
            $days = mt_rand(10, 31);
            $old = [];
            for ($d = 1; $d <= $days; $d++) {
                $old[$d] = $vals[mt_rand(0, 3)];
            }

            // 1–3 Tage verändern (deckt 2-Tausch + Mehrfachänderung ab).
            $new = $old;
            $changed = [];
            $k = mt_rand(1, 3);
            for ($j = 0; $j < $k; $j++) {
                $cd = mt_rand(1, $days);
                $new[$cd] = $vals[mt_rand(0, 3)];
                $changed[$cd] = $cd;
            }
            $changed = array_values($changed);

            $full = $idx->employeeSequenceStrain($new);
            $base = $idx->employeeSequenceStrain($old);
            $delta = $idx->sequenceStrainDelta($old, $new, $changed, $days);

            if (is_infinite($base)) {
                // Bereits unzulässige Ausgangslage: Δ unbestimmt, der
                // Optimierer startet nie aus einem INF-Zustand -> überspringen.
                continue;
            }
            if (is_infinite($full)) {
                $this->assertTrue(
                    is_infinite($delta) && $delta > 0,
                    "Iter $iter: neue Sequenz INF, Delta muss +INF sein"
                );

                continue;
            }

            $this->assertEqualsWithDelta(
                $full,
                $base + $delta,
                1e-6,
                "Iter $iter: inkrementelles Delta weicht von Vollberechnung ab"
            );
        }
    }

    public function test_more_than_max_consecutive_is_forbidden(): void
    {
        $seq = [];
        for ($d = 1; $d <= 7; $d++) {
            $seq[$d] = 'Frühschicht';
        }
        $this->assertInfinite($this->index()->employeeSequenceStrain($seq));
    }

    public function test_night_to_early_transition_is_forbidden(): void
    {
        $seq = [1 => 'Nachtschicht', 2 => 'Frühschicht'];
        $this->assertInfinite($this->index()->employeeSequenceStrain($seq));
    }

    public function test_two_free_days_in_a_row_is_rewarded(): void
    {
        // Dienst, frei, frei, Dienst -> ein 2er-Freiblock (-5)
        $seq = [1 => 'Frühschicht', 2 => null, 3 => null, 4 => 'Frühschicht'];
        $this->assertSame(-5.0, $this->index()->employeeSequenceStrain($seq));
    }

    public function test_isolated_free_day_is_penalised(): void
    {
        // Dienst, frei, Dienst -> isolierter freier Tag (+8)
        $seq = [1 => 'Frühschicht', 2 => null, 3 => 'Frühschicht'];
        $this->assertSame(8.0, $this->index()->employeeSequenceStrain($seq));
    }

    public function test_missing_required_qualification_adds_strain(): void
    {
        $idx = new StrainIndex([
            'required_qualification' => 'Exam. Pfleger:in',
            'strain_weights' => ['missing_required_qualification' => 30.0],
        ]);
        $this->assertSame('Exam. Pfleger:in', $idx->requiredQualification());
        $this->assertSame(90.0, $idx->qualificationStrain(3));
        $this->assertSame(0.0, $idx->qualificationStrain(0));
    }

    public function test_understaffed_occupation_adds_strain(): void
    {
        // Frühschicht braucht min 3, an Tag 1 nur 1 besetzt -> 50 * (3-1)
        $strain = $this->index()->occupationStrain(
            ['Frühschicht' => [1 => 1]],
            ['Frühschicht' => 3]
        );
        $this->assertSame(100.0, $strain);
    }
}
