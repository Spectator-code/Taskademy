<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show(Request $request, $id)
    {
        $user = User::with([
            'tasksAsStudent' => fn ($query) => $query
                ->with(['client', 'student', 'assignees'])
                ->where('status', 'completed')
                ->latest(),
            'groupTasks' => fn ($query) => $query
                ->with(['client', 'student', 'assignees'])
                ->where('status', 'completed')
                ->latest(),
        ])->findOrFail($id);

        return response()->json($this->serializeUser($user, $request->user()));
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
            'gcash_name' => 'sometimes|nullable|string|max:255',
            'gcash_number' => 'sometimes|nullable|string|max:30',
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

        if (
            (array_key_exists('resume_manual', $validated)
                || array_key_exists('gcash_name', $validated)
                || array_key_exists('gcash_number', $validated))
            && $request->user()->id !== $user->id
        ) {
            return response()->json(['message' => 'Only the profile owner can update private profile details.'], 403);
        }

        if (array_key_exists('resume_manual', $validated) && $request->user()->id !== $user->id) {
            return response()->json(['message' => 'Only the profile owner can update resume details.'], 403);
        }

        $user->update($validated);

        return response()->json($this->serializeUser($user, $request->user()));
    }

    public function uploadAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|file|image|max:5120',
        ]);

        $user = $request->user();
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $validated['avatar']->store('avatars', 'public');

        $user->update([
            'avatar' => $path,
        ]);

        return response()->json($this->serializeUser($user->fresh(), $request->user()), 201);
    }

    public function uploadResume(Request $request)
    {
        if (!in_array($request->user()->role, ['student', 'admin'], true)) {
            return response()->json(['message' => 'Only students and admins can manage resumes.'], 403);
        }

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

        return response()->json($this->serializeUser($user->fresh(), $request->user()), 201);
    }

    public function deleteResume(Request $request)
    {
        if (!in_array($request->user()->role, ['student', 'admin'], true)) {
            return response()->json(['message' => 'Only students and admins can manage resumes.'], 403);
        }

        $user = $request->user();

        if ($user->resume_file_path) {
            Storage::disk('public')->delete($user->resume_file_path);
        }

        $user->update([
            'resume_file_path' => null,
            'resume_file_name' => null,
        ]);

        return response()->json($this->serializeUser($user->fresh(), $request->user()));
    }

    public function uploadIdDocument(Request $request)
    {
        if (!in_array($request->user()->role, ['client', 'admin'], true)) {
            return response()->json(['message' => 'Only clients and admins can manage identity verification.'], 403);
        }

        $validated = $request->validate([
            'id_document' => [
                'required',
                'file',
                'max:10240',
                'mimes:pdf,jpg,jpeg,png',
            ],
        ]);

        $user = $request->user();

        if ($user->id_document_path) {
            Storage::disk('public')->delete($user->id_document_path);
        }

        $file = $validated['id_document'];
        $path = $file->store('identity-documents', 'public');

        $user->update([
            'id_document_path' => $path,
            'id_document_name' => $file->getClientOriginalName(),
        ]);

        return response()->json($this->serializeUser($user->fresh(), $request->user()), 201);
    }

    public function deleteIdDocument(Request $request)
    {
        if (!in_array($request->user()->role, ['client', 'admin'], true)) {
            return response()->json(['message' => 'Only clients and admins can manage identity verification.'], 403);
        }

        $user = $request->user();

        if ($user->id_document_path) {
            Storage::disk('public')->delete($user->id_document_path);
        }

        $user->update([
            'id_document_path' => null,
            'id_document_name' => null,
        ]);

        return response()->json($this->serializeUser($user->fresh(), $request->user()));
    }

    protected function serializeUser(User $user, ?User $viewer = null): array
    {
        $data = $user->toArray();
        $completedTasks = collect($data['tasks_as_student'] ?? [])
            ->merge($data['group_tasks'] ?? [])
            ->unique('id')
            ->values()
            ->all();
        $canViewIdentityDocument = $viewer && ($viewer->id === $user->id || $viewer->role === 'admin');
        $canViewGcashDetails = $this->canViewGcashDetails($user, $viewer);

        $data['avatar_url'] = $user->avatar ? Storage::disk('public')->url($user->avatar) : null;
        $data['resume_url'] = $user->resume_file_path ? Storage::disk('public')->url($user->resume_file_path) : null;
        $data['id_document_url'] = $user->id_document_path ? Storage::disk('public')->url($user->id_document_path) : null;
        $data['can_view_gcash_details'] = $canViewGcashDetails;
        $data['tasksAsStudent'] = $completedTasks;

        if ($user->role === 'client') {
            $data['resume_file_path'] = null;
            $data['resume_file_name'] = null;
            $data['resume_manual'] = null;
            $data['resume_url'] = null;
        }

        if (!$canViewIdentityDocument) {
            $data['id_document_path'] = null;
            $data['id_document_name'] = null;
            $data['id_document_url'] = null;
        }

        if (!$canViewGcashDetails) {
            $data['gcash_name'] = null;
            $data['gcash_number'] = null;
        }

        return $data;
    }

    protected function canViewGcashDetails(User $user, ?User $viewer): bool
    {
        if (!$viewer) {
            return false;
        }

        if ($viewer->id === $user->id || $viewer->role === 'admin') {
            return true;
        }

        if ($viewer->role !== 'client' || $user->role !== 'student') {
            return false;
        }

        return $user->tasksAsStudent()
            ->where('client_id', $viewer->id)
            ->exists()
            || $user->groupTasks()
                ->where('client_id', $viewer->id)
                ->exists();
    }
}
