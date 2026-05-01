
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import { authService } from '../services/auth.service';

/**
 * 🔒 AUTHENTICATION CONTEXT
 * --------------------------------------------------------------------------
 * The central state manager for user sessions across the platform.
 * It handles login, registration, persistent sessions, and role tracking.
 */
interface AuthContextType {
  user: User | null; // The current profile (name, email, role, etc.)
  loading: boolean; // True while the session is being verified with the API
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'client';
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>; // Force-sync the profile with the database
  isAuthenticated: boolean; // Quick helper to check if a user is logged in
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * 🔄 SESSION RE-HYDRATION
     * On app mount, we check if a user session exists in localStorage.
     * We then verify the token by fetching the fresh user profile from the API.
     */
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      const bootToken = localStorage.getItem('auth_token');
      setUser(storedUser);
      authService.getCurrentUser()
        .then((freshUser) => {
          // Verify token hasn't changed during the async request
          if (localStorage.getItem('auth_token') === bootToken) {
            setUser(freshUser);
          }
        })
        .catch(() => {
          // If verification fails (e.g., token expired), clear local session
          if (localStorage.getItem('auth_token') === bootToken) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'client';
  }) => {
    const response = await authService.register(data);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      return null;
    }

    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
