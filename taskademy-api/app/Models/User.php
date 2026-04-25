<?php

namespace App\Models;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
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
        'bio',
        'skills',
        'rating',
        'completed_tasks',
    ];

    protected $hidden = ['password', 'remember_token'];

    public function tasksAsClient()
    {
        return $this->hasMany(Task::class, 'client_id');
    }

    public function tasksAsStudent()
    {
        return $this->hasMany(Task::class, 'student_id');
    }

    public function taskApplications()
    {
        return $this->hasMany(TaskApplication::class, 'applicant_id');
    }

    
    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'rating' => 'decimal:2',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
