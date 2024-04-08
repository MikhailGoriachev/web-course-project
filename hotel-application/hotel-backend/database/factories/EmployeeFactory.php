<?php

namespace Database\Factories;

use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;


class EmployeeFactory extends Factory {
    public function definition(): array {
        return [
            'person_id' => Person::factory()
        ];
    }
}
