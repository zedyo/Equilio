<?php

namespace Tests\Feature;

use App\Models\Duty;
use App\Models\Employee;
use App\Models\Preference;
use App\Models\Shift;
use App\Models\Wish;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Database\Seeders\ShiftTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Sichert die Kern-Domänenlogik in DutyController::update ab: das
 * Setzen von wish_injury / preference_injury beim Anlegen und beim
 * Ändern einer Duty. Dieses Verhalten steuert die rote/gelbe Markierung
 * im Kalender und war bislang nicht getestet.
 */
class DutyInjuryTest extends TestCase
{
    use RefreshDatabase;

    private int $employeeId;

    private Shift $shiftA;

    private Shift $shiftB;

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

        $this->employeeId = (int) Employee::query()->value('id');
        $shifts = Shift::query()->orderBy('id')->take(2)->get();
        $this->shiftA = $shifts[0];
        $this->shiftB = $shifts[1];
    }

    private function patchDuty(string $abrv): \Illuminate\Testing\TestResponse
    {
        return $this->patchJson('/api/duty', [
            'dutyData' => [
                'value' => $abrv,
                'employee_id' => $this->employeeId,
                'day' => 10,
                'month' => 6,
                'year' => 2026,
            ],
        ]);
    }

    public function test_new_duty_without_wish_or_preference_flags_only_preference(): void
    {
        $this->patchDuty($this->shiftA->abrv)->assertOk();

        $this->assertDatabaseHas('duties', [
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'wish_injury' => 0,
            'preference_injury' => 1,
        ]);
    }

    public function test_new_duty_matching_wish_has_no_wish_injury(): void
    {
        Wish::create([
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'day' => 10,
            'month' => 6,
            'year' => 2026,
        ]);

        $this->patchDuty($this->shiftA->abrv)->assertOk();

        $this->assertDatabaseHas('duties', [
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'wish_injury' => 0,
        ]);
    }

    public function test_new_duty_violating_wish_sets_wish_injury(): void
    {
        Wish::create([
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftB->id,
            'day' => 10,
            'month' => 6,
            'year' => 2026,
        ]);

        $this->patchDuty($this->shiftA->abrv)->assertOk();

        $this->assertDatabaseHas('duties', [
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'wish_injury' => 1,
        ]);
    }

    public function test_new_duty_matching_preference_clears_preference_injury(): void
    {
        Preference::create([
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'level' => 1,
        ]);

        $this->patchDuty($this->shiftA->abrv)->assertOk();

        $this->assertDatabaseHas('duties', [
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'preference_injury' => 0,
        ]);
    }

    public function test_changing_duty_recomputes_injuries(): void
    {
        // Wunsch + Präferenz auf Schicht A; zuerst korrekt setzen.
        Wish::create([
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'day' => 10,
            'month' => 6,
            'year' => 2026,
        ]);
        Preference::create([
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'level' => 1,
        ]);

        $this->patchDuty($this->shiftA->abrv)->assertOk();
        $this->assertDatabaseHas('duties', [
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftA->id,
            'wish_injury' => 0,
            'preference_injury' => 0,
        ]);

        // Auf Schicht B umstellen -> beide verletzt.
        $this->patchDuty($this->shiftB->abrv)->assertOk();
        $this->assertDatabaseHas('duties', [
            'employee_id' => $this->employeeId,
            'shift_id' => $this->shiftB->id,
            'wish_injury' => 1,
            'preference_injury' => 1,
        ]);

        $this->assertSame(1, Duty::where('employee_id', $this->employeeId)
            ->where('day', 10)->where('month', 6)->where('year', 2026)->count());
    }

    public function test_unchanged_duty_returns_without_creating_duplicate(): void
    {
        $this->patchDuty($this->shiftA->abrv)->assertOk();
        $this->patchDuty($this->shiftA->abrv)->assertOk();

        $this->assertSame(1, Duty::where('employee_id', $this->employeeId)
            ->where('day', 10)->where('month', 6)->where('year', 2026)->count());
    }
}
