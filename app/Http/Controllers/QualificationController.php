<?php

namespace App\Http\Controllers;

use App\Models\Qualification;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QualificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        $qualifications = Qualification::all();

        return view ('qualifications.index', [
            'qualifications' => $qualifications
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
        return view ('qualifications.create');
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
            'description' =>  'required|string|min:3'
        ]);

        $qualification = new Qualification();
        $qualification->description = $validatedData['description'];
        $qualification->save();

        return redirect()->route('qualifications.index');
    }

    /**
     * Display the specified resource.
     *
     * @param Qualification $qualification
     * @return Application|Factory|View
     */
    public function show(Qualification $qualification)
    {
        return view ('qualifications.show', [
            'qualification' => $qualification
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Qualification $qualification
     * @return Application|Factory|View
     */
    public function edit(Qualification $qualification)
    {
        return view ('qualifications.edit', [
            'qualification' => $qualification
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Qualification $qualification
     * @return Application|Factory|View
     */
    public function update(Request $request, Qualification $qualification)
    {
        $validatedData = $request->validate([
           'description' =>  'required|string|min:3'
        ]);

        $qualification->description = $validatedData['description'];
        $qualification->save();

        return view ('qualifications.show', [
            'qualification' => $qualification
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
