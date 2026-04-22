<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'tasks' => Task::count(),
            'open_tasks' => Task::where('status', 'open')->count(),
        ]);
    }

    public function users()
    {
        return User::latest()->paginate(25);
    }

    public function tasks()
    {
        return Task::with(['client', 'student'])->latest()->paginate(25);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function updateUserRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:student,client,admin',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return response()->json($user);
    }
}

