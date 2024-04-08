<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Floor;
use App\Models\HotelRoom;
use App\Models\RegistrationHotelHistory;
use App\Models\ScheduleCleaning;
use App\Models\Utils;
use App\Models\WeekDay;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use function PHPUnit\Framework\isEmpty;
use function PHPUnit\Framework\isNull;


// Контроллер функций администратора
class AdminPanelController extends Controller {

    // разместить клиента
    public function placeClient(Request $request): JsonResponse {

        $fields = $request->validate([
            'client_id' => 'bail|required|integer|min:1',
            'hotel_room_id' => 'bail|required|integer|min:1',
            'city_id' => 'bail|required|integer|min:1',
            'registration_date' => 'bail|required|date',
            'duration' => 'bail|required|integer|min:1'
        ]);

        // если номер заполнен
        if ($this->countBusyPlace($fields['hotel_room_id'], $fields['registration_date'])
            >= HotelRoom::find($fields['hotel_room_id'])->hotel_room_type->count_place)
            return response()->json(['is_place' => false]);

        // запись регистрации
        return response()->json(['is_place' => (new RegistrationHotelHistory($fields))->save()]);
    }

    // выселить клиента
    public function evictClient(Request $request): JsonResponse {
        $fields = $request->validate([
            'client_id' => 'bail|required|integer|min:1',
            'hotel_room_id' => 'bail|required|integer|min:1',
        ]);

        // текущая дата
        $currentDate = Carbon::now();

        $registration = RegistrationHotelHistory::with('client', 'hotel_room', 'city')
            ->get()
            ->first(function ($r) use ($fields, $currentDate) {
                $regDate = Carbon::parse($r->registration_date);
                return $r->client_id == $fields['client_id'] && $regDate <= $currentDate
                       && $regDate->addDays($r->duration) >= $currentDate;
            });

        if ($registration == null)
            return response()->json(['is_evict' => false]);

        // урезание длительности по сегодняшний день
        $registration->duration = Carbon::parse($registration->registation_date)->diffInDays($currentDate);

        $registration->save();

        return response()->json(['is_evict' => true]);
    }


    // получить количество занятых мест в комнате (номере)
    public function countBusyPlace(int|string $room_id, string $date): int {
        $date = Carbon::parse($date);

        return RegistrationHotelHistory::with('client', 'hotel_room', 'city')
            ->get()
            ->where(function ($h) use ($date, $room_id) {
                $regDate = Carbon::parse($h->registration_date);
                return $h->duration != 0 && $date >= $regDate
                       && $date < $regDate->addDays($h->duration - 1)
                       && $h->hotel_room_id == $room_id;
            })
            ->count();
    }

    // принять на работу служащего
    public function addEmployee(Request $request): JsonResponse {
        $fields = $request->validate(['person_id' => 'bail|required|integer|min:1']);

        ($employee = new Employee($fields))->save();

        // корректировка графика уборки
        $this->validateCleaningSchedule();

        return response()->json($employee->id, 201);
    }

    // уволить служащего
    public function removeEmployee(int|string $id): JsonResponse {

        if (Employee::count() > Floor::count()) {
            Employee::find($id)->delete();

            // корректировка графика уборки
            $this->validateCleaningSchedule(null, +$id);

            return response()->json(null, 204);
        }

        return response()->json(false);
    }

    // получить график работника
    public function getEmployeeSchedule(int|string $id): JsonResponse {
        return response()->json(ScheduleCleaning::with('week_day', 'employee', 'employee.person', 'floor')
            ->where('employee_id', '=', $id)
            ->get());
    }

    // установить график работника
    public function setEmployeeSchedule(Employee $employee, Collection $schedule) {

        // получить записи по данному работнику
        $cleaningSchedule = ScheduleCleaning::all()->where(fn($s) => $s->employee_id == $employee->id);

        // получить записи, которые нужно удалить
        $deleteItems = $cleaningSchedule->where(fn($s) => $schedule->first(
                fn($res) => $res['week_day_id'] == $s->week_day_id && $res['floor_id'] == $s->floor_id) == null
        );

        // получить записи для добавления
        $addItems = $schedule
            ->where(fn($s) => $cleaningSchedule->first(fn($c) => $c->week_day_id == $s['week_day_id'] && $c->floor_id == $s['floor_id']) === null)
            ->map(fn($s) => new ScheduleCleaning([
                'week_day_id' => $s['week_day_id'],
                'employee_id' => $employee->id,
                'floor_id' => $s['floor_id'],
            ]));

        // изменение расписания
        $this->changeSchedule($addItems, $deleteItems);

        // валидация графика
        $this->validateCleaningSchedule($employee);
    }

