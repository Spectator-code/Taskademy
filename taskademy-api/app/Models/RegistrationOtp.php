<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationOtp extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password_encrypted',
        'role',
        'otp_hash',
        'expires_at',
        'resend_available_at',
        'attempts',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'resend_available_at' => 'datetime',
        ];
    }
}
