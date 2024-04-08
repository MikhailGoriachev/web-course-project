<?php

namespace App\Http\Controllers;

use App\Models\WeekDay;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


// Контроллер для таблицы Дни недели
class WeekDaysController extends Controller {

    // правила валидации
//    public array $rules = [
//        'name' => 'bail|required|integer|min:1',
//        'number' => 'required'
//    ];

    // получить все записи
    public function getAll(): JsonResponse {
        return response()->json(WeekDay::all());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(WeekDay::find($id));
    }

//    // добавление записи
//    public function store(Request $request): JsonResponse {
//        $fields = $request->validate($this->rules);
//        ($item = new WeekDay($fields))->save();
//        return response()->json($item->id, 201);
//    }

//    // изменение записи
//    public function update(Request $request, int|string $id): JsonResponse {
//        $item = WeekDay::findOnFail($id);
//
//        $this->rules['id'] = 'bail|required|integer|min:1';
//        $fields = $request->validate($this->rules);
//
//        $item->update($fields);
//
//        return response()->json($item);
//    }

//    // удаление записи
//    public function delete(int|string $id): JsonResponse {
//        WeekDay::findOrFail($id)->delete();
//
//        return response()->json(null, 204);
//    }
}
