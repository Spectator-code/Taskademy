import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TaskProvider>
    </AuthProvider>
  );
}