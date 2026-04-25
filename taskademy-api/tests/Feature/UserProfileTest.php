<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
        ])
            ->assertOk()
            ->assertJsonPath('name', 'Updated Student')
            ->assertJsonPath('bio', 'New bio')
            ->assertJsonPath('skills.0', 'Laravel');
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
}
