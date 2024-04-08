<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


// Контроллер для таблицы Этажи
class FloorsController extends Controller {

    // получить все записи
    public function getAll(): JsonResponse {
        return response()->json(Floor::all());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(Floor::find($id));
    }
}
