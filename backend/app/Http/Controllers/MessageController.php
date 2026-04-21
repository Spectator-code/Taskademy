<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('user1_id', $userId)
            ->orWhere('user2_id', $userId)
            ->with(['user1:id,name,avatar', 'user2:id,name,avatar'])
            ->latest()
            ->get();

        return response()->json($conversations);
    }

    public function createConversation(Request $request)
    {
        $request->validate([
            'user2_id' => 'required|exists:users,id|different:user1_id',
        ]);

        $user1Id = $request->user()->id;
        $user2Id = $request->user2_id;

        $conversation = Conversation::firstOrCreate(
            ['user1_id' => min($user1Id, $user2Id), 'user2_id' => max($user1Id, $user2Id)]
        );

        return response()->json($conversation->load(['user1', 'user2']));
    }

    public function messages(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is participant
        if (!in_array($request->user()->id, [$conversation->user1_id, $conversation->user2_id])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender:id,name,avatar')
            ->latest()
            ->paginate(20);

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'content' => 'required|string|max:1000',
        ]);

        $conversation = Conversation::findOrFail($request->conversation_id);

        // Check if user is participant
        if (!in_array($request->user()->id, [$conversation->user1_id, $conversation->user2_id])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return response()->json($message->load('sender'));
    }
}
