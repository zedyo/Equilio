<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\QualificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// PLAYGROUND
// Route::get('/test/{param}', [Qualification::class, 'testMethode']);
//

//Route::get('/qualification', [QualificationController::class, 'index']);
//Route::get('/qualification/{qualification}/edit ', [QualificationController::class, 'index']);
//Route::get('/qualification/{qualification}', [QualificationController::class, 'show']);

//Route::resource('employees', EmployeeController::class);

Route::resources([
    'qualifications' => QualificationController::class,
    'employees' => EmployeeController::class
]);

//
//Route::get('/qualification/{qualification}', function($id) {
//
//    return view ('qualification', [
//        'qualification' => Qualification::find($id)
//    ]);
//});

//Route::get('/qualification/{qualification}', function(Qualification $qualification) {
//
//    $test = view ('qualification', [
//        'qualification' => $qualification
//    ]);
//    dd($test);
//});

//Route::update('qualification/{qualification}', function($id, $description) {
//    $qualification = Qualification::find($id);
//
//    return view ('qualification', [
//        'qualifications' => $qualification::update(['description' => $description])
//    ]);
//});

//Route::create()
