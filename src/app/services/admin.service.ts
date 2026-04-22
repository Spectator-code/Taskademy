import apiClient from '../config/api';
import { AdminStats, User, Task } from '../types/api';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>('/admin/stats');
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  },

  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/admin/tasks');
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async updateUserRole(id: number, role: string): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${id}/role`, { role });
    return response.data;
  },
};
