<?php

namespace App\Http\Controllers;

use App\Models\Wish;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WishController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $wishes = Wish::with(['employee', 'shift'])->get();

        return ['wishes' => $wishes];
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getEmployeeWishData(Request $request)
    {
        $wishes = Wish::with('shift')->where('employee_id', $request->employee_id)->get();

        return $wishes;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Wish  $wish
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, Wish $wish): JsonResponse
    {
        $wish_check = Wish::where('employee_id', $request->wishData['employee_id']);
        $wish_check->where('day', $request->wishData['day']);
        $wish_check->where('month', $request->wishData['month']);
        $wish_check->where('year', $request->wishData['year']);
        $wish = $wish_check->get();

        if ($wish->isEmpty()) {
            $new_wish = new Wish();
            $new_wish->employee_id = $request->wishData['employee_id'];
            $new_wish->shift_id = $request->wishData['shift_id'];
            $new_wish->day = $request->wishData['day'];
            $new_wish->month = $request->wishData['month'];
            $new_wish->year = $request->wishData['year'];

            $new_wish->save();

            $wish = Wish::with('shift')->where('id', $new_wish->id)->first();

            //TODO: Saubere Responses in alle Controllern
            return response()->json(['new_wish' => $wish], 201);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Wish  $wish
     * @return \Illuminate\Http\Response
     */
    public function show(Wish $wish)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Wish  $wish
     * @return \Illuminate\Http\Response
     */
    public function edit(Wish $wish)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Wish  $wish
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Wish $wish)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Wish  $wish
     * @return \Illuminate\Http\Response
     */
    public function destroy(Wish $wish)
    {
        $deleted_wish = $wish;

        $wish->delete();

        return ['deleted_wish' => $deleted_wish];
    }
}
