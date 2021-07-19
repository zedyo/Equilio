<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with('qualification')->get();

        return ['employees' => $employees];
    }

    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'first_name' =>  'required|string|min:3',
            'last_name' =>  'required|string|min:3'
        ]);

        $employee = new Employee();
        $employee->first_name = $validatedData['first_name'];
        $employee->last_name = $validatedData['last_name'];
        $employee->qualification_id = $request->request->get('qualification_id');

        $employee->save();
    }

    public function show(Employee $employee)
    {
        return ['employee' => $employee];

    }

    public function update(Request $request, Employee $employee)
    {
        $validatedData = $request->validate([
            'first_name' =>  'required|string|min:3',
            'last_name' =>  'required|string|min:3'
        ]);

        $employee->first_name = $validatedData['first_name'];
        $employee->last_name = $validatedData['last_name'];
        $employee->qualification_id = $request->request->get('qualification_id');

        $employee->save();
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json([
            null
        ], 204);
    }
}
