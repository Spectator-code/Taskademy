
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RegisterOtpResponse, User } from '../types/api';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  requestRegisterOtp: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'client';
  }) => Promise<RegisterOtpResponse>;
  verifyRegisterOtp: (email: string, otp: string) => Promise<void>;
  resendRegisterOtp: (email: string) => Promise<RegisterOtpResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      const bootToken = localStorage.getItem('auth_token');
      setUser(storedUser);
      authService.getCurrentUser()
        .then((freshUser) => {
          if (localStorage.getItem('auth_token') === bootToken) {
            setUser(freshUser);
          }
        })
        .catch(() => {
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

  const requestRegisterOtp = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'client';
  }) => {
    return authService.requestRegisterOtp(data);
  };

  const verifyRegisterOtp = async (email: string, otp: string) => {
    const response = await authService.verifyRegisterOtp({ email, otp });
    setUser(response.user);
  };

  const resendRegisterOtp = async (email: string) => {
    return authService.resendRegisterOtp(email);
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
        requestRegisterOtp,
        verifyRegisterOtp,
        resendRegisterOtp,
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
