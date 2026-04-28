<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\TaskApplication;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoTaskSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('email', 'client@taskademy.test')->firstOrFail();
        $student = User::where('email', 'student@taskademy.test')->firstOrFail();

        $openTask = Task::updateOrCreate(
            ['title' => 'Landing Page Refresh for Campus Event'],
            [
                'category' => 'Design',
                'description' => 'Refresh an event landing page with stronger visuals, clearer CTAs, and mobile-first spacing.',
                'requirements' => 'Figma or React frontend experience preferred.',
                'budget' => 350,
                'deadline' => now()->addDays(10)->toDateString(),
                'status' => 'open',
                'moderation_status' => 'approved',
                'rejection_reason' => null,
                'archived_at' => null,
                'client_id' => $client->id,
                'student_id' => null,
            ],
        );

        $inProgressTask = Task::updateOrCreate(
            ['title' => 'Student Portal Dashboard UI Polish'],
            [
                'category' => 'Development',
                'description' => 'Improve dashboard hierarchy, cards, and table responsiveness for the student portal.',
                'requirements' => 'React, Tailwind, and accessibility best practices.',
                'budget' => 500,
                'deadline' => now()->addDays(6)->toDateString(),
                'status' => 'in_progress',
                'moderation_status' => 'approved',
                'rejection_reason' => null,
                'archived_at' => null,
                'client_id' => $client->id,
                'student_id' => $student->id,
            ],
        );

        $completedTask = Task::updateOrCreate(
            ['title' => 'Task Filtering Experience Upgrade'],
            [
                'category' => 'Development',
                'description' => 'Add cleaner filtering and search behavior to the task browsing experience.',
                'requirements' => 'Solid frontend state management and testing discipline.',
                'budget' => 420,
                'deadline' => now()->subDays(3)->toDateString(),
                'status' => 'completed',
                'moderation_status' => 'approved',
                'rejection_reason' => null,
                'archived_at' => null,
                'client_id' => $client->id,
                'student_id' => $student->id,
            ],
        );

        Task::updateOrCreate(
            ['title' => 'Admin Analytics Widget Expansion'],
            [
                'category' => 'Analytics',
                'description' => 'Add a richer analytics widget for registrations and moderation trends.',
                'requirements' => 'Charting library experience and clean dashboard UX.',
                'budget' => 650,
                'deadline' => now()->addDays(8)->toDateString(),
                'status' => 'open',
                'moderation_status' => 'pending',
                'rejection_reason' => null,
                'archived_at' => null,
                'client_id' => $client->id,
                'student_id' => null,
            ],
        );

        Task::updateOrCreate(
            ['title' => 'Overly Vague App Build Request'],
            [
                'category' => 'Development',
                'description' => 'Build an entire app quickly with no clear scope or timeline.',
                'requirements' => 'Do everything.',
                'budget' => 50,
                'deadline' => now()->addDays(4)->toDateString(),
                'status' => 'open',
                'moderation_status' => 'rejected',
                'rejection_reason' => 'Task scope is too vague and the budget does not align with the requested work.',
                'archived_at' => now(),
                'client_id' => $client->id,
                'student_id' => null,
            ],
        );

        TaskApplication::updateOrCreate(
            [
                'task_id' => $openTask->id,
                'applicant_id' => $student->id,
            ],
            ['status' => 'pending'],
        );

        TaskApplication::updateOrCreate(
            [
                'task_id' => $inProgressTask->id,
                'applicant_id' => $student->id,
            ],
            ['status' => 'accepted'],
        );

        TaskApplication::updateOrCreate(
            [
                'task_id' => $completedTask->id,
                'applicant_id' => $student->id,
            ],
            ['status' => 'accepted'],
        );
    }
}
