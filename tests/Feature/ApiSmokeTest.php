<?php

namespace Tests\Feature;

use App\Models\Duty;
use App\Models\Employee;
use Database\Seeders\AbsenceSeeder;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiSmokeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Nur Domänendaten seeden (keine User-Factory -> umgeht den
        // L12 hashed-password/BCRYPT_ROUNDS-Test-Gotcha).
        $this->seed([
            QualificationSeeder::class,
            EmployeeSeeder::class,
            ShiftSeeder::class,
            AbsenceSeeder::class,
        ]);
        $this->actingAsLeitung();
    }

    public function test_core_get_endpoints_return_ok(): void
    {
        $this->getJson('/api/employees')->assertOk()->assertJsonStructure(['employees']);
        $this->getJson('/api/qualifications')->assertOk()->assertJsonStructure(['qualifications']);
        $this->getJson('/api/shifts')
            ->assertOk()
            ->assertJsonPath('shifts.0.shift_type.id', fn ($id) => $id !== null);
        $this->getJson('/api/shift_types')->assertOk()->assertJsonStructure(['shift_types']);
        $this->getJson('/api/absences')->assertOk()->assertJsonStructure(['absences']);
        $this->getJson('/api/duties/'.date('Y').'/'.date('n'))
            ->assertOk()->assertJsonStructure(['duties']);
    }

    public function test_employee_store_validation_rejects_bad_input(): void
    {
        $this->postJson('/api/employees', ['employeeData' => ['first_name' => '']])
            ->assertStatus(422);
    }

    public function test_duty_delete_uses_delete_verb(): void
    {
        $employee = Employee::query()->firstOrFail();
        $duty = Duty::create([
            'employee_id' => $employee->id, 'shift_id' => 1,
            'day' => 5, 'month' => (int) date('n'), 'year' => (int) date('Y'),
            'wish_injury' => 0, 'preference_injury' => 1,
        ]);

        $this->deleteJson('/api/duty', ['dutyData' => [
            'employee_id' => $employee->id, 'day' => 5,
            'month' => (int) date('n'), 'year' => (int) date('Y'),
        ]])->assertOk();

        $this->assertDatabaseMissing('duties', ['id' => $duty->id]);
    }
}
