<?php

namespace Database\Factories;

use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;


class ClientFactory extends Factory {
    public function definition() {
        return [
            'person_id' => Person::factory(),
            'passport' => fake()->numberBetween(1e8, 1e9 - 1)
        ];
    }
}
