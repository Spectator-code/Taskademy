<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('is_group_task')->default(false)->after('student_id');
            $table->unsignedInteger('required_students_count')->default(1)->after('is_group_task');
        });

        Schema::table('conversations', function (Blueprint $table) {
            $table->boolean('is_group')->default(false)->after('user2_id');
            $table->string('title')->nullable()->after('is_group');
            $table->foreignId('task_id')->nullable()->after('title')->constrained('tasks')->nullOnDelete();
            $table->unique('task_id');
        });

        Schema::create('task_assignees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['task_id', 'user_id']);
        });

        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['conversation_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('task_assignees');

        Schema::table('conversations', function (Blueprint $table) {
            $table->dropUnique(['task_id']);
            $table->dropConstrainedForeignId('task_id');
            $table->dropColumn(['is_group', 'title']);
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['is_group_task', 'required_students_count']);
        });
    }
};
