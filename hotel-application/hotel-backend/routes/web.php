<?php

use App\Http\Controllers\AdminPanelController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\CleaningHistoriesController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\FloorsController;
use App\Http\Controllers\HotelRoomsController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\QueriesController;
use App\Http\Controllers\RegistrationHotelHistoriesController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ScheduleCleaningsController;
use App\Http\Controllers\WeekDaysController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
