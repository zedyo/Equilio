<?php

namespace App\Console\Commands;

use App\Models\Absence;
use App\Models\Employee;
use App\Models\ShiftType;
use App\Services\RosterGenerator;
use Carbon\Carbon;
use Illuminate\Console\Command;

/**
 * Reproduzierbare Generator-Evaluation (ersetzt die früheren /tmp-Skripte).
 * Read-only: generiert einen Vorschlag und prüft harte Constraints +
 * Kennzahlen, ohne in die DB zu schreiben. Siehe algorithm-notes.md.
 */
class EvaluateRoster extends Command
{
    protected $signature = 'roster:evaluate {year?} {month?}';

    protected $description = 'Generiert einen Monatsvorschlag und prüft Regeln/Kennzahlen (read-only).';

    public function handle(RosterGenerator $generator): int
    {
        $year = (int) ($this->argument('year') ?: date('Y'));
        $month = (int) ($this->argument('month') ?: date('n'));
        $days = Carbon::create($year, $month, 1)->daysInMonth;

        $res = $generator->generate($year, $month);
        $s = $res['summary'];

        $employees = Employee::orderBy('id')->get();
        $plan = []; // [empId][day] = shiftTypeName
        foreach ($res['duties'] as $d) {
            $type = ShiftType::find(
                \App\Models\Shift::find($d['shift_id'])->shift_type_id
            )->name;
            $plan[$d['employee_id']][$d['day']] = $type;
        }

        $this->info("=== Evaluation $month/$year ($days Tage, {$s['assigned_duties']} Dienste) ===");
        $this->line(sprintf(
            'Belastungsindex %s  (MA %s / Besetzung %s / Qualifikation %s)',
            $s['total_strain'], $s['employee_strain'],
            $s['occupation_strain'], $s['qualification_strain']
        ));
        $this->line('Stunden-Ungleichgewicht: '.$s['hours_imbalance']);
        $this->line('Regelkonform: '.($s['forbidden'] ? 'NEIN' : 'JA'));

        // Harte Constraints
        $absViol = 0;
        foreach (Absence::all() as $a) {
            for ($d = 1; $d <= $days; $d++) {
                $date = sprintf('%04d-%02d-%02d', $year, $month, $d);
                if ($a->coversDate($date) && isset($plan[$a->employee_id][$d])) {
                    $absViol++;
                }
            }
        }
        $maxRun = 0;
        $nightToEarly = 0;
        foreach ($plan as $seq) {
            ksort($seq);
            $run = 0;
            $prevDay = null;
            $prevType = null;
            foreach ($seq as $day => $type) {
                $run = ($prevDay !== null && $day === $prevDay + 1) ? $run + 1 : 1;
                $maxRun = max($maxRun, $run);
                if ($prevDay !== null && $day === $prevDay + 1
                    && $prevType === 'Nachtschicht' && $type === 'Frühschicht') {
                    $nightToEarly++;
                }
                $prevDay = $day;
                $prevType = $type;
            }
        }

        $this->line('');
        $this->line('-- Harte Constraints --');
        $this->line("Abwesenheits-Verletzungen: $absViol");
        $this->line("Längste Dienstserie: $maxRun (Grenze ".config('rostering.max_consecutive_duties').')');
        $this->line("Nacht→Früh-Übergänge: $nightToEarly");
        $this->line('Schicht-Tage ohne Fachkraft: '.$s['missing_qualification']);

        // Mindestbesetzung
        $this->line('');
        $this->line('-- Mindestbesetzung --');
        foreach (ShiftType::where('active_duty', true)->get() as $t) {
            $min = (int) $t->min_occupation;
            if ($min <= 0) {
                continue;
            }
            $under = 0;
            for ($d = 1; $d <= $days; $d++) {
                $cnt = 0;
                foreach ($plan as $seq) {
                    if (($seq[$d] ?? null) === $t->name) {
                        $cnt++;
                    }
                }
                if ($cnt < $min) {
                    $under++;
                }
            }
            $this->line(sprintf('%-14s min %d/opt %d: %d/%d Tage unterbesetzt',
                $t->name, $min, $t->opt_occupation, $under, $days));
        }

        // Fairness / Stundenkonto
        $this->line('');
        $this->line('-- Verteilung & Stundenkonto --');
        $hoursById = collect($res['hours'])->keyBy('employee_id');
        foreach ($employees as $e) {
            $cnt = isset($plan[$e->id]) ? count($plan[$e->id]) : 0;
            $h = $hoursById[$e->id] ?? ['soll' => 0, 'ist' => 0, 'diff' => 0];
            $this->line(sprintf('%-22s %3d%%  %2d Dienste  Soll %.1f / Ist %.1f (%+.1f)',
                $e->first_name.' '.$e->last_name, (int) $e->employment_ratio,
                $cnt, $h['soll'], $h['ist'], $h['diff']));
        }

        $hard = $absViol === 0
            && $maxRun <= (int) config('rostering.max_consecutive_duties')
            && $nightToEarly === 0
            && ! $s['forbidden'];

        $this->line('');
        $this->{$hard ? 'info' : 'error'}(
            $hard ? 'Alle harten Constraints eingehalten.' : 'HARTE CONSTRAINTS VERLETZT!'
        );

        return $hard ? self::SUCCESS : self::FAILURE;
    }
}
