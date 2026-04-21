<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_tasks' => Task::count(),
            'open_tasks' => Task::where('status', 'open')->count(),
            'in_progress_tasks' => Task::where('status', 'in_progress')->count(),
            'completed_tasks' => Task::where('status', 'completed')->count(),
            'students' => User::where('role', 'student')->count(),
            'clients' => User::where('role', 'client')->count(),
        ]);
    }

    public function users()
    {
        $users = User::withCount(['tasksAsClient', 'tasksAsStudent'])->paginate(15);

        return response()->json($users);
    }

    public function tasks()
    {
        $tasks = Task::with(['client', 'student'])->paginate(15);

        return response()->json($tasks);
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:student,client,admin',
        ]);

        if ($user->role === 'admin' && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json($user);
    }
}
