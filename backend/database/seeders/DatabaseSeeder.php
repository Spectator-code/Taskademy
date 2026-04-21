<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@taskademy.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Student
        User::create([
            'name' => 'Student',
            'email' => 'student@taskademy.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]);

        // Client
        User::create([
            'name' => 'Client',
            'email' => 'client@taskademy.com',
            'password' => Hash::make('password123'),
            'role' => 'client',
        ]);
    }
}
