<?php

namespace App\Http\Controllers;

use App\Models\Qualification;
use Exception;
use Illuminate\Http\JsonResponse;
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
        } catch (Exception $exception) {
            return response()->json([
                'exception' => $exception->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $qualification = new Qualification();
        $qualification->description = $request->qualificationsData['description'];
        $qualification->save();

        return response()->json([null], 201);
    }

    public function show(Qualification $qualification)
    {
        return ['qualification' => $qualification];
    }

    public function update(Request $request, Qualification $qualification)
    {
        $qualification->description = $request->qualificationData['description'];

        $qualification->save();

        return response()->json(['qualification' => $qualification], 201);
    }

    public function destroy(Qualification $qualification)
    {
        $deleted_qualification = $qualification;

        $qualification->delete();

        return ['deleted_qualification' => $deleted_qualification];
    }
}