    // изменить расписание служащего
    public function changeScheduleEmployee(Request $request): JsonResponse {
        $fields = $request->validate([
            'employee_id' => 'bail|required|integer|min:1',
            'days' => 'nullable',
            'floors' => 'nullable'
        ]);

        if (!array_key_exists('days', $fields) || !array_key_exists('floors', $fields)) {
            $days = collect();
            $floors = collect();
        } else {
            $days = collect($fields['days']);
            $floors = collect($fields['floors']);
        }

        $schedule = collect();

        for ($i = 0; $i < $days->count(); $i++)
            $schedule->add(['week_day_id' => +$days[$i], 'floor_id' => +$floors[$i]]);

        $this->setEmployeeSchedule(Employee::find(+$fields['employee_id']), new Collection($schedule->all()));

        return response()->json();
    }

    // изменить расписание
    public function changeSchedule(Collection $addDays, Collection $deleteDays): void {

        // записи, которые нужно удалить
        ScheduleCleaning::with('week_day', 'employee', 'floor')
            ->get()
            ->where(fn($s) => $addDays->first(fn($a) => $a->week_day_id == $s->week_day_id && $a->floor_id == $s->floor_id) != null)
            ->map(fn($d) => $deleteDays->add($d));

        // удаление записей
        $deleteDays->map(fn($d) => $d->delete());

        // добавление записей
        $addDays->map(fn($d) => $d->save());
    }

    // валидация графика уборки
    public function validateCleaningSchedule(Employee $exceptionEmployee = null, int $deletedEmployeeId = null): void {
        $schedule = ScheduleCleaning::all();

        if ($deletedEmployeeId != null) {
            // удаление записей уволенных работников
            $this->changeSchedule(
                new Collection(),
                $schedule->where(fn($s) => $s->employee_id == $deletedEmployeeId)
            );
        }

        $schedule = ScheduleCleaning::all();

        // дни недели
        $days = WeekDay::all();

        // этажи
        $floors = Floor::all();

        foreach ($days as $day) {
            foreach ($floors as $floor) {

                // записи по этому дню и этажу
                $currentSchedule = $schedule->where(fn($s) => $s->week_day_id == $day->id && $s->floor_id == $floor->id);

                // если список пуст, то установить работника с минимальным количеством рабочих дней
                if ($currentSchedule->count() == 0) {
                    (new ScheduleCleaning([
                        'employee_id' => $this->getMinEmployeeEmptyDay($day->number, $exceptionEmployee)->id,
                        'week_day_id' => $day->id,
                        'floor_id' => $floor->id
                    ]))
                        ->save();

                }

                // если записей больше одной, то удалить все, кроме последней
                if ($currentSchedule->count() > 1)
                    $currentSchedule->slice(0, $currentSchedule->count() - 2)->map(fn($s) => $s->delete());
            }
        }
    }

    // работник, у которого меньше всего рабочих дней, не работающий в заданный день
    private function getMinEmployeeEmptyDay(int $day, Employee $exceptionEmployee = null): Employee {

        // список свободных в заданный день работников
        $employees = $this->getEmployeeListEmptyDay($day);

        // график
        $schedule = ScheduleCleaning::all();

        // удаление из списка работника, исключаемого работника
        if ($exceptionEmployee != null)
            $employees = $employees->reject(fn($e) => $e->id == $exceptionEmployee->id)->values();

        // коллекция работников с количеством смен
        $list = $employees->map(fn($e) => [
            'employee' => $e,
            'count' => $schedule->filter(fn($s) => $s->employee_id == $e->id)->count()
        ]);

        // минимальное количество смен
        $min = $list->min(fn($e) => $e['count']);

        return $list->first(fn($e) => $e['count'] == $min)['employee'];
    }

    // получить список коллекции рабочих, которые не работают в заданный день
    public function getEmployeeListEmptyDay(int $day): Collection {

        $schedule = ScheduleCleaning::with('week_day', 'employee', 'floor')->get();

        $employees = Employee::with('person')->get();

        error_log($employees->count());

        return $schedule->isEmpty() ? $employees :
            $employees->where(fn($e) => $schedule->where(
                fn($s) => $s->employee_id == $e->id &&
                          $s->week_day->number == $day
            )->isEmpty())->values();
    }

    // рабочий свободный в выбранный день
    public function getEmployeeEmptyDay(int $day): Employee {
        return Utils::getItem($this->getEmployeeListEmptyDay($day)->toArray());
    }
}
