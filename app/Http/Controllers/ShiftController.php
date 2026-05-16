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

    private function validateShift(Request $request): void
    {
        $request->validate([
            'shiftsData.abrv' => ['required', 'string', 'max:16'],
            'shiftsData.color_hex' => ['required', 'string', 'max:9'],
            'shiftsData.h_duration' => ['required', 'numeric', 'min:0'],
            'shiftsData.shift_type_id' => ['required', 'integer', 'exists:shift_types,id'],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->validateShift($request);
        $shift = new Shift();
        $shift->abrv = $request->shiftsData['abrv'];
        $shift->color_hex = $request->shiftsData['color_hex'];
        $shift->h_duration = $request->shiftsData['h_duration'];
        $shift->shift_type_id = $request->shiftsData['shift_type_id'];
        $shift->manual_only = (bool) ($request->shiftsData['manual_only'] ?? false);
        $shift->save();

        return response()->json([null], 201);
    }

    public function show(Shift $shift)
    {
        return ['shift' => $shift];
    }

    public function update(Request $request, Shift $shift)
    {
        $this->validateShift($request);
        $shift->abrv = $request->shiftsData['abrv'];
        $shift->color_hex = $request->shiftsData['color_hex'];
        $shift->h_duration = $request->shiftsData['h_duration'];
        $shift->shift_type_id = $request->shiftsData['shift_type_id'];
        $shift->manual_only = (bool) ($request->shiftsData['manual_only'] ?? false);

        $shift->save();

        return response()->json(['shift' => $shift], 200);
    }

    public function destroy(Shift $shift)
    {
        $deleted_shift = $shift;

        $shift->delete();

        return ['deleted_shift' => $deleted_shift];
    }
}
