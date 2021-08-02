<?php

use App\Http\Controllers\DutyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\ShiftController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::patch('/duty', [DutyController::class, 'update']);
Route::get('/duties/{year}/{month}', [DutyController::class, 'overview'])->name('overview');

Route::resources([
    'qualifications' => QualificationController::class,
    'employees' => EmployeeController::class,
    'shifts' => ShiftController::class
]);


