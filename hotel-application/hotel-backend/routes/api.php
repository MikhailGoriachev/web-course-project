<?php

use App\Http\Controllers\AdminPanelController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\CleaningHistoriesController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\FloorsController;
use App\Http\Controllers\HotelRoomsController;
use App\Http\Controllers\HotelRoomTypesController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\QueriesController;
use App\Http\Controllers\RegistrationHotelHistoriesController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ScheduleCleaningsController;
use App\Http\Controllers\WeekDaysController;
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

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

#region Города

// все записи
Route::get('/cities/index', [CitiesController::class, 'index']);

// все записи без пагинации
Route::get('/cities/get-all', [CitiesController::class, 'getAll']);

// запись по id
Route::get('/cities/show/{id}', [CitiesController::class, 'show']);

// добавление записи
Route::post('/cities/store', [CitiesController::class, 'store']);

// изменение записи
Route::put('/cities/update/{id}', [CitiesController::class, 'update']);

// удаление записи
Route::delete('/cities/delete/{id}', [CitiesController::class, 'delete']);

#endregion

#region Клиенты

// все записи
Route::get('/clients/index', [ClientsController::class, 'index']);

// все записи без пагинации
Route::get('/clients/get-all', [ClientsController::class, 'getAll']);

// запись по id
Route::get('/clients/show/{id}', [ClientsController::class, 'show']);

// добавление записи
Route::post('/clients/store', [ClientsController::class, 'store']);

// изменение записи
Route::put('/clients/update/{id}', [ClientsController::class, 'update']);

// удаление записи
Route::delete('/clients/delete/{id}', [ClientsController::class, 'delete']);

#endregion

#region История уборок

// все записи
Route::get('/cleaning-histories/index', [CleaningHistoriesController::class, 'index']);

// запись по id
Route::get('/cleaning-histories/show/{id}', [CleaningHistoriesController::class, 'show']);

// добавление записи
Route::post('/cleaning-histories/store', [CleaningHistoriesController::class, 'store']);

// изменение записи
Route::put('/cleaning-histories/update/{id}', [CleaningHistoriesController::class, 'update']);

// удаление записи
Route::delete('/cleaning-histories/delete/{id}', [CleaningHistoriesController::class, 'delete']);

#endregion

#region Работники

// все записи
Route::get('/employees/index', [EmployeesController::class, 'index']);

// все записи без пагинации
Route::get('/employees/get-with-trashed-all', [EmployeesController::class, 'getWithTrashedAll']);

// запись по id
Route::get('/employees/show/{id}', [EmployeesController::class, 'show']);

// изменение записи
Route::put('/employees/update/{id}', [EmployeesController::class, 'update']);

#endregion

#region Этажи

// все записи без пагинации
Route::get('/floors/get-all', [FloorsController::class, 'getAll']);

// запись по id
Route::get('/floors/show/{id}', [FloorsController::class, 'show']);

#endregion

#region Комнаты (номера)

// все записи
Route::get('/rooms/index', [HotelRoomsController::class, 'index']);

// все записи без пагинации
Route::get('/rooms/get-all', [HotelRoomsController::class, 'getAll']);

// запись по id
Route::get('/rooms/show/{id}', [HotelRoomsController::class, 'show']);

// добавление записи
Route::post('/rooms/store', [HotelRoomsController::class, 'store']);

// изменение записи
Route::put('/rooms/update/{id}', [HotelRoomsController::class, 'update']);

// удаление записи
Route::delete('/rooms/delete/{id}', [HotelRoomsController::class, 'delete']);

// свободные номера
Route::get('/rooms/empty', [HotelRoomsController::class, 'getEmpty']);

// занятые номера
Route::get('/rooms/busy', [HotelRoomsController::class, 'getBusy']);

#endregion

#region Типы номеров

// все записи
Route::get('/room-types/get-all', [HotelRoomTypesController::class, 'getAll']);

// запись по id
Route::get('/room-types/show/{id}', [HotelRoomTypesController::class, 'show']);

#endregion

#region Люди

// все записи
Route::get('/people/index', [PeopleController::class, 'index']);

