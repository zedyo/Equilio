<?php

namespace App\Http\Controllers;

use App\Models\Duty;
use App\Models\Employee;
use App\Models\Shift;
use Illuminate\Http\Request;

class DutyController extends Controller
{
    public function overview()
    {
        $employees = Employee::all();

        return response()->json(['employees' => $employees]);
    }

    public function getDutiesData(Request $request, $year, $month, $employee_id)
    {
        $duties_db = Duty::with('shift');
        $duties_db->where('month', $month);
        $duties_db->where('year', $year);
        $duties_db->where('employee_id', $employee_id);
        $duties = $duties_db->get();

        return ['duties' => $duties];
    }

    public function getAllDutiesData(Request $request, $year, $month)
    {
        $duties_db = Duty::with('shift');
        $duties_db->where('month', $month);
        $duties_db->where('year', $year);
        $duties = $duties_db->get();

        return ['duties' => $duties];
    }

    public function show(Request $request, $day, $month, $year, $employee_id)
    {
        $duty_check = Duty::where('employee_id', $request->employee_id);
        $duty_check->where('day', $request->day);
        $duty_check->where('month', $request->month);
        $duty_check->where('year', $request->year);

        $duty = $duty_check->get()->first();

        $shift_check = Shift::where('id', $duty->shift_id);
        $shift = $shift_check->get()->first();

        return ['shift' => $shift];
    }

    public function update(Request $request)
    {
        $shift_check = Shift::where('abrv', $request->value);
        $request_shift = $shift_check->get();

        if ($request_shift->isEmpty()) {
            return 'Keine Schicht mit dieser Abkürzung!';
        }

        $duty_check = Duty::where('employee_id', $request->employee_id);
        $duty_check->where('day', $request->day);
        $duty_check->where('month', $request->month);
        $duty_check->where('year', $request->year);

        $duty = $duty_check->get();

        if ($duty->isEmpty()) {
            $new_duty = new Duty();
            $new_duty->employee_id = $request->employee_id;
            $new_duty->shift_id = $request_shift[0]->id;
            $new_duty->day = $request->day;
            $new_duty->month = $request->month;
            $new_duty->year = $request->year;

            $new_duty->save();

            return 'Neuer Duty Eintrag erstellt!';
        } else if ($duty[0]->shift_id !== $request_shift[0]->id) {

            $update_duty = Duty::where('id', $duty[0]->id)->first();
            $update_duty->shift_id = $request_shift[0]->id;

            $update_duty->save();

            return 'Eintrag verändert';
        } else {
            return 'Keine Änderung';
        }
    }
}
