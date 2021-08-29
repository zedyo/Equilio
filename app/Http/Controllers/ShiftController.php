<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function index()
    {
        $shifts = Shift::with('shift_type')->get();

        return ['shifts' => $shifts];
    }

    public function store(Request $request): JsonResponse
    {
        $shift = new Shift();
        $shift->abrv = $request->shiftData['abrv'];
        $shift->color_hex = $request->shiftData['color_hex'];
        $shift->h_duration = $request->shiftData['h_duration'];
        $shift->shift_type_id = $request->shiftData['shift_type_id'];
        $shift->save();

        return response()->json([null], 201);
    }

    public function show(Shift $shift)
    {
        return ['shift' => $shift];
    }

    public function update(Request $request, Shift $shift)
    {
        $shift->abrv = $request->shiftData['abrv'];
        $shift->color_hex = $request->shiftData['color_hex'];
        $shift->h_duration = $request->shiftData['h_duration'];
        $shift->save();
    }

    public function destroy(Shift $shift)
    {
        $deleted_shift = $shift;

        $shift->delete();

        return['deleted_shift' => $deleted_shift];
    }
}
