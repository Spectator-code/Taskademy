<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::with([
            'tasksAsStudent' => fn ($query) => $query
                ->with(['client', 'student'])
                ->where('status', 'completed')
                ->latest(),
        ])->findOrFail($id);

        return response()->json($this->serializeUser($user));
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
            'resume_manual' => [
                'sometimes',
                'nullable',
                'array',
            ],
            'resume_manual.summary' => 'nullable|string',
            'resume_manual.experience' => 'nullable|array',
            'resume_manual.education' => 'nullable|array',
            'resume_manual.skills' => 'nullable|array',
        ]);

        if (array_key_exists('resume_manual', $validated) && $request->user()->id !== $user->id) {
            return response()->json(['message' => 'Only the profile owner can update resume details.'], 403);
        }

        $user->update($validated);

        return response()->json($this->serializeUser($user));
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

    public function uploadResume(Request $request)
    {
        $validated = $request->validate([
            'resume' => [
                'required',
                'file',
                'max:10240',
                'mimes:pdf,docx',
            ],
        ]);

        $user = $request->user();

        if ($user->resume_file_path) {
            Storage::disk('public')->delete($user->resume_file_path);
        }

        $file = $validated['resume'];
        $path = $file->store('resumes', 'public');

        $user->update([
            'resume_file_path' => $path,
            'resume_file_name' => $file->getClientOriginalName(),
        ]);

        return response()->json($this->serializeUser($user->fresh()), 201);
    }

    protected function serializeUser(User $user): array
    {
        $data = $user->toArray();
        $data['avatar_url'] = $user->avatar
            ? Storage::disk('public')->url($user->avatar)
            : null;
        $data['resume_url'] = $user->resume_file_path
            ? Storage::disk('public')->url($user->resume_file_path)
            : null;

        return $data;
    }
}
