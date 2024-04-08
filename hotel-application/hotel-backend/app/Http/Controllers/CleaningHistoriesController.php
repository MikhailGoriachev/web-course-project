<?php

namespace App\Http\Controllers;

use App\Models\CleaningHistory;
use App\Models\Employee;
use App\Models\RegistrationHotelHistory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;


// Контроллер для таблицы История уборок
class CleaningHistoriesController extends Controller {

    // правила валидации
    public array $rules = [
        'floor_id' => 'bail|required|integer|min:1',
        'date_cleaning' => 'bail|required|date',
        'employee_id' => 'bail|required|integer|min:1',
    ];

    // получить все записи
    public function index(Request $request): JsonResponse {

        $data = CleaningHistory::with('floor')
            ->get();

        // дата уборки
        if (($dateCleaning = $request->query('date_cleaning')) !== null) {
            $dateCleaning = Carbon::parse($dateCleaning);

            $data = $data->where(fn($r) => Carbon::parse($r->date_cleaning) == $dateCleaning);
        }

        // этаж
        if (($floorId = $request->query('floor_id')) !== null)
            $data = $data->where(fn($r) => $r->floor_id == +$floorId);

        // служащий
        if (($employeeId = $request->query('employee_id')) !== null)
            $data = $data->where(fn($r) => $r->employee_id == +$employeeId);

        // номер
        if (($roomId = $request->query('room_id')) !== null) {
            $roomId = +$roomId;
            $data = $data->where(fn($r) => $r->floor->hotelRooms->some(fn($h) => $h->id == $roomId));
        }

        // служащие вместе с удалёнными записями
        $employees = Employee::withTrashed()->with('person')->get();

        // установка служащих в коллекцию
        $data->map(fn($d) => $d->employee = $employees->first(fn($e) => $e->id == $d->employee_id));

        $page = $request->query('page');

        return response()
            ->json(new LengthAwarePaginator($data->forPage($page, 15)->values(), $data->count(), 15));
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(CleaningHistory::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);
        $item = (new CleaningHistory($fields))->save();
        return response()->json($item->id, 201);
    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = CleaningHistory::findOrFail($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        CleaningHistory::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    // служащий убиравший номер заданного клиента в указанную дату
    public function employeeCleaningClientRoom(Request $request): Collection {
        $fields = $request->validate([
            'client_id' => 'bail|required|integer|min:1',
            'date_cleaning' => 'bail|required|date',
        ]);

        $date_cleaning = $fields['date_cleaning'];

        $room = RegistrationHotelHistory::with('hotel_room')
            ->where('client_id', '=', $fields['client_id'])
            ->get()
            ->first()
            ->hotel_room;

        if ($room == null || !QueriesController::isBusyRoom($date_cleaning, $room))
            return collect();

        return CleaningHistory::with('floor', 'employee')
            ->where('date_cleaning', '=', $fields['date_cleaning'])
            ->get()
            ->filter(fn($h) => $h->floor_id == $room->floor_id);
    }

}