// запись по id
Route::get('/people/show/{id}', [PeopleController::class, 'show']);

// добавление записи
Route::post('/people/store', [PeopleController::class, 'store']);

// изменение записи
Route::put('/people/update/{id}', [PeopleController::class, 'update']);

// удаление записи
Route::delete('/people/delete/{id}', [PeopleController::class, 'delete']);

#endregion

#region Истории регистрации в гостинице

// все записи
Route::get('/registration-histories/index', [RegistrationHotelHistoriesController::class, 'index']);

// запись по id
Route::get('/registration-histories/show/{id}', [RegistrationHotelHistoriesController::class, 'show']);

// добавление записи
Route::post('/registration-histories/store', [RegistrationHotelHistoriesController::class, 'store']);

// изменение записи
Route::put('/registration-histories/update/{id}', [RegistrationHotelHistoriesController::class, 'update']);

// удаление записи
Route::delete('/registration-histories/delete/{id}', [RegistrationHotelHistoriesController::class, 'delete']);

#endregion

#region График уборки

// все записи
Route::get('/schedule-cleaning/index', [ScheduleCleaningsController::class, 'index']);

// запись по id
Route::get('/schedule-cleaning/show/{id}', [ScheduleCleaningsController::class, 'show']);

// добавление записи
Route::post('/schedule-cleaning/store', [ScheduleCleaningsController::class, 'store']);

// изменение записи
Route::put('/schedule-cleaning/update/{id}', [ScheduleCleaningsController::class, 'update']);

// удаление записи
Route::delete('/schedule-cleaning/delete/{id}', [ScheduleCleaningsController::class, 'delete']);

#endregion

#region Дни недели

// все записи без пагинации
Route::get('/week-days/get-all', [WeekDaysController::class, 'getAll']);

// запись по id
Route::get('/week-days/show/{id}', [WeekDaysController::class, 'show']);

// добавление записи
//Route::post('/week-days/store', [WeekDaysController::class, 'store']);

// изменение записи
//Route::put('/week-days/update/{id}', [WeekDaysController::class, 'update']);

// удаление записи
//Route::delete('/week-days/delete/{id}', [WeekDaysController::class, 'delete']);

#endregion

#region Запросы

// информация о клиентах проживающих в заданном номере
Route::post('/queries/info-clients-by-room', [QueriesController::class, 'infoClientsByRoom']);

// клиенты прибывшие из заданного города
Route::post('/queries/clients-from-city', [QueriesController::class, 'clientsFromCity']);

// служащий убиравший номер заданного клиента в указанную дату
Route::post('/queries/employee-cleaning-client-room', [QueriesController::class, 'employeeCleaningClientRoom']);

// свободные номера
Route::get('/queries/empty-rooms', [QueriesController::class, 'emptyRooms']);

// занятые номера
Route::get('/queries/busy-rooms', [QueriesController::class, 'busyRooms']);

#endregion

#region Панель управления администратора

// разместить клиента
Route::post('/admin-panel/place-client', [AdminPanelController::class, 'placeClient']);

// выселить клиента
Route::post('/admin-panel/evict-client', [AdminPanelController::class, 'evictClient']);

// принять на работу служащего
Route::post('/admin-panel/add-employee', [AdminPanelController::class, 'addEmployee']);

// уволить служащего
Route::get('/admin-panel/remove-employee/{id}', [AdminPanelController::class, 'removeEmployee']);

// получить график работника
Route::get('/admin-panel/employee-schedule/{id}', [AdminPanelController::class, 'getEmployeeSchedule']);

// изменить расписание работника
Route::post('/admin-panel/change-schedule-employee', [AdminPanelController::class, 'changeScheduleEmployee']);

#endregion

#region Отчёты

// счет за проживание в гостинице
Route::get('/reports/get-account-client/{id}', [ReportsController::class, 'getAccountClient']);

// отчет о работе гостиницы за указанный квартал текущего года
Route::post('/reports/get-report-by-date-range', [ReportsController::class, 'getReportByDateRange']);

#endregion
