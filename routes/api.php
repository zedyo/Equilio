<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DutyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\ShiftTypeController;
use App\Http\Controllers\WishController;
use App\Http\Controllers\WorkingHoursDiffController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Öffentlich (Sanctum SPA: Client holt zuvor /sanctum/csrf-cookie).
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Jede authentifizierte Rolle.
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Lesedaten zum Rendern (Kürzel/Farben/Schichtarten) – auch Pflegekraft.
    Route::get('/shifts', [ShiftController::class, 'index']);
    Route::get('/shift_types', [ShiftTypeController::class, 'index']);

    // Eigene Daten der Pflegekraft (Ownership im Controller geprüft;
    // Leitung darf ohnehin alles).
    Route::get('/duties/{year}/{month}/{employee_id}', [DutyController::class, 'getDutiesData'])->name('getDutiesData');
    Route::get('/wishesByEmployee/{employee_id}', [WishController::class, 'getEmployeeWishData']);
    Route::post('/wish', [WishController::class, 'create']);
    Route::get('/preferencesByEmployee/{employee_id}', [PreferenceController::class, 'getEmployeePreferenceData']);
    Route::post('/preference', [PreferenceController::class, 'create']);
    Route::delete('/preference', [PreferenceController::class, 'delete']);

    // Nur Leitung: Planung, CRUD, Gesamtansichten.
    Route::middleware('role:'.User::ROLE_LEITUNG)->group(function () {
        Route::post('/duties/generate', [DutyController::class, 'generate']);
        Route::patch('/duty', [DutyController::class, 'update']);
        Route::delete('/duty', [DutyController::class, 'delete']);
        Route::get('/duties/{year}/{month}/', [DutyController::class, 'getAllDutiesData'])->name('getAllDutiesData');
        Route::get('/duties', [DutyController::class, 'overview'])->name('overview');

        Route::apiResource('shifts', ShiftController::class)->except(['index']);
        Route::apiResource('shift_types', ShiftTypeController::class)->except(['index']);
        Route::resources([
            'absences' => AbsenceController::class,
            'qualifications' => QualificationController::class,
            'employees' => EmployeeController::class,
            'wishes' => WishController::class,
            'preferences' => PreferenceController::class,
            'working_hours_diffs' => WorkingHoursDiffController::class,
        ]);
    });
});
