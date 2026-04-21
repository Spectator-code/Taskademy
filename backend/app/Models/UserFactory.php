<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => fake()->randomElement(['student', 'client', 'admin']),
            'avatar' => null,
            'bio' => fake()->sentence(),
            'skills' => json_encode(fake()->words(3)),
            'rating' => fake()->randomFloat(1, 2, 5),
            'completed_tasks' => fake()->numberBetween(0, 10),
            'remember_token' => Str::random(10),
        ];
    }
}

