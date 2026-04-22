# Quick Start Guide - Taskademy Laravel Integration

## Frontend (React) - Already Done! ✅

Your React app is fully prepared with:
- API services for all endpoints
- Authentication context and token management
- TypeScript types
- Loading states and error handling
- Example integrations in Login, Register, BrowseTasks, and PostTask pages

## Backend (Laravel) - What You Need to Build

### 1. Create Laravel Project

```bash
composer create-project laravel/laravel taskademy-api
cd taskademy-api
```

### 2. Install Laravel Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Configure Database

Update `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taskademy
DB_USERNAME=root
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:5173
```

### 4. Create Migrations

```bash
php artisan make:migration create_users_table
php artisan make:migration create_tasks_table
php artisan make:migration create_conversations_table
php artisan make:migration create_messages_table
```

Copy the schema from `LARAVEL_API_GUIDE.md` into each migration file.

### 5. Create Models

```bash
php artisan make:model Task
php artisan make:model Conversation
php artisan make:model Message
```

Add relationships as shown in `LARAVEL_API_GUIDE.md`.

### 6. Create Controllers

```bash
php artisan make:controller AuthController
php artisan make:controller TaskController
php artisan make:controller MessageController
php artisan make:controller UserController
php artisan make:controller AdminController
```

Copy controller code from `LARAVEL_API_GUIDE.md`.

### 7. Set Up Routes

Edit `routes/api.php` and add all routes from `LARAVEL_API_GUIDE.md`.

### 8. Configure CORS

Update `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => true,
```

### 9. Update User Model

Add to `app/Models/User.php`:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    
    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar', 'bio', 
        'skills', 'rating', 'completed_tasks'
    ];
    
    protected $casts = [
        'skills' => 'array',
    ];
}
```

### 10. Run Migrations

```bash
php artisan migrate
```

### 11. Start Laravel Server

```bash
php artisan serve
```

Laravel will run on `http://localhost:8000`.

---

## Testing the Full Stack

### 1. Configure React Frontend

Update `/workspaces/default/code/.env`:
```
VITE_API_URL=http://localhost:8000/api
```

### 2. Start React Dev Server

```bash
cd /workspaces/default/code
pnpm run dev
```

### 3. Test Features

1. **Register**: Go to `/register` and create a student account
2. **Login**: Use your credentials
3. **Browse Tasks**: View the task list (will be empty initially)
4. **Post Task**: Create a new task
5. **View Task**: Click on a task to see details

---

## API Endpoints You Need to Implement

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Messages
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `GET /api/messages/{id}` - Get messages
- `POST /api/messages` - Send message

### Users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile
- `POST /api/users/avatar` - Upload avatar

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/tasks` - List tasks

---

## Common Issues & Solutions

### CORS Error
**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**:
1. Check `config/cors.php` has correct frontend URL
2. Make sure Laravel is running
3. Clear Laravel config cache: `php artisan config:clear`

### 401 Unauthorized
**Problem**: API returns 401 even after login

**Solution**:
1. Check if Sanctum is installed
2. Verify `HasApiTokens` trait is on User model
3. Check if token is being sent in Authorization header

### No Data After Login
**Problem**: User logs in but no data loads

**Solution**:
1. Check browser console for API errors
2. Verify Laravel routes are registered
3. Check database has data (use `php artisan tinker` to create test data)

---

## Create Test Data

Use Laravel Tinker to create sample tasks:

```bash
php artisan tinker
```

```php
$user = User::create([
    'name' => 'John Client',
    'email' => 'client@example.com',
    'password' => bcrypt('password'),
    'role' => 'client'
]);

Task::create([
    'title' => 'Design Landing Page',
    'category' => 'Design',
    'description' => 'Need a modern landing page',
    'budget' => 150,
    'deadline' => '2026-05-01',
    'status' => 'open',
    'client_id' => $user->id
]);
```

---

## Next Steps After Basic Setup

1. **Add Validation**: Use Laravel Form Requests
2. **Add Relationships**: Eager load related data to reduce queries
3. **Add Pagination**: Return paginated results for large datasets
4. **Add Search**: Implement full-text search for tasks
5. **Add File Uploads**: Handle avatar and file uploads
6. **Add Email Notifications**: Send emails for task updates
7. **Add Real-time Features**: Use Laravel Echo + Pusher for live messaging

---

## Resources

- **Laravel Docs**: https://laravel.com/docs
- **Laravel Sanctum**: https://laravel.com/docs/sanctum
- **React Axios**: https://axios-http.com/docs/intro
- **Detailed Guides**:
  - `LARAVEL_API_GUIDE.md` - Complete Laravel implementation
  - `FRONTEND_INTEGRATION.md` - Frontend documentation
  - `API_INTEGRATION_SUMMARY.md` - Quick reference

---

## You're Ready to Build!

Your React frontend is **100% ready**. Just build the Laravel backend following this guide, and everything will work together perfectly!
