<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\RequiresPhpExtension;
use Tests\TestCase;
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

    public function test_student_can_create_task_pending_moderation(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($student);

        $this->postJson('/api/tasks', [
            'title' => 'Student posted task',
            'category' => 'Design',
            'description' => 'This should wait for review.',
            'budget' => 50,
            'deadline' => now()->addDays(2)->toDateString(),
        ])
            ->assertCreated()
            ->assertJsonPath('moderation_status', 'pending');
    }

    public function test_students_can_apply_for_approved_open_tasks_but_clients_cannot(): void
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
            'moderation_status' => 'approved',
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

        $this->assertDatabaseHas('task_applications', [
            'task_id' => $task->id,
            'applicant_id' => $student->id,
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_reject_task_and_notify_poster(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $poster = User::factory()->create(['role' => 'student']);
        $task = Task::create([
            'title' => 'Needs moderation',
            'category' => 'Writing',
            'description' => 'A task post.',
            'requirements' => null,
            'budget' => 100,
            'deadline' => now()->addDays(4)->toDateString(),
            'client_id' => $poster->id,
            'student_id' => null,
            'status' => 'open',
            'moderation_status' => 'pending',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/admin/tasks/{$task->id}/reject", [
            'reason' => 'The task needs clearer requirements.',
        ])
            ->assertOk()
            ->assertJsonPath('moderation_status', 'rejected')
            ->assertJsonPath('rejection_reason', 'The task needs clearer requirements.');

        $this->assertDatabaseHas('users', [
            'email' => 'taskademy.ai@system.local',
            'name' => 'Taskademy.AI',
        ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'moderation_status' => 'rejected',
        ]);

        $this->assertNotNull($task->fresh()->archived_at);

        $this->assertDatabaseHas('messages', [
            'content' => "Your task post \"Needs moderation\" got archived by Taskademy.AI. Lowkey it did not pass the vibe check.\n\nWhy it got yeeted: The task needs clearer requirements.",
        ]);
    }

    public function test_poster_can_mark_in_progress_task_completed_and_credit_worker(): void
    {
        $poster = User::factory()->create(['role' => 'client']);
        $worker = User::factory()->create(['role' => 'student', 'completed_tasks' => 0]);
        $task = Task::create([
            'title' => 'Finish design polish',
            'category' => 'Design',
            'description' => 'An active task.',
            'requirements' => null,
            'budget' => 250,
            'deadline' => now()->addDays(2)->toDateString(),
            'client_id' => $poster->id,
            'student_id' => $worker->id,
            'status' => 'in_progress',
            'moderation_status' => 'approved',
        ]);

        Sanctum::actingAs($poster);

        $this->postJson("/api/tasks/{$task->id}/complete")
            ->assertOk()
            ->assertJsonPath('status', 'completed')
            ->assertJsonPath('student_id', $worker->id);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $worker->id,
            'completed_tasks' => 1,
        ]);
    }

    public function test_assigned_task_is_removed_from_public_browse_and_private_to_participants(): void
    {
        $poster = User::factory()->create(['role' => 'client']);
        $worker = User::factory()->create(['role' => 'student']);
        $outsider = User::factory()->create(['role' => 'student']);
        $task = Task::create([
            'title' => 'Private in progress task',
            'category' => 'Development',
            'description' => 'Assigned work.',
            'requirements' => null,
            'budget' => 180,
            'deadline' => now()->addDays(5)->toDateString(),
            'client_id' => $poster->id,
            'student_id' => $worker->id,
            'status' => 'in_progress',
            'moderation_status' => 'approved',
        ]);

        Sanctum::actingAs($outsider);

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonMissing(['id' => $task->id]);

        $this->getJson("/api/tasks/{$task->id}")
            ->assertForbidden();

        Sanctum::actingAs($poster);
        $this->getJson("/api/tasks/{$task->id}")
            ->assertOk()
            ->assertJsonPath('id', $task->id);

        Sanctum::actingAs($worker);
        $this->getJson("/api/tasks/{$task->id}")
            ->assertOk()
            ->assertJsonPath('id', $task->id);
    }
}
