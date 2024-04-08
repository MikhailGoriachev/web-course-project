<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс Этаж
class Floor extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'number'
    ];

    public function hotelRooms(): HasMany {
        return $this->hasMany(HotelRoom::class);
    }
}
