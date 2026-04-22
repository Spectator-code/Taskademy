<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::query()
            ->where('user1_id', $userId)
            ->orWhere('user2_id', $userId)
            ->with(['user1', 'user2'])
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

        return response()->json($conversation->load(['user1', 'user2']), 201);
    }

    public function messages(Request $request, $conversationId)
    {
        $conversation = Conversation::with(['messages.sender'])->findOrFail($conversationId);

        $me = $request->user()->id;
        if (!in_array($me, [$conversation->user1_id, $conversation->user2_id], true)) {
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

        $conversation = Conversation::findOrFail($validated['conversation_id']);

        $me = $request->user()->id;
        if (!in_array($me, [$conversation->user1_id, $conversation->user2_id], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $me,
            'content' => $validated['content'],
        ]);

        return response()->json($message->load('sender'), 201);
    }
}

