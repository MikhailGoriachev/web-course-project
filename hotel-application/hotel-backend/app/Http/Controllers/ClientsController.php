<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use function PHPUnit\Framework\isEmpty;
use function PHPUnit\Framework\isNull;
use function PHPUnit\Framework\stringStartsWith;


// Контроллер для таблицы Клиенты
class ClientsController extends Controller {

    // правила валидации
    public array $rules = [
        'person_id' => 'bail|required|integer|min:1',
        'passport' => 'bail|required|min:9|max:9',
    ];

    // получить все записи
    public function index(Request $request): JsonResponse {
        $data = Client::with('person')->get();

        if ($passport = $request->query('passport'))
            $data = $data->where(fn($c) => Str::startsWith($c->passport, $passport));

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
            ->json(Client::with('person')->get());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(Client::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);
        ($item = new Client($fields))->save();
        return response()->json($item->id, 201);
    }

    // изменение записи
    public function update(int|string $id, Request $request): JsonResponse {
        $item = Client::find($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        Client::find($id)->delete();

        return response()->json(null, 204);
    }
}
