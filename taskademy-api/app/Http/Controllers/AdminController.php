<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Carbon\CarbonImmutable;
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

    public function registrations(Request $request)
    {
        $validated = $request->validate([
            'period' => 'nullable|in:daily,weekly,monthly,yearly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $period = $validated['period'] ?? 'daily';
        $end = isset($validated['end_date'])
            ? CarbonImmutable::parse($validated['end_date'])->endOfDay()
            : now()->toImmutable()->endOfDay();
        $start = isset($validated['start_date'])
            ? CarbonImmutable::parse($validated['start_date'])->startOfDay()
            : match ($period) {
                'weekly' => $end->subWeeks(11)->startOfWeek()->startOfDay(),
                'monthly' => $end->subMonths(11)->startOfMonth()->startOfDay(),
                'yearly' => $end->subYears(4)->startOfYear()->startOfDay(),
                default => $end->subDays(29)->startOfDay(),
            };

        $users = User::query()
            ->whereBetween('created_at', [$start, $end])
            ->get(['created_at']);

        $counts = $users
            ->groupBy(fn (User $user) => $this->registrationBucket($user->created_at->toImmutable(), $period))
            ->map->count();

        $points = [];
        $cursor = $this->normalizeRegistrationCursor($start, $period);
        $last = $this->normalizeRegistrationCursor($end, $period);

        while ($cursor <= $last) {
            $key = $this->registrationBucket($cursor, $period);
            $points[] = [
                'date' => $key,
                'label' => $this->registrationLabel($cursor, $period),
                'registrations' => $counts->get($key, 0),
            ];
            $cursor = match ($period) {
                'weekly' => $cursor->addWeek(),
                'monthly' => $cursor->addMonth(),
                'yearly' => $cursor->addYear(),
                default => $cursor->addDay(),
            };
        }

        return response()->json([
            'period' => $period,
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'data' => $points,
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

    private function normalizeRegistrationCursor(CarbonImmutable $date, string $period): CarbonImmutable
    {
        return match ($period) {
            'weekly' => $date->startOfWeek()->startOfDay(),
            'monthly' => $date->startOfMonth()->startOfDay(),
            'yearly' => $date->startOfYear()->startOfDay(),
            default => $date->startOfDay(),
        };
    }

    private function registrationBucket(CarbonImmutable $date, string $period): string
    {
        return match ($period) {
            'weekly' => $date->startOfWeek()->toDateString(),
            'monthly' => $date->format('Y-m'),
            'yearly' => $date->format('Y'),
            default => $date->toDateString(),
        };
    }

    private function registrationLabel(CarbonImmutable $date, string $period): string
    {
        return match ($period) {
            'weekly' => $date->startOfWeek()->format('M j'),
            'monthly' => $date->format('M Y'),
            'yearly' => $date->format('Y'),
            default => $date->format('M j'),
        };
    }
}

