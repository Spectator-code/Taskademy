import apiClient from '../config/api';
import { User, AuthResponse } from '../types/api';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'client';
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/login', {
      email: data.email.trim(),
      password: data.password,
    });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      if (localStorage.getItem('auth_token')) {
        await apiClient.post('/logout');
      }
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/user');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
