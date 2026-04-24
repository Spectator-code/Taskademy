<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskApplication;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['client', 'student'])
            ->where('moderation_status', 'approved')
            ->whereNull('archived_at')
            ->where('status', 'open');

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('min_budget')) {
            $query->where('budget', '>=', $request->input('min_budget'));
        }

        if ($request->filled('max_budget')) {
            $query->where('budget', '<=', $request->input('max_budget'));
        }

        return $query->latest()->paginate(15);
    }

    public function mine(Request $request)
    {
        $validated = $request->validate([
            'scope' => 'nullable|in:posted,assigned',
        ]);

        $scope = $validated['scope'] ?? 'posted';
        $query = Task::with(['client', 'student']);

        if ($scope === 'assigned') {
            $query->where('student_id', $request->user()->id);
        } else {
            $query->where('client_id', $request->user()->id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['student', 'client', 'admin'], true)) {
            return response()->json(['message' => 'Only signed-in users can post tasks'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'budget' => 'required|numeric|min:0',
            'deadline' => 'required|date|after:today',
        ]);

        $task = $request->user()->tasksAsClient()->create([
            ...$validated,
            'moderation_status' => $request->user()->role === 'admin' ? 'approved' : 'pending',
        ]);

        return response()->json($task->load(['client']), 201);
    }

    public function show(Request $request, $id)
    {
        $task = Task::with(['client', 'student'])->findOrFail($id);
        $user = $request->user();

        $canPrivatelyViewTask =
            $task->client_id === $user->id
            || $task->student_id === $user->id
            || $user->role === 'admin';

        if ($task->archived_at && !$canPrivatelyViewTask) {
            return response()->json(['message' => 'Task is archived'], 403);
        }

        if (
            $task->moderation_status !== 'approved'
            && !$canPrivatelyViewTask
        ) {
            return response()->json(['message' => 'Task is waiting for moderation'], 403);
        }

        if (
            $task->moderation_status === 'approved'
            && $task->status !== 'open'
            && !$canPrivatelyViewTask
        ) {
            return response()->json(['message' => 'Task is no longer publicly available'], 403);
        }

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'description' => 'sometimes|string',
            'requirements' => 'sometimes|nullable|string',
            'budget' => 'sometimes|numeric|min:0',
            'deadline' => 'sometimes|date',
            'status' => 'sometimes|in:open,in_progress,completed,cancelled',
        ]);

        $task->update($validated);

        return response()->json($task->load(['client', 'student']));
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function apply(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        if (!in_array($request->user()->role, ['student', 'admin'], true)) {
            return response()->json(['message' => 'Clients cannot apply for tasks'], 403);
        }

        if ($task->client_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot apply to your own task'], 422);
        }

        if ($task->moderation_status !== 'approved' || $task->status !== 'open') {
            return response()->json(['message' => 'Task is not available'], 400);
        }

        $application = TaskApplication::firstOrCreate([
            'task_id' => $task->id,
            'applicant_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Application submitted',
            'application' => $application->load('applicant'),
        ]);
    }

    public function applications(Request $request, $id)
    {
        $task = Task::with(['applications.applicant'])->findOrFail($id);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task->applications()->with('applicant')->latest()->get());
    }

    public function acceptApplication(Request $request, $id)
    {
        $validated = $request->validate(['student_id' => 'required|exists:users,id']);

        $task = Task::findOrFail($id);
        $student = User::findOrFail($validated['student_id']);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($student->role === 'client') {
            return response()->json(['message' => 'Selected user cannot perform tasks'], 422);
        }

        $application = TaskApplication::where('task_id', $task->id)
            ->where('applicant_id', $student->id)
            ->first();

        if (!$application) {
            return response()->json(['message' => 'Selected user has not applied to this task'], 422);
        }

        $task->update([
            'student_id' => $student->id,
            'status' => 'in_progress',
        ]);

        $application->update(['status' => 'accepted']);

        TaskApplication::where('task_id', $task->id)
            ->where('id', '!=', $application->id)
            ->update(['status' => 'rejected']);

        return response()->json($task->load(['client', 'student']));
    }

    public function complete(Request $request, $id)
    {
        $task = Task::with('student')->findOrFail($id);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($task->status !== 'in_progress') {
            return response()->json(['message' => 'Only in-progress tasks can be marked completed'], 422);
        }

        if (!$task->student_id || !$task->student) {
            return response()->json(['message' => 'This task has no assigned worker'], 422);
        }

        $task->update(['status' => 'completed']);
        $task->student->increment('completed_tasks');

        return response()->json($task->fresh()->load(['client', 'student']));
    }
}
