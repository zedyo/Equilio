<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\DutyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\ShiftTypeController;
use App\Http\Controllers\WishController;
use App\Http\Controllers\WorkingHoursDiffController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/duties/generate', [DutyController::class, 'generate']);

Route::patch('/duty', [DutyController::class, 'update']);
Route::delete('/duty', [DutyController::class, 'delete']);

Route::get('/duties/{year}/{month}/', [DutyController::class, 'getAllDutiesData'])->name('getAllDutiesData');
Route::get('/duties/{year}/{month}/{employee_id}', [DutyController::class, 'getDutiesData'])->name('getDutiesData');
Route::get('/duties', [DutyController::class, 'overview'])->name('overview');

Route::resources([
    'absences' => AbsenceController::class,
    'qualifications' => QualificationController::class,
    'employees' => EmployeeController::class,
    'shifts' => ShiftController::class,
    'shift_types' => ShiftTypeController::class,
    'wishes' => WishController::class,
    'preferences' => PreferenceController::class,
    'working_hours_diffs' => WorkingHoursDiffController::class
]);

// Route::get('/shift_types/{shift_type_id}/{day}/{month}/{year}/', [DutyController::class, 'showDutiesByShiftTypeAndDate'])->name('showShiftType');
Route::post('/wish', [WishController::class, 'create']);
Route::get('/wishesByEmployee/{employee_id}', [WishController::class, 'getEmployeeWishData']);
Route::post('/preference', [PreferenceController::class, 'create']);
Route::delete('/preference', [PreferenceController::class, 'delete']);
// Route::get('/preferencesByEmployee/{employee_id}', [WishController::class, 'getEmployeePreferenceData']);
