<?php

namespace App\Models;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    
    /**
     * The User model represents all participants in the Taskademy ecosystem.
     * Roles include: 'student' (earners), 'client' (task posters), and 'admin'.
     */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // 'student', 'client', or 'admin'
        'avatar', // Path to profile image
        'resume_file_path', // PDF/Docx path
        'resume_file_name',
        'resume_manual', // JSON blob of manual experience entries
        'id_document_path', // KYC verification document
        'id_document_name',
        'bio',
        'gcash_name', // Payment disbursement details
        'gcash_number',
        'skills', // Array of professional tags
        'rating', // Cumulative feedback score
        'completed_tasks',
        'task_earnings',
        'referral_earnings',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $appends = ['avatar_url', 'resume_url', 'id_document_url'];

    /* --- Relationships --- */

    // Tasks created by this user as a Client
    public function tasksAsClient()
    {
        return $this->hasMany(Task::class, 'client_id');
    }

    // Tasks assigned to this user as a Student
    public function tasksAsStudent()
    {
        return $this->hasMany(Task::class, 'student_id');
    }

    // Tasks where this user is part of a collaborative group
    public function groupTasks()
    {
        return $this->belongsToMany(Task::class, 'task_assignees')
            ->withTimestamps();
    }

    // Records of tasks this user has applied for
    public function taskApplications()
    {
        return $this->hasMany(TaskApplication::class, 'applicant_id');
    }

    // Messaging threads this user is a participant in
    public function groupConversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withTimestamps();
    }

    
    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'resume_manual' => 'array',
            'rating' => 'decimal:2',
            'task_earnings' => 'decimal:2',
            'referral_earnings' => 'decimal:2',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar) {
            return Storage::disk('public')->url($this->avatar);
        }

        return "https://ui-avatars.com/api/?name=" . urlencode($this->name) . "&color=FFFFFF&background=00E599&bold=true&size=512";
    }

    public function getResumeUrlAttribute(): ?string
    {
        return $this->resume_file_path
            ? Storage::disk('public')->url($this->resume_file_path)
            : null;
    }

    public function getIdDocumentUrlAttribute(): ?string
    {
        return $this->id_document_path
            ? Storage::disk('public')->url($this->id_document_path)
            : null;
    }
}
