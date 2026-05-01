<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Task;
use App\Models\TaskApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $this->finalizeDueCompletedTasks();

        $query = Task::with($this->taskRelations())
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
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhere('category', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('min_budget')) {
            $query->where('budget', '>=', $request->input('min_budget'));
        }

        if ($request->filled('max_budget')) {
            $query->where('budget', '<=', $request->input('max_budget'));
        }

        return $query->latest()->paginate(15)->through(fn (Task $task) => $this->serializeTask($task));
    }

    public function mine(Request $request)
    {
        $this->finalizeDueCompletedTasks();

        $validated = $request->validate([
            'scope' => 'nullable|in:posted,assigned',
        ]);

        $scope = $validated['scope'] ?? 'posted';
        $query = Task::with($this->taskRelations());

        if ($scope === 'assigned') {
            $query->where(function ($builder) use ($request) {
                $builder
                    ->where('student_id', $request->user()->id)
                    ->orWhereHas('assignees', function ($assigneeQuery) use ($request) {
                        $assigneeQuery->where('users.id', $request->user()->id);
                    });
            });
        } else {
            $query->where('client_id', $request->user()->id);
        }

        return response()->json($query->latest()->get()->map(fn (Task $task) => $this->serializeTask($task)));
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
            'image' => 'nullable|file|image|max:5120',
            'budget' => 'required|numeric|min:0',
            'deadline' => 'required|date|after:today',
            'status' => 'nullable|in:open,draft',
            'is_group_task' => 'nullable|boolean',
            'required_students_count' => 'nullable|integer|min:2|max:20',
        ]);

        $isGroupTask = (bool) ($validated['is_group_task'] ?? false);
        $requiredStudentsCount = $isGroupTask
            ? (int) ($validated['required_students_count'] ?? 2)
            : 1;

        $imagePath = null;
        $imageName = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('task-images', 'public');
            $imageName = $image->getClientOriginalName();
        }

        $task = $request->user()->tasksAsClient()->create([
            ...$validated,
            'image_path' => $imagePath,
            'image_name' => $imageName,
            'status' => $validated['status'] ?? 'open',
            'moderation_status' => $request->user()->role === 'admin' ? 'approved' : 'pending',
            'is_group_task' => $isGroupTask,
            'required_students_count' => $requiredStudentsCount,
            'student_id' => $isGroupTask ? null : null,
        ]);

        return response()->json($this->serializeTask($task->load($this->taskRelations())), 201);
    }

    public function show(Request $request, $id)
    {
        $task = Task::with($this->taskRelations())->findOrFail($id);
        $task = $this->finalizeTaskIfDue($task->loadMissing($this->taskRelations()));
        $user = $request->user();

        $canPrivatelyViewTask =
            $task->client_id === $user->id
            || $task->student_id === $user->id
            || $task->assignees->contains('id', $user->id)
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

        return response()->json($this->serializeTask($task));
    }

    public function update(Request $request, $id)
    {
        $task = Task::with($this->taskRelations())->findOrFail($id);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'description' => 'sometimes|string',
            'requirements' => 'sometimes|nullable|string',
            'image' => 'nullable|file|image|max:5120',
            'budget' => 'sometimes|numeric|min:0',
            'deadline' => 'sometimes|date',
            'status' => 'sometimes|in:open,in_progress,completed,cancelled,draft',
            'is_group_task' => 'sometimes|boolean',
            'required_students_count' => 'sometimes|integer|min:2|max:20',
        ]);

        if ($request->hasFile('image')) {
            if ($task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }

            $image = $request->file('image');
            $validated['image_path'] = $image->store('task-images', 'public');
            $validated['image_name'] = $image->getClientOriginalName();
        }

        if (array_key_exists('is_group_task', $validated) && !$validated['is_group_task']) {
            $validated['required_students_count'] = 1;
        }

        $task->update($validated);

        return response()->json($this->serializeTask($task->fresh()->load($this->taskRelations())));
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function apply(Request $request, $id)
    {
        $task = Task::with('assignees')->findOrFail($id);

        if (!in_array($request->user()->role, ['student', 'admin'], true)) {
            return response()->json(['message' => 'Clients cannot apply for tasks'], 403);
        }

        if ($task->client_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot apply to your own task'], 422);
        }

        if ($task->moderation_status !== 'approved' || $task->status !== 'open') {
            return response()->json(['message' => 'Task is not available'], 400);
        }

        if ($task->is_group_task && $task->assignees()->count() >= $task->required_students_count) {
            return response()->json(['message' => 'This group task is already full'], 422);
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

        $task = Task::with($this->taskRelations())->findOrFail($id);
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

        if ($task->is_group_task) {
            return response()->json($this->acceptGroupApplication($task, $application, $student));
        }

        $task->update([
            'student_id' => $student->id,
            'status' => 'in_progress',
        ]);

        $application->update(['status' => 'accepted']);

        TaskApplication::where('task_id', $task->id)
            ->where('id', '!=', $application->id)
            ->update(['status' => 'rejected']);

        return response()->json($this->serializeTask($task->fresh()->load($this->taskRelations())));
    }

    public function complete(Request $request, $id)
    {
        $task = Task::with($this->taskRelations())->findOrFail($id);
        $validated = $request->validate([
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $isAssignedGroupMember = $task->assignees->contains('id', $request->user()->id);

        if (
            $task->client_id !== $request->user()->id
            && $task->student_id !== $request->user()->id
            && !$isAssignedGroupMember
            && $request->user()->role !== 'admin'
        ) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($task->status !== 'in_progress') {
            return response()->json(['message' => 'Only in-progress tasks can be marked completed'], 422);
        }

        if ($task->is_group_task && $task->assignees->isEmpty()) {
            return response()->json(['message' => 'This group task has no assigned workers'], 422);
        }

        if (!$task->is_group_task && (!$task->student_id || !$task->student)) {
            return response()->json(['message' => 'This task has no assigned worker'], 422);
        }

        $paymentReference = trim((string) ($validated['payment_reference'] ?? ''));
        $completedByClientOrAdmin = $task->client_id === $request->user()->id || $request->user()->role === 'admin';

        $task->update([
            'status' => 'completed',
            'completed_at' => $task->completed_at ?? now(),
            'payment_reference' => $paymentReference !== '' ? $paymentReference : $task->payment_reference,
        ]);

        if ($paymentReference !== '' || $completedByClientOrAdmin) {
            $task = $this->releaseTaskEarnings($task);
        } else {
            $task = $this->finalizeTaskIfDue($task);
        }

        return response()->json($this->serializeTask($task->fresh()->load($this->taskRelations())));
    }

    protected function acceptGroupApplication(Task $task, TaskApplication $application, User $student): array
    {
        if ($task->assignees->contains('id', $student->id)) {
            $application->update(['status' => 'accepted']);
            $this->ensureGroupConversationMembers($task->fresh()->load($this->taskRelations()));

            return $this->serializeTask($task->fresh()->load($this->taskRelations()));
        }

        if ($task->assignees()->count() >= $task->required_students_count) {
            throw ValidationException::withMessages([
                'student_id' => 'This group task is already full',
            ]);
        }

        $task->assignees()->attach($student->id);
        $application->update(['status' => 'accepted']);

        $acceptedCount = $task->assignees()->count();
        $newStatus = $acceptedCount >= $task->required_students_count ? 'in_progress' : 'open';

        $task->update([
            'status' => $newStatus,
        ]);

        if ($acceptedCount >= $task->required_students_count) {
            TaskApplication::where('task_id', $task->id)
                ->where('status', 'pending')
                ->update(['status' => 'rejected']);
        }

        $task = $task->fresh()->load($this->taskRelations());
        $this->ensureGroupConversationMembers($task);

        return $this->serializeTask($task->fresh()->load($this->taskRelations()));
    }

    protected function ensureGroupConversationMembers(Task $task): void
    {
        if (!$task->is_group_task) {
            return;
        }

        $task->loadMissing($this->taskRelations());

        $groupConversation = $task->groupConversation;

        if (!$groupConversation) {
            $firstAssigneeId = $task->assignees->first()?->id ?? $task->client_id;

            $groupConversation = Conversation::create([
                'user1_id' => $task->client_id,
                'user2_id' => $firstAssigneeId,
                'is_group' => true,
                'title' => $task->title . ' Team',
                'task_id' => $task->id,
            ]);
        } else {
            $groupConversation->update([
                'title' => $task->title . ' Team',
            ]);
        }

        $participantIds = collect([$task->client_id])
            ->merge($task->assignees->pluck('id'))
            ->unique()
            ->values()
            ->all();

        $groupConversation->participants()->sync($participantIds);
    }

    protected function taskRelations(): array
    {
        return [
            'client',
            'student',
            'assignees',
            'groupConversation.participants',
        ];
    }

    protected function serializeTask(Task $task): array
    {
        $task = $this->finalizeTaskIfDue($task->loadMissing($this->taskRelations()));
        $data = $task->toArray();
        $data['image_url'] = $task->image_path
            ? Storage::disk('public')->url($task->image_path)
            : null;
        $data['assigned_students_count'] = $task->is_group_task
            ? $task->assignees->count()
            : ($task->student_id ? 1 : 0);
        $data['open_group_slots'] = max(0, (int) $task->required_students_count - (int) $data['assigned_students_count']);
        $data['group_conversation_id'] = $task->groupConversation?->id;

        return $data;
    }

    protected function finalizeDueCompletedTasks(): void
    {
        Task::query()
            ->where('status', 'completed')
            ->whereNull('earnings_released_at')
            ->whereDate('deadline', '<', now()->toDateString())
            ->with($this->taskRelations())
            ->get()
            ->each(fn (Task $task) => $this->releaseTaskEarnings($task));
    }

    protected function finalizeTaskIfDue(Task $task): Task
    {
        if (
            $task->status === 'completed'
            && !$task->earnings_released_at
            && $task->deadline?->copy()->endOfDay()->isPast()
        ) {
            return $this->releaseTaskEarnings($task);
        }

        return $task;
    }

    protected function releaseTaskEarnings(Task $task): Task
    {
        if ($task->earnings_released_at) {
            return $task;
        }

        return DB::transaction(function () use ($task) {
            $freshTask = Task::with($this->taskRelations())->lockForUpdate()->findOrFail($task->id);

            $recipients = $freshTask->is_group_task
                ? $freshTask->assignees
                : collect([$freshTask->student])->filter();

            if ($freshTask->earnings_released_at || $recipients->isEmpty()) {
                return $freshTask;
            }

            $now = now();

            $freshTask->update([
                'payment_confirmed_at' => $freshTask->payment_confirmed_at ?? $now,
                'earnings_released_at' => $now,
                'archived_at' => $freshTask->archived_at ?? $now,
            ]);

            $recipients->each(function (User $recipient) use ($freshTask) {
                $recipient->increment('completed_tasks');
                $recipient->increment('task_earnings', (float) $freshTask->budget);
            });

            return $freshTask->fresh()->load($this->taskRelations());
        });
    }
}
