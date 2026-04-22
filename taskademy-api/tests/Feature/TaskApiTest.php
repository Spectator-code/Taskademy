<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\RequiresPhpExtension;
use Tests\TestCase;

#[RequiresPhpExtension('pdo_sqlite')]
class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_create_task(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($client);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Build a landing page',
            'category' => 'Development',
            'description' => 'Create a responsive marketing site.',
            'requirements' => "React\nTailwind CSS",
            'budget' => 300,
            'deadline' => now()->addDays(5)->toDateString(),
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('client_id', $client->id);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Build a landing page',
            'client_id' => $client->id,
        ]);
    }

    public function test_student_cannot_create_task(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($student);

        $this->postJson('/api/tasks', [
            'title' => 'Invalid task',
            'category' => 'Design',
            'description' => 'This should fail.',
            'budget' => 50,
            'deadline' => now()->addDays(2)->toDateString(),
        ])->assertForbidden();
    }

    public function test_only_students_can_apply_for_open_tasks(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $task = Task::create([
            'title' => 'Open task',
            'category' => 'Design',
            'description' => 'A valid task.',
            'requirements' => null,
            'budget' => 120,
            'deadline' => now()->addDays(3)->toDateString(),
            'client_id' => $client->id,
            'student_id' => null,
            'status' => 'open',
        ]);

        $clientUser = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($clientUser);

        $this->postJson("/api/tasks/{$task->id}/apply")
            ->assertForbidden();

        $student = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($student);

        $this->postJson("/api/tasks/{$task->id}/apply")
            ->assertOk()
            ->assertJsonPath('message', 'Application submitted');
    }
}
