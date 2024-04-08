<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс История поселений в гостиницу
class RegistrationHotelHistory extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'hotel_room_id',
        'city_id',
        'registration_date',
        'duration'
    ];


    // клиент
    public function client(): BelongsTo {
        return $this->belongsTo(Client::class);
    }

    // комната
    public function hotel_room(): BelongsTo {
        return $this->belongsTo(HotelRoom::class);
    }

    // город
    public function city(): BelongsTo {
        return $this->belongsTo(City::class);
    }
}
