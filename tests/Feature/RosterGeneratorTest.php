<?php

namespace Tests\Feature;

use App\Models\Absence;
use App\Models\Duty;
use App\Models\Employee;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RosterGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            QualificationSeeder::class,
            EmployeeSeeder::class,
            ShiftSeeder::class,
        ]);
    }

    public function test_generate_creates_plan_and_summary(): void
    {
        $year = (int) date('Y');
        $month = (int) date('n');

        $response = $this->postJson('/api/duties/generate', [
            'year' => $year,
            'month' => $month,
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'duties',
                'summary' => [
                    'employee_strain',
                    'occupation_strain',
                    'total_strain',
                    'forbidden',
                    'assigned_duties',
                ],
            ]);

        $this->assertGreaterThan(0, Duty::where('year', $year)->where('month', $month)->count());
        $this->assertFalse($response->json('summary.forbidden'));
    }

    public function test_generate_validates_input(): void
    {
        $this->postJson('/api/duties/generate', ['year' => 1999, 'month' => 13])
            ->assertStatus(422);
    }

    public function test_absent_employee_is_not_scheduled_during_absence(): void
    {
        $year = (int) date('Y');
        $month = (int) date('n');
        $employee = Employee::query()->firstOrFail();

        Absence::create([
            'employee_id' => $employee->id,
            'type' => 'vacation',
            'start_date' => sprintf('%04d-%02d-01', $year, $month),
            'end_date' => sprintf('%04d-%02d-10', $year, $month),
        ]);

        $this->postJson('/api/duties/generate', ['year' => $year, 'month' => $month])
            ->assertOk();

        $duringAbsence = Duty::where('employee_id', $employee->id)
            ->where('year', $year)->where('month', $month)
            ->whereBetween('day', [1, 10])
            ->count();

        $this->assertSame(0, $duringAbsence);
    }

    public function test_local_search_keeps_plan_rule_compliant_and_balanced(): void
    {
        $year = (int) date('Y');
        $month = (int) date('n');

        $this->postJson('/api/duties/generate', ['year' => $year, 'month' => $month])
            ->assertOk()
            ->assertJsonPath('summary.forbidden', false);

        $duties = \App\Models\Duty::with('shift.shift_type')
            ->where('year', $year)->where('month', $month)->get();

        $byEmp = [];
        foreach ($duties as $d) {
            $byEmp[$d->employee_id][$d->day] = $d->shift->shift_type->name;
        }

        $counts = [];
        foreach ($byEmp as $empId => $seq) {
            $counts[$empId] = count($seq);
            ksort($seq);
            $run = 0;
            $prevDay = null;
            $prevType = null;
            foreach ($seq as $day => $type) {
                $run = ($prevDay !== null && $day === $prevDay + 1) ? $run + 1 : 1;
                $this->assertLessThanOrEqual(
                    6, $run, "Mitarbeiter $empId hat mehr als 6 Dienste in Folge"
                );
                if ($prevDay !== null && $day === $prevDay + 1) {
                    $this->assertFalse(
                        $prevType === 'Nachtschicht' && $type === 'Frühschicht',
                        "Verbotener Übergang Nacht->Früh bei Mitarbeiter $empId"
                    );
                }
                $prevDay = $day;
                $prevType = $type;
            }
        }

        // Workload-erhaltender Tausch -> ausgewogene Verteilung bleibt.
        $this->assertLessThanOrEqual(
            6, max($counts) - min($counts),
            'Dienstverteilung nach lokaler Suche zu unausgewogen'
        );
    }
}
