<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->id !== $user->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|nullable|string',
            'skills' => 'sometimes|nullable|array',
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function uploadAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|file|image|max:5120',
        ]);

        $path = $validated['avatar']->store('avatars', 'public');
        $url = Storage::disk('public')->url($path);

        $request->user()->update([
            'avatar' => $path,
        ]);

        return response()->json([
            'avatar' => $path,
            'url' => $url,
            'avatar_url' => $url,
        ], 201);
    }
}

