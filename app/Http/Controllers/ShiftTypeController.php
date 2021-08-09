<?php

namespace App\Http\Controllers;

use App\Models\ShiftType;
use Illuminate\Http\Request;

class ShiftTypeController extends Controller
{
    public function index()
    {
        try {
            $shift_type = ShiftType::all();

            if (count($shift_type) == 0) {
                return response()->json('Keine Schicht Arten vorhanden!', 404);
            }

            return [
                'shift_type' => $shift_type
            ];
        } catch (\Exception $exception) {
            return response()->json([
                'exception' => $exception->getMessage()
            ], 500);
        }


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
     * @param  \App\Models\ShiftType  $shiftType
     * @return \Illuminate\Http\Response
     */
    public function show(ShiftType $shiftType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ShiftType  $shiftType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ShiftType $shiftType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ShiftType  $shiftType
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShiftType $shiftType)
    {
        //
    }
}
