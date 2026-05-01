<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/**
 * 🏠 WEB FALLBACK & SYSTEM ROUTES
 * --------------------------------------------------------------------------
 * These routes handle basic health checks and local asset resolution.
 */

Route::get('/', function () {
    return response()->json([
        'name' => 'Taskademy API',
        'status' => 'ok',
        'environment' => config('app.env'),
    ]);
});

/**
 * 📂 ASSET STREAMING FALLBACK
 * --------------------------------------------------------------------------
 * Used for: Serving avatars, resumes, and ID documents.
 * Rationale: Standard Laravel 'storage:link' (symlinks) can be unreliable on
 * Windows development environments. This route manually streams files from the 
 * /storage/app/public directory to the browser.
 */
Route::get('/storage/{path}', function ($path) {
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    $absolutePath = Storage::disk('public')->path($path);
    return response()->file($absolutePath);
})->where('path', '.*');
