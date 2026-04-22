import apiClient from '../config/api';
import { User } from '../types/api';

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
};
