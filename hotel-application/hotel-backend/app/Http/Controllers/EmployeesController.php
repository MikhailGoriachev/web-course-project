<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;


// Контроллер для таблицы Работники
class EmployeesController extends Controller {

    // правила валидации
    public array $rules = [
        'person_id' => 'bail|required|integer|min:1',
    ];

    // получить все записи
    public function index(Request $request): JsonResponse {
        $data = Employee::with('person')->get();

        if ($surname = $request->query('surname'))
            $data = $data->where(fn($c) => Str::startsWith($c->person->surname, $surname));

        if ($name = $request->query('name'))
            $data = $data->where(fn($c) => Str::startsWith($c->person->name, $name));

        if ($patronymic = $request->query('patronymic'))
            $data = $data->where(fn($c) => Str::startsWith($c->person->patronymic, $patronymic));

        $page = +$request->query('page');

        return response()
            ->json(new LengthAwarePaginator($data->forPage($page, 15)->values(), $data->count(), 15));

    }

    // получить все записи без пагинации
    public function getAll(): JsonResponse {
        return response()
            ->json(Employee::with('person')->get());
    }

    // получить все записи включая удалённые без пагинации
    public function getWithTrashedAll(): JsonResponse {
        return response()
            ->json(Employee::withTrashed()->with('person')->get());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(Employee::find($id));
    }

    // добавление записи
//    public function store(Request $request): JsonResponse {
//        $fields = $request->validate($this->rules);
//
//        return response()->json((new Employee($fields))->save(), 201);
//    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = Employee::findOrFail($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
//    public function delete(int|string $id): JsonResponse {
//        Employee::findOrFail($id)->delete();
//
//        return response()->json(null, 204);
//    }
}
