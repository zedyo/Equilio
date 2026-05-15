<?php

namespace Tests\Feature;

use App\Models\Duty;
use App\Models\Employee;
use App\Models\Qualification;
use App\Models\Shift;
use App\Services\RosterGenerator;
use Database\Seeders\RealRosterSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RealRosterSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RealRosterSeeder::class);
    }

    public function test_seeds_anonymized_real_world_dataset(): void
    {
        $this->assertSame(7, Qualification::count());
        $this->assertSame(36, Employee::count());
        $this->assertSame(2779, Duty::count());
        $this->assertEqualsCanonicalizing(
            [1, 2, 3, 4, 5],
            Duty::distinct()->pluck('month')->all()
        );
        $this->assertSame(0, Duty::where('year', '!=', 2018)->count());

        // Examinierte vorhanden (Qual-Mix realistisch).
        $this->assertGreaterThanOrEqual(
            4,
            Employee::whereHas('qualification', fn ($q) => $q->where('description', 'Examinierte Pflegefachkraft'))->count()
        );

        // Referentielle Integrität: jede Duty zeigt auf realen MA + Shift.
        $empIds = Employee::pluck('id')->all();
        $shiftIds = Shift::pluck('id')->all();
        foreach (Duty::all() as $d) {
            $this->assertContains($d->employee_id, $empIds);
            $this->assertContains($d->shift_id, $shiftIds);
        }

        // Anonymisiert: deterministische fiktive Namen (kein Klarname
        // aus der Quelle im Repo). Erster MA == fester Fake-Name.
        $first = Employee::orderBy('id')->first();
        $this->assertSame('Anna', $first->first_name);
        $this->assertSame('Albers', $first->last_name);
    }

    public function test_generator_runs_against_real_stammdaten(): void
    {
        config(['rostering.required_qualification' => 'Examinierte Pflegefachkraft']);

        // Voller realer Bestand (36 MA): oberhalb der Lokalsuche-Schwelle
        // optimiert allein das memoisierte SA -> interaktiv (~0,6 s statt
        // vormals ~77 s). Siehe real-roster-insights.md.
        $result = app(RosterGenerator::class)->generate(2026, 6);

        $this->assertArrayHasKey('summary', $result);
        $this->assertFalse(
            $result['summary']['forbidden'],
            'Generierter Plan auf realen Stammdaten muss regelkonform sein'
        );
        // Generator ist ein reiner Vorschlag (persistiert nicht selbst).
        $this->assertGreaterThan(0, count($result['duties']));
    }
}
