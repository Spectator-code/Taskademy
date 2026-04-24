<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskApplication extends Model
{
    protected $fillable = ['task_id', 'applicant_id', 'status'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }
}
