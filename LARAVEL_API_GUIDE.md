# Laravel Backend API Guide

This guide outlines the Laravel backend API you need to build to work with the Taskademy React frontend.

## Setup Requirements

1. **Laravel Version**: 10.x or 11.x
2. **Required Packages**:
   ```bash
   composer require laravel/sanctum
   ```

3. **Database**: MySQL, PostgreSQL, or SQLite
4. **CORS Configuration**: Enable CORS for your React frontend URL

## Environment Variables

Add to your Laravel `.env`:
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

## Database Schema

### Users Table
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->enum('role', ['student', 'client', 'admin'])->default('student');
    $table->string('avatar')->nullable();
    $table->text('bio')->nullable();
    $table->json('skills')->nullable();
    $table->decimal('rating', 3, 2)->default(0);
    $table->integer('completed_tasks')->default(0);
    $table->rememberToken();
    $table->timestamps();
});
```

### Tasks Table
```php
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('category');
    $table->text('description');
    $table->text('requirements')->nullable();
    $table->decimal('budget', 10, 2);
    $table->date('deadline');
    $table->enum('status', ['open', 'in_progress', 'completed', 'cancelled'])->default('open');
    $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('student_id')->nullable()->constrained('users')->onDelete('set null');
    $table->timestamps();
});
```

### Conversations Table
```php
Schema::create('conversations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user1_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('user2_id')->constrained('users')->onDelete('cascade');
    $table->timestamps();
    
    $table->unique(['user1_id', 'user2_id']);
});
```

### Messages Table
```php
Schema::create('messages', function (Blueprint $table) {
    $table->id();
    $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
    $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
    $table->text('content');
    $table->timestamps();
});
```

## API Routes

Add to `routes/api.php`:

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Tasks
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::post('/tasks/{id}/apply', [TaskController::class, 'apply']);
    Route::post('/tasks/{id}/accept', [TaskController::class, 'acceptApplication']);
    
    // Messages
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations', [MessageController::class, 'createConversation']);
    Route::get('/messages/{conversationId}', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'send']);
    
    // Users
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::post('/users/avatar', [UserController::class, 'uploadAvatar']);
    
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/tasks', [AdminController::class, 'tasks']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::put('/admin/users/{id}/role', [AdminController::class, 'updateUserRole']);
    });
});
```

## Controller Examples

### AuthController

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:student,client',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
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
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### TaskController

```php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['client', 'student']);

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->min_budget) {
            $query->where('budget', '>=', $request->min_budget);
        }

        if ($request->max_budget) {
            $query->where('budget', '<=', $request->max_budget);
        }

        return $query->latest()->paginate(15);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'budget' => 'required|numeric|min:0',
            'deadline' => 'required|date|after:today',
        ]);

        $task = $request->user()->tasksAsClient()->create($request->all());

        return response()->json($task->load(['client']), 201);
    }

    public function show($id)
    {
        $task = Task::with(['client', 'student'])->findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        // Authorization check
        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update($request->all());
        
        return response()->json($task->load(['client', 'student']));
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        if ($task->client_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function apply(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        if ($task->status !== 'open') {
            return response()->json(['message' => 'Task is not available'], 400);
        }

        // Create application logic here (you may want a separate applications table)
        
        return response()->json(['message' => 'Application submitted']);
    }

    public function acceptApplication(Request $request, $id)
    {
        $request->validate(['student_id' => 'required|exists:users,id']);
        
        $task = Task::findOrFail($id);
        
        if ($task->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update([
            'student_id' => $request->student_id,
            'status' => 'in_progress',
        ]);

        return response()->json($task->load(['client', 'student']));
    }
}
```

## Model Relationships

### User Model

```php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar', 'bio', 'skills', 'rating', 'completed_tasks'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'skills' => 'array',
        'rating' => 'decimal:2',
        'email_verified_at' => 'datetime',
    ];

    public function tasksAsClient()
    {
        return $this->hasMany(Task::class, 'client_id');
    }

    public function tasksAsStudent()
    {
        return $this->hasMany(Task::class, 'student_id');
    }
}
```

### Task Model

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title', 'category', 'description', 'requirements',
        'budget', 'deadline', 'status', 'client_id', 'student_id'
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'deadline' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
```

## CORS Configuration

Update `config/cors.php`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## Middleware for Admin

Create `app/Http/Middleware/IsAdmin.php`:

```php
namespace App\Http\Middleware;

use Closure;

class IsAdmin
{
    public function handle($request, Closure $next)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
```

Register in `app/Http/Kernel.php`:
```php
protected $middlewareAliases = [
    'admin' => \App\Http\Middleware\IsAdmin::class,
];
```

## Testing the API

Use these steps to test:

1. Start Laravel: `php artisan serve`
2. Start React: Update `.env` with `VITE_API_URL=http://localhost:8000/api`
3. Register a user through the frontend
4. Login and test features

## Additional Features to Implement

- Email verification
- Password reset
- File uploads for avatars
- Real-time messaging with Pusher/Laravel Echo
- Payment integration
- Task reviews and ratings
- Notifications system
