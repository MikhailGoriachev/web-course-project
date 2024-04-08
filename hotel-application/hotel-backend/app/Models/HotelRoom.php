<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс Комната (номер)
class HotelRoom extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hotel_room_type_id',
        'floor_id',
        'number',
        'phone_number'
    ];


    // тип комнаты
    public function hotel_room_type(): BelongsTo {
        return $this->belongsTo(HotelRoomType::class);
    }

    // этаж
    public function floor(): BelongsTo {
        return $this->belongsTo(Floor::class);
    }
}
