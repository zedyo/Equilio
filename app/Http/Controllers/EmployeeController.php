<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with('qualification')->get();

        return response()->json(['employees' => $employees]);
    }

    private function validateEmployee(Request $request): void
    {
        $request->validate([
            'employeeData.first_name' => ['required', 'string', 'max:255'],
            'employeeData.last_name' => ['required', 'string', 'max:255'],
            'employeeData.daily_worktime' => ['required', 'numeric', 'min:0'],
            'employeeData.employment_ratio' => ['required', 'numeric', 'min:0', 'max:100'],
            'employeeData.qualification_id' => ['required', 'integer', 'exists:qualifications,id'],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->validateEmployee($request);
        $employee = new Employee();
        $employee->first_name = $request->employeeData['first_name'];
        $employee->last_name = $request->employeeData['last_name'];
        $employee->daily_worktime = $request->employeeData['daily_worktime'];
        $employee->employment_ratio = $request->employeeData['employment_ratio'];
        $employee->qualification_id = $request->employeeData['qualification_id'];
        $employee->save();

        return response()->json([null], 201);
    }

    public function show(Employee $employee)
    {
        return ['employee' => $employee->with('qualification')->where('id', $employee->id)->first()];
    }

    public function update(Request $request, Employee $employee)
    {
        $this->validateEmployee($request);
        $employee->first_name = $request->employeeData['first_name'];
        $employee->last_name = $request->employeeData['last_name'];
        $employee->daily_worktime = $request->employeeData['daily_worktime'];
        $employee->employment_ratio = $request->employeeData['employment_ratio'];
        $employee->qualification_id = $request->employeeData['qualification_id'];

        $employee->save();

        return response()->json(['employee' => $employee], 201);
    }

    public function destroy(Employee $employee)
    {
        $deleted_employee = $employee;

        $employee->delete();

        return ['deleted_employee' => $deleted_employee];
    }
}
