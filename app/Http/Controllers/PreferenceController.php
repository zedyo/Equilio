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
     * Präferenzen einer Person (Pflegekraft: nur die eigenen).
     */
    public function getEmployeePreferenceData(Request $request, $employee_id)
    {
        $this->authorizeEmployee($employee_id);

        return response()->json([
            'preferences' => Preference::where('employee_id', $employee_id)->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, Preference $preference)
    {
        $data = $request->preferenceData;
        $employeeId = $data['employee_id'];
        $shiftId = $data['shift_id'];
        $this->authorizeEmployee($employeeId);
        // 3 Stufen: 'preferred' (bevorzugt), 'valid' (erlaubt/neutral),
        // 'blocked' (darf nie vergeben werden). 'valid' = kein Datensatz.
        $level = $data['level'] ?? 'preferred';
        if (! in_array($level, ['preferred', 'valid', 'blocked'], true)) {
            $level = 'valid';
        }

        $existing = Preference::where('employee_id', $employeeId)
            ->where('shift_id', $shiftId)
            ->first();

        if ($level === 'valid') {
            if ($existing) {
                $existing->delete();
            }
            DB::table('duties')
                ->where('employee_id', $employeeId)
                ->where('shift_id', $shiftId)
                ->update(['preference_injury' => 1]);

            return response()->json([
                'preference' => [
                    'employee_id' => (int) $employeeId,
                    'shift_id' => (int) $shiftId,
                    'level' => 'valid',
                ],
            ], 201);
        }

        $row = $existing ?: new Preference();
        $row->employee_id = $employeeId;
        $row->shift_id = $shiftId;
        $row->level = $level;
        $row->save();

        DB::table('duties')
            ->where('employee_id', $employeeId)
            ->where('shift_id', $shiftId)
            ->update(['preference_injury' => $level === 'preferred' ? 0 : 1]);

        return response()->json(['preference' => $row], 201);
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

        $this->authorizeEmployee($request->preferenceData['employee_id']);

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
