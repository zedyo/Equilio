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
