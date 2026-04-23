<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        $client = User::updateOrCreate(
            ['email' => 'client@taskademy.test'],
            [
                'name' => 'Client Demo',
                'password' => $password,
                'role' => 'client',
                'bio' => 'Demo client account',
            ],
        );

        $student = User::updateOrCreate(
            ['email' => 'student@taskademy.test'],
            [
                'name' => 'Student Demo',
                'password' => $password,
                'role' => 'student',
                'bio' => 'Demo student account',
                'skills' => ['Design', 'Development'],
            ],
        );

        User::updateOrCreate(
            ['email' => 'admin@taskademy.test'],
            [
                'name' => 'Admin Demo',
                'password' => $password,
                'role' => 'admin',
            ],
        );

        $conversation = Conversation::firstOrCreate([
            'user1_id' => min($client->id, $student->id),
            'user2_id' => max($client->id, $student->id),
        ]);

        Message::firstOrCreate(
            [
                'conversation_id' => $conversation->id,
                'sender_id' => $client->id,
                'content' => 'Hi, can you help with a quick landing page polish?',
            ],
        );

        Message::firstOrCreate(
            [
                'conversation_id' => $conversation->id,
                'sender_id' => $student->id,
                'content' => 'Yes, I can take a look today.',
            ],
        );
    }
}
