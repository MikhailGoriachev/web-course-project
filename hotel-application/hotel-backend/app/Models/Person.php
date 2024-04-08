<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс Персона
class Person extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'surname',
        'name',
        'patronymic'
    ];

    public function hotelRoomTypes(): BelongsToMany {
        return $this->belongsToMany(HotelRoomType::class);
    }
}
