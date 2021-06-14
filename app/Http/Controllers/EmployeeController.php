<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Qualification;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        $employees = Employee::all();

        return view ('employees.index', [
            'employees' => $employees
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
        $qualifications = Qualification::all();

        return view ('employees.create', [
            'qualifications' => $qualifications
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
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

        return redirect()->route('employees.index');
    }

    /**
     * Display the specified resource.
     *
     * @param Employee $employee
     * @return Application|Factory|View
     */
    public function show(Employee $employee)
    {
        return view ('employees.show', [
           'employee' => $employee
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Employee $employee
     * @param Qualification $qualification
     * @return Application|Factory|View
     */
    public function edit(Employee $employee)
    {
        $qualifications = Qualification::all();

        return view ('employees.edit', [
            'employee' => $employee,
            'qualifications' => $qualifications
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return Application|Factory|View
     */
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

        return view ('employees.show', [
            'employee' => $employee
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return void
     */
    public function destroy($id)
    {
        //
    }
}
