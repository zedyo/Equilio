<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Qualification;
use App\Models\Shift;
use App\Models\ShiftType;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Database\Seeders\ShiftTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Deckt den vollen store -> show -> update -> destroy-Lebenszyklus der
 * Stammdaten-Resource-Controller ab. Bisher waren nur die GET-Listen
 * (ApiSmokeTest) und Validierungs-Ablehnungen getestet, nicht die
 * Schreib-/Lösch-Pfade inkl. Status-Codes und Employee-SoftDelete.
 */
class CrudLifecycleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            QualificationSeeder::class,
            EmployeeSeeder::class,
            ShiftTypeSeeder::class,
            ShiftSeeder::class,
        ]);
        $this->actingAsLeitung();
    }

    public function test_qualification_full_lifecycle(): void
    {
        $this->postJson('/api/qualifications', [
            'qualificationsData' => ['description' => 'Hilfskraft'],
        ])->assertCreated();

        $created = Qualification::where('description', 'Hilfskraft')->firstOrFail();

        $this->getJson('/api/qualifications/'.$created->id)
            ->assertOk()
            ->assertJsonPath('qualification.description', 'Hilfskraft');

        $this->patchJson('/api/qualifications/'.$created->id, [
            'qualificationData' => ['description' => 'Hilfskraft (geprüft)'],
        ])->assertOk()
            ->assertJsonPath('qualification.description', 'Hilfskraft (geprüft)');

        $this->deleteJson('/api/qualifications/'.$created->id)->assertOk();
        $this->assertSoftDeleted('qualifications', ['id' => $created->id]);
    }

    public function test_employee_lifecycle_uses_soft_delete(): void
    {
        $qualificationId = Qualification::query()->value('id');

        $this->postJson('/api/employees', [
            'employeeData' => [
                'first_name' => 'Test',
                'last_name' => 'Person',
                'daily_worktime' => 8,
                'employment_ratio' => 100,
                'qualification_id' => $qualificationId,
            ],
        ])->assertCreated();

        $employee = Employee::where('last_name', 'Person')->firstOrFail();

        $this->patchJson('/api/employees/'.$employee->id, [
            'employeeData' => [
                'first_name' => 'Test',
                'last_name' => 'Renamed',
                'daily_worktime' => 6,
                'employment_ratio' => 75,
                'qualification_id' => $qualificationId,
            ],
        ])->assertOk()
            ->assertJsonPath('employee.last_name', 'Renamed');

        $this->deleteJson('/api/employees/'.$employee->id)->assertOk();
        $this->assertSoftDeleted('employees', ['id' => $employee->id]);
    }

    public function test_employee_store_rejects_unknown_qualification(): void
    {
        $this->postJson('/api/employees', [
            'employeeData' => [
                'first_name' => 'Bad',
                'last_name' => 'Qualification',
                'daily_worktime' => 8,
                'employment_ratio' => 100,
                'qualification_id' => 999999,
            ],
        ])->assertStatus(422);
    }

    public function test_shift_full_lifecycle(): void
    {
        $shiftTypeId = ShiftType::query()->value('id');

        $this->postJson('/api/shifts', [
            'shiftsData' => [
                'abrv' => 'ZZ1',
                'color_hex' => '#abcdef',
                'h_duration' => 7.5,
                'shift_type_id' => $shiftTypeId,
            ],
        ])->assertCreated();

        $shift = Shift::where('abrv', 'ZZ1')->firstOrFail();
        $this->assertFalse((bool) $shift->manual_only);

        $this->patchJson('/api/shifts/'.$shift->id, [
            'shiftsData' => [
                'abrv' => 'ZZ1',
                'color_hex' => '#123456',
                'h_duration' => 8,
                'shift_type_id' => $shiftTypeId,
                'manual_only' => true,
            ],
        ])->assertOk()
            ->assertJsonPath('shift.manual_only', true);

        $this->deleteJson('/api/shifts/'.$shift->id)->assertOk();
        $this->assertSoftDeleted('shifts', ['id' => $shift->id]);
    }

    public function test_shift_type_full_lifecycle(): void
    {
        $this->postJson('/api/shift_types', [
            'shiftTypesData' => [
                'name' => 'Bereitschaft',
                'active_duty' => true,
                'min_occupation' => 1,
                'opt_occupation' => 2,
            ],
        ])->assertCreated();

        $type = ShiftType::where('name', 'Bereitschaft')->firstOrFail();

        $this->patchJson('/api/shift_types/'.$type->id, [
            'shiftTypeData' => [
                'name' => 'Bereitschaft (Nacht)',
                'active_duty' => false,
                'min_occupation' => 2,
                'opt_occupation' => 3,
            ],
        ])->assertOk()
            ->assertJsonPath('shift_type.name', 'Bereitschaft (Nacht)');

        $this->deleteJson('/api/shift_types/'.$type->id)->assertOk();
        $this->assertSoftDeleted('shift_types', ['id' => $type->id]);
    }

    public function test_crud_routes_require_leitung_role(): void
    {
        $this->actingAsPflegekraft();

        $this->postJson('/api/qualifications', [
            'qualificationsData' => ['description' => 'X'],
        ])->assertForbidden();
        $this->deleteJson('/api/employees/'.Employee::query()->value('id'))
            ->assertForbidden();
    }
}
