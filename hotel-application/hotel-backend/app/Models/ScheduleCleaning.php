<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;


// Класс График уборки
class ScheduleCleaning extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'week_day_id',
        'employee_id',
        'floor_id'
    ];


    // день недели
    public function week_day(): BelongsTo {
        return $this->belongsTo(WeekDay::class);
    }

    // работник
    public function employee(): BelongsTo {
        return $this->belongsTo(Employee::class);
    }

    // этаж
    public function floor(): BelongsTo {
        return $this->belongsTo(Floor::class);
    }
}
