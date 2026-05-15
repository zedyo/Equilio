<?php

namespace Database\Seeders;

use App\Models\Absence;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class AbsenceSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::orderBy('id')->take(3)->get();
        if ($employees->isEmpty()) {
            return;
        }

        $year = (int) date('Y');
        $month = (int) date('m');

        $samples = [
            ['type' => 'vacation', 'start' => 5, 'end' => 12, 'note' => 'Jahresurlaub'],
            ['type' => 'sick', 'start' => 18, 'end' => 20, 'note' => null],
            ['type' => 'training', 'start' => 25, 'end' => 26, 'note' => 'Fortbildung'],
        ];

        foreach ($employees as $i => $employee) {
            $s = $samples[$i];
            Absence::create([
                'employee_id' => $employee->id,
                'type' => $s['type'],
                'start_date' => sprintf('%04d-%02d-%02d', $year, $month, $s['start']),
                'end_date' => sprintf('%04d-%02d-%02d', $year, $month, $s['end']),
                'note' => $s['note'],
            ]);
        }
    }
}
