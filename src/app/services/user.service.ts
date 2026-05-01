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

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post<User>('/users/avatar', formData, {
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

  async deleteResume(): Promise<User> {
    const response = await apiClient.delete<User>('/users/resume');
    return response.data;
  },

  async uploadIdDocument(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('id_document', file);
    const response = await apiClient.post<User>('/users/id-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteIdDocument(): Promise<User> {
    const response = await apiClient.delete<User>('/users/id-document');
    return response.data;
  },

  async updateResume(id: number, resume_manual: ResumeManual | null): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, { resume_manual });
    return response.data;
  },

  async updateGcash(id: number, data: {
    gcash_name?: string | null;
    gcash_number?: string | null;
  }): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },
};
