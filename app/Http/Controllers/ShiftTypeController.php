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

    public function show(ShiftType $shift_type)
    {
        return ['shift_type' => $shift_type]; 
    }

    public function update(Request $request, ShiftType $shift_type)
    {
        $shift_type->name = $request->shiftTypeData['name'];

        $shift_type->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ShiftType  $shift_type
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShiftType $shift_type)
    {
        $deleted_shift_type = $shift_type;

        $shift_type->delete();

        return['deleted_shift_type' => $deleted_shift_type]; 
    }
}
