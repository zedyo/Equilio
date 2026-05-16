<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\User;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
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

    public function test_protected_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/employees')->assertUnauthorized();
        $this->getJson('/api/user')->assertUnauthorized();
    }

    public function test_login_logout_and_me(): void
    {
        // Eine echte SPA sendet den Referer automatisch -> Sanctum
        // behandelt die Anfrage stateful (Session-Cookie).
        $this->withHeader('Referer', config('app.url'));

        User::create([
            'name' => 'Demo Leitung',
            'email' => 'demo@equilio.test',
            'password' => 'geheim123',
            'role' => User::ROLE_LEITUNG,
        ]);

        $this->postJson('/api/login', [
            'email' => 'demo@equilio.test',
            'password' => 'falsch',
        ])->assertStatus(422);

        $this->postJson('/api/login', [
            'email' => 'demo@equilio.test',
            'password' => 'geheim123',
        ])->assertOk()->assertJsonPath('role', User::ROLE_LEITUNG);

        $this->getJson('/api/user')->assertOk()->assertJsonPath('email', 'demo@equilio.test');
        $this->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Abgemeldet.');
    }

    public function test_leitung_has_full_access(): void
    {
        $this->actingAsLeitung();
        $this->getJson('/api/employees')->assertOk();
        $this->getJson('/api/shifts')->assertOk();
    }

    public function test_pflegekraft_is_blocked_from_leitung_routes(): void
    {
        $emp = Employee::orderBy('id')->firstOrFail();
        $this->actingAsPflegekraft($emp->id);

        $this->getJson('/api/employees')->assertForbidden();
        $this->postJson('/api/duties/generate', [
            'year' => (int) date('Y'), 'month' => (int) date('n'),
        ])->assertForbidden();
        $this->patchJson('/api/duty', [])->assertForbidden();
    }

    public function test_pflegekraft_sees_only_own_data(): void
    {
        $employees = Employee::orderBy('id')->take(2)->get();
        $own = $employees[0];
        $other = $employees[1];
        $this->actingAsPflegekraft($own->id);

        $year = (int) date('Y');
        $month = (int) date('n');

        $this->getJson("/api/duties/$year/$month/{$own->id}")
            ->assertOk()->assertJsonStructure(['duties']);
        $this->getJson("/api/duties/$year/$month/{$other->id}")
            ->assertForbidden();
        $this->getJson("/api/wishesByEmployee/{$other->id}")
            ->assertForbidden();

        // Lesedaten zum Rendern bleiben erlaubt.
        $this->getJson('/api/shifts')->assertOk();
    }

    public function test_pflegekraft_can_manage_own_wishes(): void
    {
        $own = Employee::orderBy('id')->firstOrFail();
        $shiftId = \App\Models\Shift::orderBy('id')->firstOrFail()->id;
        $this->actingAsPflegekraft($own->id);

        $this->postJson('/api/wish', ['wishData' => [
            'employee_id' => $own->id,
            'shift_id' => $shiftId,
            'day' => 10, 'month' => (int) date('n'), 'year' => (int) date('Y'),
        ]])->assertCreated();

        $this->assertDatabaseHas('wishes', [
            'employee_id' => $own->id, 'day' => 10,
        ]);
    }
}
