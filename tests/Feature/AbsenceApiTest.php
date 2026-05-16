<?php

namespace Tests\Feature;

use App\Models\Absence;
use App\Models\Employee;
use App\Models\Qualification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AbsenceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAsLeitung();
    }

    private function makeEmployee(): Employee
    {
        $qualification = Qualification::create(['description' => 'Exam. Pfleger:in']);

        return Employee::create([
            'first_name' => 'Vince',
            'last_name' => 'Testy',
            'qualification_id' => $qualification->id,
            'daily_worktime' => 8,
            'employment_ratio' => 100,
        ]);
    }

    public function test_index_returns_absences_with_employee(): void
    {
        $employee = $this->makeEmployee();
        Absence::create([
            'employee_id' => $employee->id,
            'type' => 'vacation',
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-05',
        ]);

        $this->getJson('/api/absences')
            ->assertOk()
            ->assertJsonPath('absences.0.type', 'vacation')
            ->assertJsonPath('absences.0.employee.last_name', 'Testy');
    }

    public function test_store_creates_absence(): void
    {
        $employee = $this->makeEmployee();

        $this->postJson('/api/absences', [
            'employee_id' => $employee->id,
            'type' => 'sick',
            'start_date' => '2026-06-10',
            'end_date' => '2026-06-12',
            'note' => 'Grippe',
        ])->assertCreated()->assertJsonPath('absence.type', 'sick');

        $this->assertDatabaseHas('absences', [
            'employee_id' => $employee->id,
            'type' => 'sick',
        ]);
    }

    public function test_store_validates_date_order_and_type(): void
    {
        $employee = $this->makeEmployee();

        $this->postJson('/api/absences', [
            'employee_id' => $employee->id,
            'type' => 'vacation',
            'start_date' => '2026-06-10',
            'end_date' => '2026-06-01',
        ])->assertStatus(422)->assertJsonValidationErrors('end_date');

        $this->postJson('/api/absences', [
            'employee_id' => $employee->id,
            'type' => 'invalid',
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-02',
        ])->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_destroy_deletes_absence(): void
    {
        $employee = $this->makeEmployee();
        $absence = Absence::create([
            'employee_id' => $employee->id,
            'type' => 'training',
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-02',
        ]);

        $this->deleteJson("/api/absences/{$absence->id}")->assertOk();
        $this->assertSoftDeleted('absences', ['id' => $absence->id]);
    }
}
