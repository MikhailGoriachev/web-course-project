<?php

namespace App\Http\Controllers;

use App\Models\RegistrationHotelHistory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Date;
use function PHPUnit\Framework\isNan;


// Контроллер для таблицы История регистраций в гостинице
class RegistrationHotelHistoriesController extends Controller {

    // правила валидации
    public array $rules = [
        'client_id' => 'bail|required|integer|min:1',
        'hotel_room_id' => 'bail|required|integer|min:1',
        'city_id' => 'bail|required|integer|min:1',
        'registration_date' => 'bail|required',
        'duration' => 'bail|required|integer|min:1'
    ];

    // получить все записи
    public function index(Request $request): JsonResponse {

        $data = RegistrationHotelHistory::with(
            'client',
            'client.person',
            'hotel_room',
            'hotel_room.hotel_room_type',
            'hotel_room.floor',
            'city'
        )->get();

        // клиент
        if (($clientId = $request->query('client_id')) !== null)
            $data = $data->where(fn($r) => $r->client_id == +$clientId);

        // номер
        if (($hotelRoomId = $request->query('hotel_room_id')) !== null)
            $data = $data->where(fn($r) => $r->hotel_room_id == +$hotelRoomId);

        // город
        if (($cityId = $request->query('city_id')) !== null)
            $data = $data->where(fn($r) => $r->city_id == +$cityId);

        // дата регистрации
        if (($registrationDate = $request->query('registration_date')) !== null) {
            $registrationDate = Carbon::parse($registrationDate);

            $data = $data->where(fn($r) => Carbon::parse($r->registration_date) == $registrationDate);
        }

        // длительность
        if (($duration = $request->query('duration')) !== null)
            $data = $data->where(fn($r) => $r->duration == +$duration);

        $page = $request->query('page');

        return response()
            ->json(new LengthAwarePaginator($data->forPage($page, 15)->values(), $data->count(), 15));
    }

    // получить все записи без пагинации
    public function getAll(): JsonResponse {
        return response()
            ->json(RegistrationHotelHistory::with(
                'client',
                'client.person',
                'hotel_room',
                'hotel_room.hotel_room_type',
                'hotel_room.floor',
                'city'
            ));
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(RegistrationHotelHistory::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);

        $fields['registration_date'] = Date::parse($fields['registration_date']);

        ($item = new RegistrationHotelHistory($fields))->save();

        return response()->json($item->id, 201);
    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = RegistrationHotelHistory::find($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $fields['registration_date'] = Date::parse($fields['registration_date']);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        RegistrationHotelHistory::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
