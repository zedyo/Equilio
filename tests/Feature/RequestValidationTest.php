<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Shift;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Phase 1.3 – Datenmodell härten: die früher ungeprüften
 * Action-Endpoints (Duty/Wish/Preference) liefern bei Fehleingaben
 * jetzt 422 statt 500 (FormRequests).
 */
class RequestValidationTest extends TestCase
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
        $this->actingAsLeitung();
    }

    public function test_duty_update_rejects_empty_payload(): void
    {
        $this->patchJson('/api/duty', [])->assertStatus(422);
    }

    public function test_duty_delete_rejects_unknown_employee(): void
    {
        $this->deleteJson('/api/duty', ['dutyData' => [
            'employee_id' => 999999,
            'day' => 5, 'month' => 5, 'year' => 2026,
        ]])->assertStatus(422);
    }

    public function test_wish_create_rejects_missing_fields(): void
    {
        $this->postJson('/api/wish', ['wishData' => [
            'employee_id' => Employee::value('id'),
        ]])->assertStatus(422);
    }

    public function test_wish_create_rejects_unknown_shift(): void
    {
        $this->postJson('/api/wish', ['wishData' => [
            'employee_id' => Employee::value('id'),
            'shift_id' => 999999,
            'day' => 1, 'month' => 5, 'year' => 2026,
        ]])->assertStatus(422);
    }

    public function test_preference_create_rejects_invalid_level(): void
    {
        $this->postJson('/api/preference', ['preferenceData' => [
            'employee_id' => Employee::value('id'),
            'shift_id' => Shift::value('id'),
            'level' => 'lieblings',
        ]])->assertStatus(422);
    }

    public function test_preference_delete_requires_shift(): void
    {
        $this->deleteJson('/api/preference', ['preferenceData' => [
            'employee_id' => Employee::value('id'),
        ]])->assertStatus(422);
    }

    public function test_valid_wish_still_succeeds(): void
    {
        $this->postJson('/api/wish', ['wishData' => [
            'employee_id' => Employee::value('id'),
            'shift_id' => Shift::value('id'),
            'day' => 12, 'month' => 5, 'year' => 2026,
        ]])->assertCreated();
    }
}
