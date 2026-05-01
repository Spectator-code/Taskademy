<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
/**
 * --------------------------------------------------------------------------
 * 🌍 PUBLIC API ROUTES
 * --------------------------------------------------------------------------
 * These routes are accessible without authentication.
 * Used for: Landing page, registration, and login.
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/platform-stats', [TaskController::class, 'publicStats']); // Returns stats for the landing page hero

/**
 * --------------------------------------------------------------------------
 * 🔐 PROTECTED API ROUTES (Sanctum)
 * --------------------------------------------------------------------------
 * Requires a valid 'Authorization: Bearer <token>' header.
 * Tokens are issued upon successful login or registration.
 */
Route::middleware('auth:sanctum')->group(function () {
    /* --- Account & Session --- */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); // Returns current authenticated user profile
    
    /* --- Task Management --- */
    Route::get('/tasks', [TaskController::class, 'index']); // Browse available tasks
    Route::get('/tasks/mine', [TaskController::class, 'mine']); // Tasks owned by or assigned to user
    Route::post('/tasks', [TaskController::class, 'store']); // Create a new task (Client only)
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    
    /* --- Applications & Workflow --- */
    Route::post('/tasks/{id}/apply', [TaskController::class, 'apply']); // Apply for a task (Student only)
    Route::get('/tasks/{id}/applications', [TaskController::class, 'applications']); // View applicants
    Route::post('/tasks/{id}/accept', [TaskController::class, 'acceptApplication']); // Hire a student
    Route::post('/tasks/{id}/complete', [TaskController::class, 'complete']); // Mark task as finished
    
    /* --- Messaging System --- */
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations', [MessageController::class, 'createConversation']);
    Route::get('/messages/{conversationId}', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'send']);
    
    /* --- User Profiles & Documents --- */
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::post('/users/avatar', [UserController::class, 'uploadAvatar']);
    Route::post('/users/resume', [UserController::class, 'uploadResume']);
    Route::delete('/users/resume', [UserController::class, 'deleteResume']);
    Route::post('/users/id-document', [UserController::class, 'uploadIdDocument']);
    Route::delete('/users/id-document', [UserController::class, 'deleteIdDocument']);

    /**
     * 🛡️ ADMINISTRATIVE ROUTES
     * Restricted to users with the 'admin' role.
     */
    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/registrations', [AdminController::class, 'registrations']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/tasks', [AdminController::class, 'tasks']);
        Route::post('/admin/tasks/{id}/approve', [AdminController::class, 'approveTask']);
        Route::post('/admin/tasks/{id}/reject', [AdminController::class, 'rejectTask']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::put('/admin/users/{id}/role', [AdminController::class, 'updateUserRole']);
    });
});
