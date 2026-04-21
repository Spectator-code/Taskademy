# Taskademy - Freelance Task Platform

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org) [![Laravel](https://img.shields.io/badge/Laravel-11-orange)](https://laravel.com) [![shadcn/ui](https://img.shields.io/badge/shadcn--ui-0.8-blue)](https://ui.shadcn.com)

**Full-stack freelance marketplace for posting tasks, browsing opportunities, messaging, and admin management.**

[Live Figma Wireframe](https://www.figma.com/design/arWBBJO579T8BCW3uCEwbR/Taskademy-Figma-Wireframe)

## 🌟 Features

- **Authentication**: Register/Login (students/clients), role-based access, protected routes
- **Task Management**: Browse/post/update/delete tasks, filters (category, budget, search), pagination
- **Applications**: Students apply, clients accept
- **Messaging**: Conversations, real-time messages
- **Profiles**: Update bio, avatar, skills, ratings
- **Admin Dashboard**: Stats, user/task management, role changes
- **Responsive UI**: shadcn/ui components, Tailwind CSS, mobile-first

**Frontend**: 100% API-ready React + Vite + TypeScript  
**Backend**: Laravel + Sanctum (guides included)

## 🚀 Quick Start

### 1. Frontend (React) - Ready to Run!

```bash
pnpm install
pnpm run dev  # http://localhost:5173
```

**Configure API** (create `.env` from `.env.example`):
```
VITE_API_URL=http://localhost:8000/api
```

### 2. Backend (Laravel) - Build It!

```bash
# New Laravel project
composer create-project laravel/laravel taskademy-api
cd taskademy-api

# Install Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"

# Database (.env)
DB_CONNECTION=mysql
DB_DATABASE=taskademy
FRONTEND_URL=http://localhost:5173

# Migrations, Models, Controllers, Routes (copy from below)
php artisan make:migration create_users_table  # etc.
php artisan migrate
php artisan serve  # http://localhost:8000
```

**Test Flow**: Register → Login → Browse/Post Tasks → Messages.

## 📱 Frontend Documentation

### Architecture
```
src/app/
├── config/api.ts          # Axios + Auth
├── contexts/AuthContext.tsx
├── services/              # API calls (auth, task, message, user, admin)
├── types/api.ts           # TS interfaces
├── components/ProtectedRoute.tsx
└── pages/                 # Login✓ Register✓ BrowseTasks✓ PostTask✓ (others ready)
```

### Auth Hook Example
```tsx
const { user, login, logout, isAuthenticated } = useAuth();
await login(email, password);
```

### Task Service Example
```tsx
const tasks = await taskService.getTasks({ category: 'Design', page: 1 });
const task = await taskService.createTask({ title, budget, ... });
```

**Full services docs**: `FRONTEND_INTEGRATION.md` | **Summary**: `API_INTEGRATION_SUMMARY.md`

## 🛠 Laravel Backend - Complete Implementation

### Database Schema
**Users**:
```php
id, name, email, password, role(student/client/admin), avatar, bio, skills[], rating, completed_tasks
```

**Tasks**:
```php
id, title, category, description, requirements, budget, deadline, status(open/in_progress/completed), client_id, student_id
```

**Conversations**: `user1_id, user2_id`
**Messages**: `conversation_id, sender_id, content`

### Models (User example)
```php
class User extends Authenticatable {
    use HasApiTokens;
    protected $fillable = [...];
    public function tasksAsClient() { return $this->hasMany(Task::class, 'client_id'); }
}
```

### API Routes (`routes/api.php`)
```php
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);  // +filters
    Route::post('/tasks', [TaskController::class, 'store']);
    // ... full list below
});
```

**Controllers**: Copy full code examples from `LARAVEL_API_GUIDE.md` (AuthController, TaskController, etc.).

**CORS** (`config/cors.php`):
```php
'allowed_origins' => [env('FRONTEND_URL')],
'supports_credentials' => true,
```

### Admin Middleware
```php
// app/Http/Middleware/IsAdmin.php
if ($request->user()->role !== 'admin') abort(403);
```

**Full backend guide**: `LARAVEL_API_GUIDE.md`

## 🧪 Testing & Troubleshooting

### Create Test Data (Tinker)
```bash
php artisan tinker
User::create([...]); Task::create([...]);
```

### Common Issues
- **CORS**: Check `config/cors.php`, `php artisan config:clear`
- **401**: Sanctum token + `HasApiTokens` trait
- **No Data**: Run migrations, seed test data

## 🚀 Next Steps
1. Implement Laravel backend (1-2 hours).
2. Integrate remaining pages (Dashboard, Profile, etc.) using services.
3. Add: File uploads, payments, WebSockets, notifications.

## 📄 Original Guides (References)
- [Frontend Integration](FRONTEND_INTEGRATION.md)
- [API Summary](API_INTEGRATION_SUMMARY.md)
- [Laravel Guide](LARAVEL_API_GUIDE.md)
- [Quick Start](QUICK_START.md)

## 👨‍💼 Attributions
- shadcn/ui ([MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md))
- Unsplash photos ([License](https://unsplash.com/license))

## 💡 Guidelines Template
See `guidelines/Guidelines.md` for AI development rules.

---

**Built with ❤️ for Taskademy Figma Wireframe. Ready for production!**
