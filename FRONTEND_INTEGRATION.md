# Frontend Laravel API Integration

## Overview

The Taskademy React frontend is now fully integrated with Laravel backend API services. This document explains how the integration works and how to use it.

## Architecture

### API Client Configuration
- **Location**: `src/app/config/api.ts`
- **Base URL**: Configured via `.env` file (`VITE_API_URL`)
- **Authentication**: Bearer token stored in localStorage
- **Auto-redirect**: Redirects to `/login` on 401 responses

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

## Services

All API calls are organized into service modules:

### 1. Auth Service (`src/app/services/auth.service.ts`)
- `register()` - Create new account
- `login()` - User login
- `logout()` - User logout
- `getCurrentUser()` - Fetch current user data
- `getStoredUser()` - Get user from localStorage
- `isAuthenticated()` - Check auth status

### 2. Task Service (`src/app/services/task.service.ts`)
- `getTasks()` - List tasks with filters
- `getTaskById()` - Get single task
- `createTask()` - Create new task
- `updateTask()` - Update task
- `deleteTask()` - Delete task
- `applyToTask()` - Apply for a task
- `acceptApplication()` - Accept student application

### 3. Message Service (`src/app/services/message.service.ts`)
- `getConversations()` - List user conversations
- `getMessages()` - Get messages in a conversation
- `sendMessage()` - Send a message
- `createConversation()` - Start new conversation

### 4. User Service (`src/app/services/user.service.ts`)
- `getUserById()` - Get user profile
- `updateProfile()` - Update user data
- `uploadAvatar()` - Upload profile picture

### 5. Admin Service (`src/app/services/admin.service.ts`)
- `getStats()` - Dashboard statistics
- `getUsers()` - List all users
- `getTasks()` - List all tasks
- `deleteUser()` - Remove user
- `updateUserRole()` - Change user role

## Authentication Flow

### Registration
```typescript
import { useAuth } from '../contexts/AuthContext';

const { register } = useAuth();

await register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  password_confirmation: "password123",
  role: "student"
});
```

### Login
```typescript
import { useAuth } from '../contexts/AuthContext';

const { login } = useAuth();

await login("john@example.com", "password123");
```

### Using Auth State
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Protected Routes

Use the `ProtectedRoute` component to restrict access:

```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';

// Protect any authenticated route
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## Making API Calls

### Example: Fetching Tasks

```typescript
import { taskService } from '../services/task.service';
import { useEffect, useState } from 'react';

function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await taskService.getTasks({
          category: 'Web Development',
          min_budget: 50,
          page: 1
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

### Example: Creating a Task

```typescript
import { taskService } from '../services/task.service';
import { toast } from 'sonner';

async function handleCreateTask(formData) {
  try {
    const task = await taskService.createTask({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      requirements: formData.requirements,
      budget: parseFloat(formData.budget),
      deadline: formData.deadline
    });

    toast.success('Task created successfully!');
    navigate(`/task/${task.id}`);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create task');
  }
}
```

## Error Handling

All API services use try/catch with toast notifications:

```typescript
try {
  await taskService.deleteTask(taskId);
  toast.success('Task deleted');
} catch (error: any) {
  toast.error(error.response?.data?.message || 'Something went wrong');
}
```

Common error responses:
- `401 Unauthorized` - Automatically redirects to login
- `403 Forbidden` - User lacks permission
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation errors

## Type Safety

All API responses are typed using TypeScript interfaces in `src/app/types/api.ts`:

```typescript
import { User, Task, Message } from '../types/api';

// Full type safety
const user: User = await userService.getUserById(1);
const tasks: Task[] = await taskService.getTasks();
```

## Development Workflow

1. **Start Laravel backend**:
   ```bash
   cd taskademy-api
   php artisan serve
   ```

2. **Start React frontend**:
   ```bash
   pnpm install
   pnpm run dev
   ```

3. **Configure API URL**: Update `.env` with Laravel URL

4. **Test authentication**: Register/login through the frontend

5. **Monitor network**: Use browser DevTools Network tab to debug API calls

## Mock Data vs Real API

By default, the app is configured to use the Laravel API. To temporarily use mock data during development:

1. Comment out API calls in components
2. Use local state with sample data
3. Switch back to API calls when Laravel backend is ready

## Next Steps

1. Build the Laravel backend using `LARAVEL_API_GUIDE.md`
2. Run database migrations
3. Test all endpoints with the React frontend
4. Add additional features like file uploads, notifications, etc.

## Troubleshooting

### CORS Issues
- Check Laravel `config/cors.php` configuration
- Ensure `FRONTEND_URL` is set in Laravel `.env`
- Verify `supports_credentials` is `true`

### 401 Errors
- Check if token is stored in localStorage
- Verify Laravel Sanctum is configured
- Ensure `Authorization: Bearer {token}` header is sent

### Network Errors
- Confirm Laravel is running on the correct port
- Check `VITE_API_URL` in React `.env`
- Verify API routes in Laravel `routes/api.php`
