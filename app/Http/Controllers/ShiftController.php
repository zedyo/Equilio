<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $shifts = Shift::all();

        return response()->json([
           'shifts' => $shifts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
        return view ('shifts.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validateData = $request->validate([
           'color_hex' => 'required|string|min:7|max:7'
        ]);

        $shift = new Shift();
        $shift->abrv = $request->get('abrv');
        $shift->color_hex = $validateData['color_hex'];
        $shift->h_duration = $request->get('h_duration');
        $shift->save();

        return redirect()->route('shifts.index');
    }

    /**
     * Display the specified resource.
     *
     * @param Shift $shift
     * @return Application|Factory|View
     */
    public function show(Shift $shift)
    {
        return view ('shifts.show', [
           'shift' => $shift
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Shift $shift
     * @return Application|Factory|View
     */
    public function edit(Shift $shift)
    {
        return view ('shifts.edit', [
            'shift' => $shift
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Shift $shift
     * @return Application|Factory|View
     */
    public function update(Request $request, Shift $shift)
    {
        $validateData = $request->validate([
           'color_hex' => 'required|string|min:7|max:7'
        ]);

        $shift->abrv = $request->get('abrv');
        $shift->color_hex = $validateData['color_hex'];
        $shift->h_duration = $request->get('h_duration');
        $shift->save();

        return view ('shifts.show', [
            'shift' => $shift
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Shift $shift
     * @return void
     */
    public function destroy(Shift $shift)
    {
        //
    }
}
