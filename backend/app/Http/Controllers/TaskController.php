<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['client', 'student']);

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->min_budget) {
            $query->where('budget', '>=', $request->min_budget);
        }

        if ($request->max_budget) {
            $query->where('budget', '<=', $request->max_budget);
        }

        $tasks = $query->latest()->paginate(15);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'budget' => 'required|numeric|min:0',
            'deadline' => 'required|date|after:today',
        ]);

        $task = $request->user()->tasksAsClient()->create($request->all());

        return response()->json($task->load(['client']), 201);
    }

    public function show(Task $task)
    {
        $task->load(['client', 'student']);
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update($request->all());

        return response()->json($task->load(['client', 'student']));
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function apply(Request $request, Task $task)
    {
        if ($task->status !== 'open') {
            return response()->json(['message' => 'Task is not available'], 400);
        }

        // Simple application - in production use Applications table
        return response()->json(['message' => 'Application submitted']);
    }

    public function acceptApplication(Request $request, Task $task)
    {
        $request->validate(['student_id' => 'required|exists:users,id']);

        if ($task->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update([
            'student_id' => $request->student_id,
            'status' => 'in_progress',
        ]);

        return response()->json($task->load(['client', 'student']));
    }
}

