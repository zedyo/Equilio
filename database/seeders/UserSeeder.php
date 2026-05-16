<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Demo-Accounts für Auth/Rollen (Phase 3.10). Identisch zum
 * In-Browser-Mock (resources/js/mock/mockApi.js), damit die Pages-Demo
 * und das echte Backend dieselben Logins haben.
 *
 *  Leitung:     leitung@equilio.test  / password
 *  Pflegekraft: pflege@equilio.test   / password  (an 1. Mitarbeiter:in)
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'leitung@equilio.test'],
            [
                'name' => 'Leitung Demo',
                'password' => Hash::make('password'),
                'role' => User::ROLE_LEITUNG,
                'employee_id' => null,
            ]
        );

        $employees = Employee::orderBy('id')->take(3)->get();
        foreach ($employees as $i => $emp) {
            $email = $i === 0 ? 'pflege@equilio.test' : 'pflege'.($i + 1).'@equilio.test';
            User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $emp->first_name.' '.$emp->last_name,
                    'password' => Hash::make('password'),
                    'role' => User::ROLE_PFLEGEKRAFT,
                    'employee_id' => $emp->id,
                ]
            );
        }
    }
}
