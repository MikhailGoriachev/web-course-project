<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\CleaningHistory;
use App\Models\Client;
use App\Models\ScheduleCleaning;
use App\Models\WeekDay;
use App\Models\Employee;
use App\Models\Floor;
use App\Models\RegistrationHotelHistory;
use App\Models\HotelRoom;
use App\Models\HotelRoomType;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Date;

class DatabaseSeeder extends Seeder {
    public function run() {

        // клиенты
        Client::factory(fake()->numberBetween(40, 50))->create();

        // работники
        Employee::factory(fake()->numberBetween(5, 10))->create();

        // типы номеров
        collect([
            new HotelRoomType(['name' => 'одноместный', 'count_place' => 1, 'price' => 1400]),
            new HotelRoomType(['name' => 'двухместный', 'count_place' => 2, 'price' => 3100]),
            new HotelRoomType(['name' => 'трёхместный', 'count_place' => 3, 'price' => 5300]),
        ])->map(fn($a) => $a->save());

        // этажи
        ($floors = collect(array_pad([], fake()->numberBetween(3, 6), 0)))
            ->map(fn($a, $i) => (new Floor(['number' => $i + 1]))->save());

        // комнаты
        $rooms = collect();

        // количество комнат (номеров) на этаже
        $roomsInfo = collect([
            ['count' => fake()->numberBetween(10, 15), 'type' => 1],
            ['count' => fake()->numberBetween(20, 30), 'type' => 2],
            ['count' => fake()->numberBetween(30, 40), 'type' => 3]
        ]);

        for ($i = 0; $i < $floors->count(); $i++) {

            $num = (($i + 1) * 100) + 1;
            foreach ($roomsInfo as $info)
                for ($k = 0; $k < $info['count']; $k++)
                    $rooms->add(new HotelRoom([
                        'hotel_room_type_id' => $info['type'],
                        'floor_id' => $i + 1,
                        'number' => $num,
                        'phone_number' => 80000 + $num++
                    ]));
        }

        $rooms->map(fn($a) => $a->save());

        // города
        collect(['Киев', 'Харьков', 'Одесса', 'Днепр', 'Донецк', 'Запорожье', 'Львов', 'Кривой Рог'])
            ->map(fn($a) => (new City(['name' => $a]))->save());


        $startDate = Carbon::now()->addDays(-80)->toDateString();

        // история регистрации в гостинице
        $this->fillHistoryRegistration($startDate, fake()->numberBetween(300, 400));

        // дни недели
        collect(["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"])
            ->map(fn($a, $i) => (new WeekDay(['name' => $a, 'number' => $i + 1]))->save());

        // график работы
        $this->fillScheduleCleanings();

        // факты уборки
        $this->fillCleaningHistories($startDate);
    }


    // заполнение истории поселений в гостиницу
    public function fillHistoryRegistration(string $startDate, int $n = 80) {
        $clients = Client::with(['person'])->get();
        $rooms = HotelRoom::with(['hotel_room_type', 'floor'])->get();
        $cities = City::all();

        // текущая дата
        $currentDate = Carbon::now();

        // стартовая дата
        $startDate = Carbon::parse($startDate);

        // разница в днях между текущей и стартовой датой
        $diff = $currentDate->diffInDays($startDate);

        for ($i = 0; $i < $n; $i++) {
            $date = $startDate->copy()->addDays(fake()->numberBetween(0, $diff))->toDateString();

            (new RegistrationHotelHistory([
                'client_id' => $clients[fake()->numberBetween(0, $clients->count() - 1)]->id,
                'hotel_room_id' => $this->getEmptyRoom($date, $rooms, RegistrationHotelHistory::all())->id,
                'city_id' => fake()->numberBetween(1, $cities->count() - 1),
                'registration_date' => $date,
                'duration' => fake()->numberBetween(3, 7)
            ]))->save();
        }
    }

    // проверка статус номера: свободен/занят
    public function isBusyRoom(string $date, Collection $history, HotelRoom $room): bool {
        $date = Carbon::parse($date);

        return RegistrationHotelHistory::all()->where(fn($a) => $a->id == $room->id)->some(function ($a) {
            global $date;
            $regDate = Carbon::parse($a->registration_date);
            return $regDate <= $date && $regDate->addDays($a->duration) > $date;
        });
    }

    // получить свободный номер
    public function getEmptyRoom(string $date, Collection $rooms, Collection $history) {
        do {
            $room = $rooms[fake()->numberBetween(0, $rooms->count() - 1)];
        } while ($this->isBusyRoom($date, $history, $room));

        return $room;
    }

    // заполнение графика работы
    public function fillScheduleCleanings() {

        // дни недели
        $days = WeekDay::all();

        // этажи
        $floors = Floor::all();

        // количество этажей
        $floorCount = $floors->count();

        for ($i = 0, $k = 0; $i < $days->count(); $i++, $k = 0) {
            for (; $k < $floorCount; $k++) {
                (new ScheduleCleaning([
                    'week_day_id' => $days[$i]->id,
                    'floor_id' => $floors[$k]->id,
                    'employee_id' => $this->getEmptyEmployee($days[$i]->number)->id
                ]))->save();
            }
        }
    }

    // получить рабочего, который свободен в заданный день
    public function getEmptyEmployee(int $day): Employee {

        $schedule = ScheduleCleaning::all();

        $employeeList = Employee::all()
            ->where(fn($e) => !$schedule->some(fn($s) => $s->week_day->number == $day && $s->employee_id == $e->id))
            ->values();

        return $employeeList[fake()->numberBetween(0, $employeeList->count() - 1)];
    }

    // заполнение таблицы фактов уборки
    private function fillCleaningHistories(string $startDate) {

        // график уборки
        $schedule = ScheduleCleaning::all();

        // список фактов уборки
        $histories = new Collection();

        // текущая дата
        $currentDate = Carbon::now();

        // стартовая дата
        $startDate = Carbon::parse($startDate);

        // заполнение
        while ($startDate <= $currentDate) {

            $schedule->where(fn($s) => $s->week_day->number == $startDate->dayOfWeek + 1)
                ->map(fn($s) => $histories->add(new CleaningHistory([
                    'floor_id' => $s->floor_id,
                    'date_cleaning' => $startDate->toDateString(),
                    'employee_id' => $s->employee_id
                ])));

            $startDate->addDays(1);
        }

        $histories->map(fn($s) => $s->save());
    }
}
