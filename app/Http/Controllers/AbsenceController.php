<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AbsenceController extends Controller
{
    public function index(Request $request)
    {
        $query = Absence::with('employee');

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->integer('employee_id'));
        }
        if ($request->filled('year') && $request->filled('month')) {
            // Abwesenheiten, die den angefragten Monat berühren
            $year = $request->integer('year');
            $month = $request->integer('month');
            $start = sprintf('%04d-%02d-01', $year, $month);
            $end = date('Y-m-t', strtotime($start));
            $query->where('start_date', '<=', $end)
                ->where('end_date', '>=', $start);
        }

        return response()->json(['absences' => $query->orderBy('start_date')->get()]);
    }

    public function store(Request $request)
    {
        $data = $this->validateAbsence($request);

        $absence = Absence::create($data);

        return response()->json(['absence' => $absence->load('employee')], 201);
    }

    public function show(Absence $absence)
    {
        return response()->json(['absence' => $absence->load('employee')]);
    }

    public function update(Request $request, Absence $absence)
    {
        $absence->update($this->validateAbsence($request));

        return response()->json(['absence' => $absence->load('employee')], 200);
    }

    public function destroy(Absence $absence)
    {
        $deleted = $absence;
        $absence->delete();

        return response()->json(['deleted_absence' => $deleted]);
    }

    private function validateAbsence(Request $request): array
    {
        return $request->validate([
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'type' => ['required', Rule::in(Absence::TYPES)],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
