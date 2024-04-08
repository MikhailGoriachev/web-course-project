<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


// Контроллер для таблицы Персоны
class PeopleController extends Controller {

    // правила валидации
    public array $rules = [
        'surname' => 'bail|required|max:60',
        'name' => 'bail|required|max:40',
        'patronymic' => 'bail|required|max:260',
    ];

    // получить все записи
    public function index(): JsonResponse {
        return response()->json(Person::paginate());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(Person::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);
        ($person = new Person($fields))->save();
        return response()->json($person->id, 201);
    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = Person::find($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        Person::find($id)->delete();

        return response()->json(null, 204);
    }
}
