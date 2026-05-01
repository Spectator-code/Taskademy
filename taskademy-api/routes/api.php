<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/mine', [TaskController::class, 'mine']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::post('/tasks/{id}/apply', [TaskController::class, 'apply']);
    Route::get('/tasks/{id}/applications', [TaskController::class, 'applications']);
    Route::post('/tasks/{id}/accept', [TaskController::class, 'acceptApplication']);
    Route::post('/tasks/{id}/complete', [TaskController::class, 'complete']);
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations', [MessageController::class, 'createConversation']);
    Route::get('/messages/{conversationId}', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'send']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::post('/users/avatar', [UserController::class, 'uploadAvatar']);
    Route::post('/users/resume', [UserController::class, 'uploadResume']);
    Route::delete('/users/resume', [UserController::class, 'deleteResume']);
    Route::post('/users/id-document', [UserController::class, 'uploadIdDocument']);
    Route::delete('/users/id-document', [UserController::class, 'deleteIdDocument']);
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
