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
    
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'resume_file_path',
        'resume_file_name',
        'resume_manual',
        'id_document_path',
        'id_document_name',
        'bio',
        'gcash_name',
        'gcash_number',
        'skills',
        'rating',
        'completed_tasks',
        'task_earnings',
        'referral_earnings',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $appends = ['avatar_url', 'resume_url', 'id_document_url'];

    public function tasksAsClient()
    {
        return $this->hasMany(Task::class, 'client_id');
    }

    public function tasksAsStudent()
    {
        return $this->hasMany(Task::class, 'student_id');
    }

    public function groupTasks()
    {
        return $this->belongsToMany(Task::class, 'task_assignees')
            ->withTimestamps();
    }

    public function taskApplications()
    {
        return $this->hasMany(TaskApplication::class, 'applicant_id');
    }

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
        return $this->avatar
            ? Storage::disk('public')->url($this->avatar)
            : null;
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
