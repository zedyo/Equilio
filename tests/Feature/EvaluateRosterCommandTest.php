<?php

namespace Tests\Feature;

use Database\Seeders\AbsenceSeeder;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\QualificationSeeder;
use Database\Seeders\ShiftSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluateRosterCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_evaluate_command_runs_and_reports(): void
    {
        $this->seed([
            QualificationSeeder::class,
            EmployeeSeeder::class,
            ShiftSeeder::class,
            AbsenceSeeder::class,
        ]);

        $year = (int) date('Y');
        $month = (int) date('n');

        $this->artisan('roster:evaluate', ['year' => $year, 'month' => $month])
            ->expectsOutputToContain("=== Evaluation $month/$year")
            ->expectsOutputToContain('Harte Constraints')
            ->expectsOutputToContain('Mindestbesetzung')
            ->expectsOutputToContain('Verteilung & Stundenkonto')
            ->assertExitCode(0);
    }
}
