<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс Клиент
class Client extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'person_id',
        'passport'
    ];


    // персона
    public function person(): BelongsTo {
        return $this->belongsTo(Person::class);
    }
}
