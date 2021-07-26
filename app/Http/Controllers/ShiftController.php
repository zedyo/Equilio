<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function index() {
        $shifts = Shift::all();

        return [
           'shifts' => $shifts
        ];
    }

    public function store(Request $request): JsonResponse {

        $shift = new Shift();
        $shift->abrv = $request->shiftData['abrv'];
        $shift->color_hex = $request->shiftData['color_hex'];
        $shift->h_duration = $request->shiftData['h_duration'];
        $shift->save();

        return response()->json([null], 201);
    }

    public function show(Shift $shift) {
        return ['shift' => $shift];
    }

    public function update(Request $request, Shift $shift) {
        $shift->abrv = $request->shiftData['abrv'];
        $shift->color_hex = $request->shiftData['color_hex'];
        $shift->h_duration = $request->shiftData['h_duration'];
        $shift->save();
    }

    public function destroy(Shift $shift) {
        $shift->delete();

        return response()->json([null], 204);
    }
}
