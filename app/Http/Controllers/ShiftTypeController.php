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

    public function store(Request $request)
    {
        $shift_type = new ShiftType();
        $shift_type->name = $request->shiftTypeData['name'];
        $shift_type->save;

        return response()->json([null], 201);
    }

    public function show(ShiftType $shiftType)
    {
        return ['shift_type' => $shiftType];
    }

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
