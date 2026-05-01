<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleAuthSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');
        $categories = ['Academic', 'Design', 'Development', 'Writing', 'Data Entry', 'Virtual Assistant'];
        
        // 1. Create LEGACY Accounts
        $admin = User::updateOrCreate(
            ['email' => 'admin@taskademy.test'],
            ['name' => 'System Support', 'password' => $password, 'role' => 'admin', 'email_verified_at' => now()]
        );
        $legacyStudent = User::updateOrCreate(
            ['email' => 'student@taskademy.test'],
            ['name' => 'Legacy Student', 'password' => $password, 'role' => 'student', 'email_verified_at' => now()]
        );
        $legacyClient = User::updateOrCreate(
            ['email' => 'client@taskademy.test'],
            ['name' => 'Legacy Client', 'password' => $password, 'role' => 'client', 'email_verified_at' => now()]
        );

        // 2. Create 25 Students
        $students = [$legacyStudent];
        for ($i = 1; $i <= 25; $i++) {
            $students[] = User::create([
                'name' => fake()->name(),
                'email' => "student{$i}@taskademy.edu.ph",
                'password' => $password,
                'role' => 'student',
                'bio' => fake()->paragraph(),
                'skills' => fake()->randomElements(['React', 'Laravel', 'UI/UX', 'Python', 'Excel', 'Writing'], 3),
                'rating' => fake()->randomFloat(2, 4.0, 5.0),
                'completed_tasks' => fake()->numberBetween(5, 20),
                'task_earnings' => fake()->randomFloat(2, 500, 2000),
                'email_verified_at' => now(),
            ]);
        }

        // 3. Create 25 Clients
        $clients = [$legacyClient];
        for ($i = 1; $i <= 25; $i++) {
            $clients[] = User::create([
                'name' => fake()->company(),
                'email' => "client{$i}@gmail.com",
                'password' => $password,
                'role' => 'client',
                'bio' => fake()->catchPhrase(),
                'email_verified_at' => now(),
            ]);
        }

        // 4. Create sample tasks
        $tasks = [];
        foreach (range(1, 30) as $i) {
            $client = fake()->randomElement($clients);
            $tasks[] = Task::create([
                'title' => fake()->sentence(6),
                'category' => fake()->randomElement($categories),
                'description' => fake()->paragraphs(2, true),
                'budget' => fake()->randomFloat(2, 200, 3000),
                'deadline' => now()->addDays(fake()->numberBetween(5, 15)),
                'status' => 'open',
                'moderation_status' => 'approved',
                'client_id' => $client->id,
            ]);
        }

        // 5. Create Conversations and Messages (Student <-> Client)
        $usedTaskIds = [];
        foreach (range(1, 30) as $i) {
            $user1 = fake()->randomElement($clients);
            $user2 = fake()->randomElement($students);
            $this->createConversationWithMessages($user1, $user2, $tasks, $usedTaskIds);
        }

        // 6. Create Support Conversations (Student <-> Admin)
        foreach (fake()->randomElements($students, 5) as $student) {
            $this->createConversationWithMessages($student, $admin, [], $usedTaskIds, true);
        }

        // 7. Create Support Conversations (Client <-> Admin)
        foreach (fake()->randomElements($clients, 5) as $client) {
            $this->createConversationWithMessages($client, $admin, [], $usedTaskIds, true);
        }
    }

    private function createConversationWithMessages($user1, $user2, $tasks, &$usedTaskIds, $isSupport = false)
    {
        $u1 = min($user1->id, $user2->id);
        $u2 = max($user1->id, $user2->id);

        $conversation = Conversation::where('user1_id', $u1)->where('user2_id', $u2)->first();

        if (!$conversation) {
            $taskId = null;
            if (!$isSupport && !empty($tasks) && fake()->boolean(60)) {
                $availableTasks = array_filter($tasks, fn($t) => !in_array($t->id, $usedTaskIds));
                if (!empty($availableTasks)) {
                    $task = fake()->randomElement($availableTasks);
                    $taskId = $task->id;
                    $usedTaskIds[] = $taskId;
                }
            }

            $conversation = Conversation::create([
                'user1_id' => $u1,
                'user2_id' => $u2,
                'task_id' => $taskId,
                'title' => $isSupport ? 'System Support' : null
            ]);
        }

        $supportMessages = [
            "I need help with my account verification.",
            "How can I withdraw my earnings?",
            "Is there a limit to how many tasks I can post?",
            "My payment is still pending, please check.",
            "Thank you for the quick response!"
        ];

        $adminResponses = [
            "Hello! We are looking into this for you.",
            "Please provide your transaction reference number.",
            "Account verification usually takes 24-48 hours.",
            "You can withdraw via GCash in the earnings tab.",
            "Is there anything else I can help you with?"
        ];

        $numMessages = fake()->numberBetween(3, 6);
        for ($j = 0; $j < $numMessages; $j++) {
            $content = $isSupport 
                ? (fake()->boolean(50) ? fake()->randomElement($supportMessages) : fake()->randomElement($adminResponses))
                : fake()->sentence(fake()->numberBetween(5, 12));

            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => fake()->boolean(50) ? $user1->id : $user2->id,
                'content' => $content,
                'created_at' => now()->subMinutes(($numMessages - $j) * 15),
            ]);
        }
    }
}
