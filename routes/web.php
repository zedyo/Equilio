<?php

use App\Http\Controllers\DutyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\ShiftController;
use App\Models\Duty;
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
//Route::get('', ['middleware' => 'cors', function() {
//    return 'You did it!';
//}]);

Route::view('/{any}', 'app')->where('any', '.*');

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

//TODO: Warum hatten wir diese Routen ausgelagert?
//Route::get('/qualifications', [QualificationController::class, 'index']);
//Route::post('/qualifications', [QualificationController::class, 'index2']);
//Route::get('/qualifications/{qualification}', [QualificationController::class, 'show'])->name('QualificationShow');
//Route::get('/qualifications/create', [QualificationController::class, 'create'])->name('QualificationCreate');


Route::resources([
    'qualifications' => QualificationController::class,
    'employees' => EmployeeController::class,
    'shifts' => ShiftController::class,
    'duties' => DutyController::class
]);

Route::get('/duties/{year}/{month}', [DutyController::class, 'calendar'])->name('calendar');
Route::get('/duties/changeMonth', [DutyController::class, 'changeMonth'])->name('changeMonth');

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
