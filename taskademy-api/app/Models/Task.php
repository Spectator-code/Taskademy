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
        'budget',
        'deadline',
        'status',
        'moderation_status',
        'rejection_reason',
        'archived_at',
        'client_id',
        'student_id',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'deadline' => 'date',
            'archived_at' => 'datetime',
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
}
