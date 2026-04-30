import apiClient from '../config/api';
import { User, AuthResponse, RegisterOtpResponse } from '../types/api';

export const authService = {
  async requestRegisterOtp(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'client';
  }): Promise<RegisterOtpResponse> {
    const response = await apiClient.post<RegisterOtpResponse>('/register', {
      ...data,
      email: data.email.trim(),
    });
    return response.data;
  },

  async verifyRegisterOtp(data: {
    email: string;
    otp: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/register/verify-otp', {
      email: data.email.trim(),
      otp: data.otp.trim(),
    });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async resendRegisterOtp(email: string): Promise<RegisterOtpResponse> {
    const response = await apiClient.post<RegisterOtpResponse>('/register/resend-otp', {
      email: email.trim(),
    });
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
