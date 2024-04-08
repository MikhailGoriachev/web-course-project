<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use App\Models\HotelRoom;
use App\Models\RegistrationHotelHistory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use function PHPUnit\Framework\isNull;


// Контроллер для таблицы Комнаты (номера)
class HotelRoomsController extends Controller {

    // правила валидации
    public array $rules = [
        'hotel_room_type_id' => 'bail|required|integer|min:1',
        'floor_id' => 'bail|required|integer|min:1',
        'number' => 'bail|required|integer|min:1',
        'phone_number' => 'bail|required|pattern:/^[\+]?3?[\s]?8?[\s]?\(?0\d{2}?\)?[\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/'
//        'phone_number' => 'bail|required|pattern:/^[\+]?3?[\s]?8?[\s]?\(?0\d{2}?\)?[\s]?\d{3}[\s|-]?\d{2}[\s|-]?\d{2}$/'
//        'phone_number' => 'bail|required|pattern:/^\+380\d{3}\d{2}\d{2}\d{2}$/'
    ];

    // получить все записи
    public function index(Request $request): JsonResponse {

        $data = HotelRoom::with('hotel_room_type', 'floor')->get();

        // свободные/занятые номера
        if (($isBusy = $request->query('is_busy')) !== null) {
            $data = $isBusy == "true" ? $this->busyRooms() : $this->emptyRooms();
        }

        // тип номера
        if (($roomTypeId = $request->query('room_type_id')) !== null)
            $data = $data->where(fn($r) => $r->hotel_room_type_id == +$roomTypeId);

        // этаж
        if (($floorId = $request->query('floor_id')) !== null)
            $data = $data->where(fn($r) => $r->floor_id == +$floorId);

        // номер комнаты
        if (($number = $request->query('number')) !== null)
            $data = $data->where(fn($r) => $r->number == +$number);

        // номер телефона
        if ($phoneNumber = $request->query('phone_number'))
            $data = $data->where(fn($r) => Str::startsWith($r->phone_number, $phoneNumber));

        $page = +$request->query('page');

        return response()
            ->json(new LengthAwarePaginator($data->forPage($page, 15)->values(), $data->count(), 15));
    }

    // получить все записи без пагинации
    public function getAll(): JsonResponse {
        return response()
            ->json(HotelRoom::with('hotel_room_type', 'floor')->get());
    }

    // получить свободные номера
    public function getEmpty(Request $request): JsonResponse {
        $duration = $request->query('duration');
        $duration = $duration !== null ? +$duration : null;

        error_log($request->query('startDate'));
        return response()->json($this->emptyRooms($request->query('startDate'), $duration)->values());
    }

    // получить занятые номера
    public function getBusy(): JsonResponse {
        return response()->json($this->busyRooms()->values());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(HotelRoom::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);
        ($item = new HotelRoom($fields))->save();
        return response()->json($item->id, 201);
    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = HotelRoom::find($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        HotelRoom::find($id)->delete();

        return response()->json(null, 204);
    }

    // свободные номера
    public function emptyRooms(string $date = null, int $duration = null): Collection {
        $startDate = $date == null
            ? Carbon::now()
            : Carbon::parse($date);

        $endDate = $duration !== null
            ? $startDate->clone()->addDays($duration)
            : $startDate->clone();

        $startDate = $startDate->toISOString();
        $endDate = $endDate->toISOString();

        error_log($startDate);
        error_log($endDate);

        $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return HotelRoom::with('floor', 'hotel_room_type')
            ->get()
            ->where(function ($r) use ($startDate, $endDate, $history) {
                return !$this->isBusyRoom($startDate, $endDate, $r, $history->where(fn($h) => $h->hotel_room_id == $r->id));
            });
    }

    // занятые номера
    public function busyRooms(): Collection {
        $currentDate = Carbon::now()->toDateString();

        $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return HotelRoom::with('floor', 'hotel_room_type')
            ->get()
            ->where(function ($r) use ($currentDate, $history) {
                return $this->isBusyRoom($currentDate, $currentDate, $r, $history->where(fn($h) => $h->hotel_room_id == $r->id));
            });
    }

    // проверка статус номера: свободен/занят
    public function isBusyRoom(string $startDate, string $endDate, HotelRoom $room, Collection $history = null): bool {
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        if ($history == null)
            $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return $history
            ->where(fn($a) => $a->hotel_room_id == $room->id)
            ->some(function ($a) use ($startDate, $endDate) {
                $regDate = Carbon::parse($a->registration_date);
//                throw new Exception($date >= $regDate && $date < $regDate->addDays($a->duration));
                return $endDate >= $regDate && $startDate < $regDate->addDays($a->duration);
            });
    }
}
