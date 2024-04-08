<?php

namespace App\Http\Controllers;

use App\Models\HotelRoom;
use App\Models\RegistrationHotelHistory;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;


// Контроллер Отчёты
class ReportsController extends Controller {

    // получение счёта за проживание
    public function getAccountClient(int|string $id): Response {
        $registration = RegistrationHotelHistory::with(
            'client',
            'client.person',
            'hotel_room',
            'hotel_room.hotel_room_type',
            'hotel_room.floor',
            'city'
        )
            ->find($id);

        $data = [
            'createDate' => Carbon::now('Europe/Moscow'),
            'registration' => $registration,
            'cost' => $registration->duration * $registration->hotel_room->hotel_room_type->price
        ];

        $pdf = PDF::loadView('accountClient', compact('data'));
        return $pdf->download('accountClient.pdf');
    }

    // получение отчёта за указанный квартал
    public function getReportByDateRange(Request $request) {
        $fields = $request->validate([
            'begin_date' => 'bail|required|date',
            'end_date' => 'bail|required|date'
        ]);

        $beginDate = Carbon::parse($fields['begin_date']);
        $endDate = Carbon::parse($fields['end_date']);

        if ($beginDate > $endDate)
            return response()->json(['error' => 'Неправильный диапазон даты']);

        // записи за данный период
        $currentHistory = RegistrationHotelHistory::with('client', 'hotel_room', 'city')
            ->get()
            ->where(fn($h) => ($regDate = Carbon::parse($h->registration_date)) >= $beginDate && $regDate <= $endDate);

        // количество клиентов
        $clientsAmount = $currentHistory
            ->map(fn($h) => $h->client_id)
            ->unique()
            ->count();

        // количество дней
        $amountDays = $endDate->diffInDays($beginDate);

        // сведения о номерах
        $roomsInfo = HotelRoom::with('hotel_room_type', 'floor')
            ->get()
            ->map(function ($r) use ($amountDays, $currentHistory, $beginDate, $endDate) {

                $busyDays = 0;

                $history = $currentHistory->where(fn($a) => $a->hotel_room_id == $r->id);

                for ($date = $beginDate->copy(); $date <= $endDate; $date->addDays(1))
                    $busyDays += $this->isBusyRoom($date->toDateString(), $r, $history) ? 1 : 0;

                return ['room' => $r, 'emptyDays' => $amountDays - $busyDays, 'busyDays' => $busyDays];
            })
            ->where(fn($r) => $r['busyDays'] > 0);

        // сумма дохода
        $account = $roomsInfo->sum(fn($r) => $r['busyDays'] * $r['room']->hotel_room_type->price);

        $data = [
            'createDate' => Carbon::now('Europe/Moscow'),
            ...$fields,
            'amountClients' => $clientsAmount,
            'amountDays' => $amountDays,
            'roomsInfo' => $roomsInfo,
            'account' => $account
        ];

        $pdf = PDF::loadView('reportByDateRange', compact('data'));
        return $pdf->download('reportByDateRange.pdf');
    }

    // проверка статус номера: свободен/занят
    public function isBusyRoom(string $date, HotelRoom $room, Collection $history = null): bool {
        $date = Carbon::parse($date);

        if ($history == null)
            $history = RegistrationHotelHistory::with('client', 'hotel_room', 'city')->get();

        return $history
            ->where(fn($a) => $a->hotel_room_id == $room->id)
            ->some(function ($a) use ($date) {
                $regDate = Carbon::parse($a->registration_date);
                return $regDate <= $date && $regDate->addDays($a->duration) > $date;
            });
    }
}
