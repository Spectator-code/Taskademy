<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['client', 'student']);

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

    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['client', 'admin'], true)) {
            return response()->json(['message' => 'Only clients can post tasks'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'budget' => 'required|numeric|min:0',
            'deadline' => 'required|date|after:today',
        ]);

        $task = $request->user()->tasksAsClient()->create($validated);

        return response()->json($task->load(['client']), 201);
    }

    public function show($id)
    {
        $task = Task::with(['client', 'student'])->findOrFail($id);

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

        if ($request->user()->role !== 'student') {
            return response()->json(['message' => 'Only students can apply'], 403);
        }

        if ($task->client_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot apply to your own task'], 422);
        }

        if ($task->status !== 'open') {
            return response()->json(['message' => 'Task is not available'], 400);
        }

        return response()->json(['message' => 'Application submitted']);
    }

    public function acceptApplication(Request $request, $id)
    {
        $validated = $request->validate(['student_id' => 'required|exists:users,id']);

        $task = Task::findOrFail($id);
        $student = User::findOrFail($validated['student_id']);

        if ($task->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($student->role !== 'student') {
            return response()->json(['message' => 'Selected user is not a student'], 422);
        }

        $task->update([
            'student_id' => $student->id,
            'status' => 'in_progress',
        ]);

        return response()->json($task->load(['client', 'student']));
    }
}

