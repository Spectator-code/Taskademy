<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::query()
            ->where(function ($query) use ($userId) {
                $query
                    ->where('user1_id', $userId)
                    ->orWhere('user2_id', $userId)
                    ->orWhereHas('participants', function ($participantQuery) use ($userId) {
                        $participantQuery->where('users.id', $userId);
                    });
            })
            ->with(['user1', 'user2', 'participants', 'task', 'lastMessage.sender'])
            ->latest()
            ->get();

        return response()->json($conversations);
    }

    public function createConversation(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $me = $request->user()->id;
        $other = (int) $validated['user_id'];

        if ($me === $other) {
            return response()->json(['message' => 'Invalid user'], 422);
        }

        [$user1, $user2] = $me < $other ? [$me, $other] : [$other, $me];

        $conversation = Conversation::firstOrCreate([
            'user1_id' => $user1,
            'user2_id' => $user2,
        ]);

        $conversation->participants()->syncWithoutDetaching([$user1, $user2]);

        return response()->json($conversation->load(['user1', 'user2', 'participants', 'task', 'lastMessage.sender']), 201);
    }

    public function messages(Request $request, $conversationId)
    {
        $conversation = Conversation::with(['messages.sender', 'participants'])->findOrFail($conversationId);

        if (!$this->userCanAccessConversation($request->user()->id, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($conversation->messages()->with('sender')->latest()->paginate(50));
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'content' => 'required|string',
        ]);

        $conversation = Conversation::with('participants')->findOrFail($validated['conversation_id']);

        $me = $request->user()->id;
        if (!$this->userCanAccessConversation($me, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $me,
            'content' => $validated['content'],
        ]);

        $message->load('sender');

        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (\Exception $e) {
            // Silently fail broadcasting if Reverb/Pusher server is down
        }

        return response()->json($message, 201);
    }

    protected function userCanAccessConversation(int $userId, Conversation $conversation): bool
    {
        if (in_array($userId, [(int) $conversation->user1_id, (int) $conversation->user2_id], true)) {
            return true;
        }

        return $conversation->participants->contains('id', $userId);
    }
}
