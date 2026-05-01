<?php

use App\Models\User;
use Illuminate\Support\Facades\Storage;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = User::whereNotNull('avatar')->get();
$count = 0;

foreach ($users as $user) {
    if (!Storage::disk('public')->exists($user->avatar)) {
        $user->update(['avatar' => null]);
        $count++;
    }
}

echo "Cleaned up $count invalid avatar paths.\n";
