<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{conversationId}', function ($user, int $conversationId) {
    return Conversation::query()
        ->whereKey($conversationId)
        ->where(function ($query) use ($user) {
            $query
                ->where('user1_id', $user->id)
                ->orWhere('user2_id', $user->id)
                ->orWhereHas('participants', function ($participantQuery) use ($user) {
                    $participantQuery->where('users.id', $user->id);
                });
        })
        ->exists();
});
