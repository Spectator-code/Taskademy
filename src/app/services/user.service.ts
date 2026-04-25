import apiClient from '../config/api';
import { ResumeManual, User } from '../types/api';

export const userService = {
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateProfile(id: number, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post<{ avatar_url: string }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadResume(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await apiClient.post<User>('/users/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateResume(id: number, resume_manual: ResumeManual | null): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, { resume_manual });
    return response.data;
  },
};
