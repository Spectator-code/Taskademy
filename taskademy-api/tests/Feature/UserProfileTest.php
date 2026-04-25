<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\RequiresPhpExtension;
use Tests\TestCase;
class UserProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_own_profile(): void
    {
        $user = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($user);

        $this->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Student',
            'bio' => 'New bio',
            'skills' => ['Laravel', 'React'],
            'resume_manual' => [
                'summary' => 'Frontend developer',
                'experience' => [],
                'education' => [],
                'skills' => ['Laravel', 'React'],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('name', 'Updated Student')
            ->assertJsonPath('bio', 'New bio')
            ->assertJsonPath('skills.0', 'Laravel')
            ->assertJsonPath('resume_manual.summary', 'Frontend developer');
    }

    public function test_admin_can_update_any_profile(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($admin);

        $this->putJson("/api/users/{$student->id}", [
            'name' => 'Admin Edited',
        ])
            ->assertOk()
            ->assertJsonPath('name', 'Admin Edited');
    }

    public function test_user_cannot_update_someone_elses_profile(): void
    {
        $user = User::factory()->create(['role' => 'student']);
        $other = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($user);

        $this->putJson("/api/users/{$other->id}", [
            'name' => 'Not Allowed',
        ])->assertForbidden();
    }

    public function test_admin_cannot_update_someone_elses_resume(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($admin);

        $this->putJson("/api/users/{$student->id}", [
            'resume_manual' => [
                'summary' => 'Changed by admin',
                'experience' => [],
                'education' => [],
                'skills' => [],
            ],
        ])->assertForbidden();
    }

    public function test_user_can_upload_own_resume(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/users/resume', [
            'resume' => UploadedFile::fake()->create('resume.pdf', 120, 'application/pdf'),
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('resume_file_name', 'resume.pdf');

        $this->assertNotNull($user->fresh()->resume_file_path);
        Storage::disk('public')->assertExists($user->fresh()->resume_file_path);
    }
}
