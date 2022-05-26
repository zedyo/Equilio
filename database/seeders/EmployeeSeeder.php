<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Qualification;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dummyEmployee = new Employee([
            'qualification_id' => 1,
            'first_name' => 'Vince',
            'last_name' => 'Testy',
            'daily_worktime' => 8.00,
            'employment_ratio' => 100
        ]);
        $dummyEmployee->save();

        $qualifications = Qualification::all();

        $employees = Employee::factory(10)->make();

        foreach ($employees as $employee) {
            $employee->qualification_id = $qualifications->random(1)->first()->id;
            $employee->save();
        }
    }
}
