<?php

namespace App\Http\Controllers;

use App\Models\Duty;
use App\Models\Employee;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use phpDocumentor\Reflection\Types\Integer;

class DutyController extends Controller
{

    /**
     * @param $year
     * @param $month
     * @return JsonResponse
     */
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


    public function changeMonth($year, $month) {
        dd('test');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
//        $employees = Employee::all();
//
//        $year = 2019;
//        $month =  02;
//
//        $new_date = Carbon::createFromDate($year, $month, 1);
//
//        $days_of_month = [];
//
//
//        for ($i = $new_date->day; ($new_date->month === $month && $new_date->year === $year); $new_date->addDay()) {
//          $days_of_month[] = $i;
//          $i++;
//        };
//
//        return view ('duties.index', [
//            'employees' => $employees,
//            'days_of_month' => $days_of_month
//        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {


    }

    public function store(Request $request)
    {
//        Log::emergency($request->value);

        $duty_check = Duty::where('employee_id', 2);
        $duty_check->where('shift_id', 1);
        $duty_check->where('day', 7);
        $duty_check->where('month', 8);
        $duty_check->where('year', 2021);

        $duty = $duty_check->get();

        Log::emergency($duty);

        if ($duty->empty()) {
            return ['NADA'];
//            return response()->json([null], 404);
        }

//        return ['TEST' => $request->all(), ];
        return [$duty];


        // TODO: FindOne/All finden
        // TODO: Ziel: Finden von der vorhandenen Datei.

//        $duty = new Duty();

//        $duty->id = $request->dutyData['id'];
//        $duty->employee_id = $request->dutyData['employee_id'];
//        $duty->shift_id = $request->dutyData['shift_id'];
//        $duty->day = $request->dutyData['day'];
//        $duty->month = $request->dutyData['month'];
//        $duty->year = $request->dutyData['year'];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Duty  $duty
     * @return Response
     */
    public function show(Duty $duty)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Duty  $duty
     * @return Response
     */
    public function edit(Duty $duty)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Duty  $duty
     * @return Response
     */
    public function update(Request $request, Duty $duty)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Duty  $duty
     * @return Response
     */
    public function destroy(Duty $duty)
    {
        //
    }
}
