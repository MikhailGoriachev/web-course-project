<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;


// Контроллер для таблицы Города
class CitiesController extends Controller {

    // правила валидации для формы
    public array $rules = [
        'name' => 'bail|required|min:1|max:80'
    ];

    // получить все записи
    public function index(): JsonResponse {
        return response()->json(City::paginate());
    }

    // получить все записи без пагинации
    public function getAll(): JsonResponse {
        return response()->json(City::all());
    }

    // получить запись id
    public function show(int|string $id): JsonResponse {
        return response()->json(City::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);
        ($item =new City($fields))->save();
        return response()->json($item->id, 201);
    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = City::findOnFail($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        City::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
