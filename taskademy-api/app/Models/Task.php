<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'requirements',
        'image_path',
        'image_name',
        'budget',
        'deadline',
        'status',
        'moderation_status',
        'rejection_reason',
        'archived_at',
        'payment_reference',
        'completed_at',
        'payment_confirmed_at',
        'earnings_released_at',
        'client_id',
        'student_id',
        'is_group_task',
        'required_students_count',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'deadline' => 'date',
            'is_group_task' => 'boolean',
            'required_students_count' => 'integer',
            'archived_at' => 'datetime',
            'completed_at' => 'datetime',
            'payment_confirmed_at' => 'datetime',
            'earnings_released_at' => 'datetime',
        ];
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function applications()
    {
        return $this->hasMany(TaskApplication::class);
    }

    public function assignees()
    {
        return $this->belongsToMany(User::class, 'task_assignees')
            ->withTimestamps();
    }

    public function groupConversation()
    {
        return $this->hasOne(Conversation::class);
    }
}
