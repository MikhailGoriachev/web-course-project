<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс Работник
class Employee extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'person_id'
    ];


    // персона
    public function person(): BelongsTo {
        return $this->belongsTo(Person::class);
    }
}
