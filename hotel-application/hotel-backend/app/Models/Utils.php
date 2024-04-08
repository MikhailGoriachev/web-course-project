<?php

namespace App\Models;

// Утилиты
use Faker\Provider\ru_RU\PhoneNumber;

class Utils {

    // генерация вещественного числа
    static function random_float(float $min = -10, float $max = 10): float {
        return random_int($min, $max) + (mt_rand() / mt_getrandmax());
    }

    // получить случайный элемент массива
    static function getItem(array $arr) {
        return $arr[random_int(0, count($arr) - 1)];
    }
}
