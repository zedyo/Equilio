<?php

namespace App\Http\Controllers;

use App\Models\Duty;
use App\Models\Preference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PreferenceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $preferences = Preference::all();

        return response()->json(['preferences' => $preferences]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, Preference $preference)
    {
        $preference_check = Preference::where('employee_id', $request->preferenceData['employee_id']);
        $preference_check->where('shift_id', $request->preferenceData['shift_id']);
        $preference = $preference_check->get();

        if ($request->preferenceData['active'] == 1) {
            if ($preference->isEmpty()) {

                $new_preference = new Preference();
                $new_preference->employee_id = $request->preferenceData['employee_id'];
                $new_preference->shift_id = $request->preferenceData['shift_id'];
                $new_preference->save();

                DB::table('duties')->where('employee_id', '=', $request->preferenceData['employee_id'])->where('shift_id', '=', $request->preferenceData['shift_id'])->update(['preference_injury' => 0]);

                return response()->json(['preference' => $new_preference], 201);
            }
        } else {
            DB::table('duties')->where('employee_id', '=', $request->preferenceData['employee_id'])->where('shift_id', '=', $request->preferenceData['shift_id'])->update(['preference_injury' => 1]);

            // $preference = $preference[0];
            $preference[0]->delete();

            Log::debug($preference);

            return response()->json(['preference' => $preference[0]], 201);
        };
        // $wish_check = Wish::where('employee_id', $request->wishData['employee_id']);
        // $wish_check->where('day', $request->wishData['day']);
        // $wish_check->where('month', $request->wishData['month']);
        // $wish_check->where('year', $request->wishData['year']);
        // $wish = $wish_check->get();

        // if ($wish->isEmpty()) {
        //     $new_wish = new Wish();
        //     $new_wish->employee_id = $request->wishData['employee_id'];
        //     $new_wish->shift_id = $request->wishData['shift_id'];
        //     $new_wish->day = $request->wishData['day'];
        //     $new_wish->month = $request->wishData['month'];
        //     $new_wish->year = $request->wishData['year'];

        //     $new_wish->save();

        //     $duty_check = Duty::where('employee_id', $request->wishData['employee_id']);
        //     $duty_check->where('day', $request->wishData['day']);
        //     $duty_check->where('month', $request->wishData['month']);
        //     $duty_check->where('year', $request->wishData['year']);
        //     $duty = $duty_check->get();

        //     if ($duty->isEmpty() == false && ($duty[0]->shift_id != $request->wishData['shift_id'])) {
        //         $update_duty_wish = Duty::where('id', $duty[0]->id)->first();
        //         $update_duty_wish->wish_injury = 1;
        //         $update_duty_wish->save();
        //     } else {
        //         $update_duty_wish = Duty::where('id', $duty[0]->id)->first();
        //         $update_duty_wish->wish_injury = 0;
        //         $update_duty_wish->save();
        //     }

        //     $wish = Wish::with('shift')->where('id', $new_wish->id)->first();

        //     return response()->json(['new_wish' => $wish], 201);
        // } else {
        //     return response()->json(['new_wish' => $wish], 201);
        // }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Preference  $preference
     * @return \Illuminate\Http\Response
     */
    public function show(Preference $preference)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Preference  $preference
     * @return \Illuminate\Http\Response
     */
    public function edit(Preference $preference)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Preference  $preference
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Preference $preference)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Preference  $preference
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request, Preference $preference)
    {
        Log::debug($request);

        $preference_check = Preference::where('employee_id', $request->preferenceData['employee_id']);
        $preference_check->where('shift_id', $request->preferenceData['shift_id']);
        $preference = $preference_check->get();

        if ($preference->isEmpty()) {


            return response()->json(['preference schon gelöscht'], 201);
        } else {

            $preference->delete();
            return response()->json(['deleted_preference' => $preference], 201);
        };
    }
}
