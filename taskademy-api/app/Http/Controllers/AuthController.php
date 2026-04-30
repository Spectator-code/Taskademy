<?php

namespace App\Http\Controllers;

use App\Mail\RegistrationOtpMail;
use App\Models\RegistrationOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const OTP_EXPIRY_MINUTES = 10;
    private const OTP_RESEND_COOLDOWN_SECONDS = 60;
    private const OTP_MAX_ATTEMPTS = 5;

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:student,client',
        ]);

        $normalizedEmail = strtolower(trim($validated['email']));
        $this->ensureStudentEmailIsValid($validated['role'], $normalizedEmail);

        RegistrationOtp::where('email', $normalizedEmail)
            ->where('expires_at', '<', now())
            ->delete();

        $existingPendingRegistration = RegistrationOtp::where('email', $normalizedEmail)->first();

        $otp = $this->issueRegistrationOtp(
            name: $validated['name'],
            email: $normalizedEmail,
            password: $validated['password'],
            role: $validated['role'],
            currentOtp: $existingPendingRegistration,
        );

        return response()->json([
            'message' => 'Verification code sent.',
            'email' => $otp->email,
            'expires_in' => self::OTP_EXPIRY_MINUTES * 60,
            'resend_available_in' => self::OTP_RESEND_COOLDOWN_SECONDS,
        ], 200);
    }

    public function verifyRegistrationOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $normalizedEmail = strtolower(trim($validated['email']));

        $pendingRegistration = RegistrationOtp::where('email', $normalizedEmail)->first();

        if (!$pendingRegistration) {
            throw ValidationException::withMessages([
                'email' => ['No pending registration was found for this email.'],
            ]);
        }

        if ($pendingRegistration->expires_at->isPast()) {
            $pendingRegistration->delete();

            throw ValidationException::withMessages([
                'otp' => ['This verification code has expired. Request a new code and try again.'],
            ]);
        }

        if (!Hash::check($validated['otp'], $pendingRegistration->otp_hash)) {
            $pendingRegistration->increment('attempts');

            if ($pendingRegistration->attempts >= self::OTP_MAX_ATTEMPTS) {
                $pendingRegistration->delete();

                throw ValidationException::withMessages([
                    'otp' => ['Too many incorrect attempts. Request a new code and try again.'],
                ]);
            }

            throw ValidationException::withMessages([
                'otp' => ['The verification code is incorrect.'],
            ]);
        }

        if (User::where('email', $normalizedEmail)->exists()) {
            $pendingRegistration->delete();

            throw ValidationException::withMessages([
                'email' => ['An account with this email already exists.'],
            ]);
        }

        $user = new User([
            'name' => $pendingRegistration->name,
            'email' => $pendingRegistration->email,
            'password' => Crypt::decryptString($pendingRegistration->password_encrypted),
            'role' => $pendingRegistration->role,
        ]);
        $user->email_verified_at = now();
        $user->save();

        $pendingRegistration->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function resendRegistrationOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $normalizedEmail = strtolower(trim($validated['email']));
        $pendingRegistration = RegistrationOtp::where('email', $normalizedEmail)->first();

        if (!$pendingRegistration) {
            throw ValidationException::withMessages([
                'email' => ['No pending registration was found for this email.'],
            ]);
        }

        if ($pendingRegistration->resend_available_at->isFuture()) {
            $secondsLeft = now()->diffInSeconds($pendingRegistration->resend_available_at);

            throw ValidationException::withMessages([
                'email' => ["Please wait {$secondsLeft} seconds before requesting another code."],
            ]);
        }

        $otp = $this->issueRegistrationOtp(
            name: $pendingRegistration->name,
            email: $pendingRegistration->email,
            password: Crypt::decryptString($pendingRegistration->password_encrypted),
            role: $pendingRegistration->role,
            currentOtp: $pendingRegistration,
        );

        return response()->json([
            'message' => 'A new verification code has been sent.',
            'email' => $otp->email,
            'expires_in' => self::OTP_EXPIRY_MINUTES * 60,
            'resend_available_in' => self::OTP_RESEND_COOLDOWN_SECONDS,
        ], 200);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    private function issueRegistrationOtp(
        string $name,
        string $email,
        string $password,
        string $role,
        ?RegistrationOtp $currentOtp = null,
    ): RegistrationOtp {
        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $pendingRegistration = $currentOtp ?? new RegistrationOtp();
        $pendingRegistration->fill([
            'name' => $name,
            'email' => $email,
            'password_encrypted' => Crypt::encryptString($password),
            'role' => $role,
            'otp_hash' => Hash::make($otpCode),
            'expires_at' => now()->addMinutes(self::OTP_EXPIRY_MINUTES),
            'resend_available_at' => now()->addSeconds(self::OTP_RESEND_COOLDOWN_SECONDS),
            'attempts' => 0,
        ]);
        $pendingRegistration->save();

        Mail::to($email)->send(new RegistrationOtpMail(
            name: $name,
            otp: $otpCode,
            expiresInMinutes: self::OTP_EXPIRY_MINUTES,
        ));

        return $pendingRegistration;
    }

    private function ensureStudentEmailIsValid(string $role, string $email): void
    {
        if ($role === 'student' && !str_ends_with($email, '.edu.ph')) {
            throw ValidationException::withMessages([
                'email' => ['Student accounts must use a valid .edu.ph email address.'],
            ]);
        }
    }
}
