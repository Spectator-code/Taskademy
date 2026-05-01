<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('gcash_name')->nullable()->after('bio');
            $table->string('gcash_number')->nullable()->after('gcash_name');
            $table->decimal('task_earnings', 12, 2)->default(0)->after('completed_tasks');
            $table->decimal('referral_earnings', 12, 2)->default(0)->after('task_earnings');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'gcash_name',
                'gcash_number',
                'task_earnings',
                'referral_earnings',
            ]);
        });
    }
};
