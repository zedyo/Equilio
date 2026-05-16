<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    protected function actingAsLeitung(): User
    {
        $user = User::create([
            'name' => 'Test Leitung',
            'email' => 'leitung.'.uniqid().'@test.local',
            'password' => 'password',
            'role' => User::ROLE_LEITUNG,
        ]);
        Sanctum::actingAs($user);

        return $user;
    }

    protected function actingAsPflegekraft($employeeId = null): User
    {
        $user = User::create([
            'name' => 'Test Pflege',
            'email' => 'pflege.'.uniqid().'@test.local',
            'password' => 'password',
            'role' => User::ROLE_PFLEGEKRAFT,
            'employee_id' => $employeeId,
        ]);
        Sanctum::actingAs($user);

        return $user;
    }
}
