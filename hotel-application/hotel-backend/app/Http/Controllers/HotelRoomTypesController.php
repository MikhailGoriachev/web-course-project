<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use App\Models\HotelRoomType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


// Контроллер для таблицы Типы номеров
class HotelRoomTypesController extends Controller {

    // получить все записи
    public function getAll(): JsonResponse {
        return response()->json(HotelRoomType::all());
    }

    // получить запись по id
    public function show(int|string $id): JsonResponse {
        return response()->json(HotelRoomType::find($id));
    }
}
