<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\RequiresPhpExtension;
use Tests\TestCase;
class AdminAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_registration_analytics(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create([
            'role' => 'client',
            'created_at' => '2026-04-20 10:00:00',
        ]);
        User::factory()->create([
            'role' => 'student',
            'created_at' => '2026-04-20 11:00:00',
        ]);
        User::factory()->create([
            'role' => 'student',
            'created_at' => '2026-04-21 10:00:00',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/registrations?period=daily&start_date=2026-04-20&end_date=2026-04-21');

        $response
            ->assertOk()
            ->assertJsonPath('period', 'daily')
            ->assertJsonPath('data.0.date', '2026-04-20')
            ->assertJsonPath('data.0.registrations', 2)
            ->assertJsonPath('data.1.date', '2026-04-21')
            ->assertJsonPath('data.1.registrations', 1);
    }
}
