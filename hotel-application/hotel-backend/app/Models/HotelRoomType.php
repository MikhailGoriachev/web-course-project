<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс Тип комнаты (номера)
class HotelRoomType extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'count_place',
        'price'
    ];
}
