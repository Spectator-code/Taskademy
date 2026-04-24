import apiClient from '../config/api';
import { Task, PaginatedResponse, TaskApplication } from '../types/api';

export const taskService = {
  async getTasks(params?: {
    category?: string;
    search?: string;
    min_budget?: number;
    max_budget?: number;
    page?: number;
  }): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', { params });
    return response.data;
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async getMyTasks(scope: 'posted' | 'assigned'): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks/mine', {
      params: { scope },
    });
    return response.data;
  },

  async createTask(data: {
    title: string;
    category: string;
    description: string;
    requirements?: string;
    budget: number;
    deadline: string;
  }): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async applyToTask(id: number): Promise<void> {
    await apiClient.post(`/tasks/${id}/apply`);
  },

  async getTaskApplications(id: number): Promise<TaskApplication[]> {
    const response = await apiClient.get<TaskApplication[]>(`/tasks/${id}/applications`);
    return response.data;
  },

  async acceptApplication(taskId: number, studentId: number): Promise<Task> {
    const response = await apiClient.post<Task>(`/tasks/${taskId}/accept`, { student_id: studentId });
    return response.data;
  },

  async completeTask(taskId: number): Promise<Task> {
    const response = await apiClient.post<Task>(`/tasks/${taskId}/complete`);
    return response.data;
  },
};
