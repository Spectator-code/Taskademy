<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('resume_file_path')->nullable()->after('avatar');
            $table->string('resume_file_name')->nullable()->after('resume_file_path');
            $table->json('resume_manual')->nullable()->after('resume_file_name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['resume_file_path', 'resume_file_name', 'resume_manual']);
        });
    }
};
