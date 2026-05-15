<?php

namespace Database\Factories;

use App\Models\Absence;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class AbsenceFactory extends Factory
{
    protected $model = Absence::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 month', '+1 month');
        $end = (clone $start)->modify('+'.$this->faker->numberBetween(0, 9).' days');

        return [
            'employee_id' => Employee::factory(),
            'type' => $this->faker->randomElement(Absence::TYPES),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $end->format('Y-m-d'),
            'note' => null,
        ];
    }
}
