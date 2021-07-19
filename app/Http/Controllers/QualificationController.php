<?php

namespace App\Http\Controllers;

use App\Models\Qualification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QualificationController extends Controller
{

    public function index()
    {
        try {
            // BACKUP: Aufgrund Employees mit Qualifications:
            // $qualifications = Employee::with('qualification')->get();
            // --MEMO--
            // Notwendig anstatt Employee::all(),
            // da hier auch die Relations zu qualifications mitgeliefert werden

            $qualifications = Qualification::all();

            if (count($qualifications) == 0) {
                return response()->json('Keine Einträge da!', 404);
            }

            return [
                'qualifications' => $qualifications
            ];

        } catch (\Exception $exception) {
            return response()->json([
                'exception' => $exception->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'description' => 'required|string|min:3'
        ]);

        $qualification = new Qualification();
        $qualification->description = $validatedData['description'];
        $qualification->save();
    }

    public function show(Qualification $qualification)
    {
        return ['qualification' => $qualification];
    }

    public function update(Request $request, Qualification $qualification)
    {
        $validatedData = $request->validate([
            'description' => 'required|string|min:3'
        ]);

        $qualification->description = $validatedData['description'];
        $qualification->save();
    }

    public function destroy(Qualification $qualification)
    {
        $qualification->delete();

        return response()->json([
            null
        ], 204);
    }
}
