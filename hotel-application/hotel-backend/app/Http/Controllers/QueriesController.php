<?php

namespace App\Http\Controllers;

use App\Models\CleaningHistory;
use App\Models\HotelRoom;
use App\Models\RegistrationHotelHistory;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class QueriesController extends Controller {

    // информация о клиентах проживающих в заданном номере
    public function infoClientsByRoom(Request $request): JsonResponse {
        $roomId = $request->validate(['room_id' => 'bail|required|integer|min:1'])['room_id'];

        // текущая дата
        $currentDate = Carbon::now();

        // гостиничный номер
        $room = HotelRoom::find($roomId);

        return response()->json(RegistrationHotelHistory::with(
            'client', 'client.person', 'hotel_room', 'hotel_room.hotel_room_type', 'hotel_room.floor', 'city'
        )
            ->get()
            ->filter(function ($reg) use ($roomId, $currentDate) {
                $date = Carbon::parse($reg->registration_date);
                return $reg->hotel_room_id == $roomId &&
                       $date < $currentDate &&
                       $date->addDays($reg->duration) >= $currentDate;
            })
            ->values()
        );
    }

    // проверка статус номера: свободен/занят
    public static function isBusyRoom(string $date, HotelRoom $room, Collection $history = null): bool {
        $date = Carbon::parse($date);

        if ($history == null)
            $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return $history
            ->where(fn($a) => $a->hotel_room_id == $room->id)
            ->some(function ($a) use ($date) {
                $regDate = Carbon::parse($a->registration_date);
                return $date >= $regDate && $date < $regDate->addDays($a->duration);
            });
    }

    // клиенты прибывшие из заданного города
    public function clientsFromCity(Request $request): JsonResponse {
        $cityId = $request->validate(['city_id' => 'bail|required|integer|min:1'])['city_id'];
        return response()->json(RegistrationHotelHistory::with('client', 'hotel_room', 'city')
            ->get()
            ->filter(fn($reg) => $reg->city_id == $cityId)
            ->map(fn($reg) => $reg->client)
            ->unique('id')
        );
    }

    // служащий убиравший номер заданного клиента в указанную дату
    public function employeeCleaningClientRoom(Request $request): JsonResponse {
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

        if ($room == null || QueriesController::isBusyRoom($date_cleaning, $room))
            return response()->json();

        $employee = CleaningHistory::with('floor', 'employee')
            ->where('date_cleaning', '=', $fields['date_cleaning'])
            ->get()
            ->first(fn($h) => $h->floor_id == $room->floor_id)
            ->employee;

        return response()->json($employee);
    }

    // свободные номера
    public function emptyRooms(): JsonResponse {
        $currentDate = Carbon::now()->toDateString();

        $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return response()->json(HotelRoom::with('floor', 'hotel_room_type')
            ->get()
            ->where(function ($r) use ($currentDate, $history) {
                return !QueriesController::isBusyRoom($currentDate, $r, $history->where(fn($h) => $h->hotel_room_id == $r->id));
            }));
    }

    // занятые номера
    public function busyRooms(): JsonResponse {
        $currentDate = Carbon::now()->toDateString();

        $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return response()->json(HotelRoom::with('floor', 'hotel_room_type')
            ->get()
            ->where(function ($r) use ($currentDate, $history) {
                return QueriesController::isBusyRoom($currentDate, $r, $history->where(fn($h) => $h->hotel_room_id == $r->id));
            }));
    }
}
