<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Qualification;
use http\Env\Response;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class QualificationController extends Controller
{

    public function index()
    {
        try {
            // $qualifications = Employee::with('qua/lification')->get();
            $qualifications = Qualification::all();
            // Notwendig anstatt Employee::all(),
            // da hier auch die Relations zu qualifications mitgeliefert werden

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

//        return view ('qualifications.index', [
//            'qualifications' => $qualifications
//        ]);
    }

    public function index2()
    {
//        try {
//            $qualifications = Employee::with('qualification')->get();
//            // Notwendig anstatt Employee::all(),
//            // da hier auch die Relations zu qualifications mitgeliefert werden
//
//            if (count($qualifications) == 0) {
//                return response()->json('Keine Einträge da!', 404);
//            }
//
//            return response()->json([
//                'qualifications' => $qualifications
//            ]);
//        } catch (\Exception $exception) {
//            return response()->json([
//                'exception' => $exception->getMessage()
//            ], 500);
//        }

//        return view ('qualifications.index', [
//            'qualifications' => $qualifications
//        ]);
    }

    public function create()
    {
        return view ('qualifications.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'description' =>  'required|string|min:3'
        ]);

        $qualification = new Qualification();
        $qualification->description = $validatedData['description'];
        $qualification->save();
    }

    public function show(Qualification $qualification)
    {
        return ['qualification' => $qualification];
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Qualification $qualification
     * @return Qualification[]
     */
    public function edit(Qualification $qualification)
    {
        return ['qualification' => $qualification];
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

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Qualification $qualification
     * @return Application|ResponseFactory|\Illuminate\Http\Response
     */
    public function destroy(Qualification $qualification)
    {
//        dd($qualification);
        $qualification->delete();

        return response(null, 204);
    }
}
