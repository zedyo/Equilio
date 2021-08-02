<?php

namespace App\Http\Controllers;

use App\Models\Duty;
use App\Models\Employee;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DutyController extends Controller
{

    public function calendar($year, $month)
    {
        $employees = Employee::all();

        $new_date = Carbon::createFromDate($year, $month, 1);

        $days_of_month = [];

        for ($i = $new_date->day; ($new_date->month == $month && $new_date->year == $year); $new_date->addDay()) {
            $days_of_month[] = $i;
            $i++;
        };

        return response()->json([
            'employees' => $employees,
            'days_of_month' => $days_of_month,
            'year' => $year,
            'month' => $month
        ]);
    }

    public function update(Request $request) {
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
        } else if ($duty[0]->shift_id !== $request_shift[0]->id){

            $update_duty = Duty::where('id', $duty[0]->id)->first();
            $update_duty->shift_id = $request_shift[0]->id;

            $update_duty->save();

            return 'Eintrag verändert';
        } else {
            return 'Keine Änderung';
        }
    }
}
