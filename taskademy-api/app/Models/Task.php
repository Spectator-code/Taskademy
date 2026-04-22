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
        'client_id',
        'student_id',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'deadline' => 'date',
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
}

