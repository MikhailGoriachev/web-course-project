<?php

namespace App\Http\Controllers;

use App\Models\ScheduleCleaning;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


// Контроллер для таблицы График уборки
class ScheduleCleaningsController extends Controller {

    // правила валидации
    public array $rules = [
        'week_day_id' => 'bail|required|integer|min:1',
        'employee_id' => 'bail|required|integer|min:1',
        'floor_id' => 'bail|required|integer|min:1'
    ];

    // получить все записи
    public function index(): JsonResponse {
        return response()->json(ScheduleCleaning::with('week_day', 'employee', 'employee.person', 'floor')->paginate());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(ScheduleCleaning::find($id));
    }

    // добавление записи
    public function store(Request $request): JsonResponse {
        $fields = $request->validate($this->rules);
        ($item = new ScheduleCleaning($fields))->save();
        return response()->json($item->id, 201);
    }

    // изменение записи
    public function update(Request $request, int|string $id): JsonResponse {
        $item = ScheduleCleaning::findOrFail($id);

        $this->rules['id'] = 'bail|required|integer|min:1';
        $fields = $request->validate($this->rules);

        $item->update($fields);

        return response()->json($item);
    }

    // удаление записи
    public function delete(int|string $id): JsonResponse {
        ScheduleCleaning::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
