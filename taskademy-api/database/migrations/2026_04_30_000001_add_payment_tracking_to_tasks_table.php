<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('payment_reference')->nullable()->after('archived_at');
            $table->timestamp('completed_at')->nullable()->after('payment_reference');
            $table->timestamp('payment_confirmed_at')->nullable()->after('completed_at');
            $table->timestamp('earnings_released_at')->nullable()->after('payment_confirmed_at');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn([
                'payment_reference',
                'completed_at',
                'payment_confirmed_at',
                'earnings_released_at',
            ]);
        });
    }
};
