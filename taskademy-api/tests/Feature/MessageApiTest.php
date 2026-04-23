<?php

namespace Tests\Feature;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\RequiresPhpExtension;
use Tests\TestCase;

#[RequiresPhpExtension('pdo_sqlite')]
class MessageApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_conversation_member_can_send_message_and_broadcast_event(): void
    {
        Event::fake([MessageSent::class]);

        $sender = User::factory()->create();
        $recipient = User::factory()->create();
        $conversation = Conversation::create([
            'user1_id' => $sender->id,
            'user2_id' => $recipient->id,
        ]);

        Sanctum::actingAs($sender);

        $response = $this->postJson('/api/messages', [
            'conversation_id' => $conversation->id,
            'content' => 'Hello from Reverb.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('conversation_id', $conversation->id)
            ->assertJsonPath('sender.id', $sender->id)
            ->assertJsonPath('content', 'Hello from Reverb.');

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $sender->id,
            'content' => 'Hello from Reverb.',
        ]);

        Event::assertDispatched(MessageSent::class);
    }

    public function test_non_member_cannot_send_message_to_conversation(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $outsider = User::factory()->create();
        $conversation = Conversation::create([
            'user1_id' => $user1->id,
            'user2_id' => $user2->id,
        ]);

        Sanctum::actingAs($outsider);

        $this->postJson('/api/messages', [
            'conversation_id' => $conversation->id,
            'content' => 'This should fail.',
        ])->assertForbidden();
    }
}
