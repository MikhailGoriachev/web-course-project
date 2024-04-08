<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс История уборки
class CleaningHistory extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'floor_id',
        'date_cleaning',
        'employee_id',
    ];


    // этаж
    public function floor(): BelongsTo {
        return $this->belongsTo(Floor::class);
    }

    // работник
    public function employee(): BelongsTo {
        return $this->belongsTo(Employee::class);
    }
}
