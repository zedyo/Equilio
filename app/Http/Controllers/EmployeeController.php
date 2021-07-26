<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index() {
        $employees = Employee::with('qualification')->get();

        return ['employees' => $employees];
    }

    public function store(Request $request): JsonResponse {
        $employee = new Employee();
        $employee->first_name = $request->employeeData['first_name'];
        $employee->last_name = $request->employeeData['last_name'];
        $employee->qualification_id = $request->employeeData['qualification_id'];
        $employee->save();

        return response()->json([null], 201);

    }

    public function show(Employee $employee) {
        return ['employee' => $employee];
    }

    public function update(Request $request, Employee $employee) {
        $employee->first_name = $request->employeeData['first_name'];
        $employee->last_name = $request->employeeData['last_name'];
        $employee->qualification_id = $request->employeeData['qualification_id'];

        $employee->save();
    }

    public function destroy(Employee $employee) {
        $employee->delete();

        return response()->json([null], 204);
    }
}
