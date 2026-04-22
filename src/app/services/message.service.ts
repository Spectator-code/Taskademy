import apiClient from '../config/api';
import { Conversation, Message } from '../types/api';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/conversations');
    return response.data;
  },

  async getMessages(conversationId: number): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/messages/${conversationId}`);
    return response.data;
  },

  async sendMessage(data: {
    conversation_id?: number;
    recipient_id?: number;
    content: string;
  }): Promise<Message> {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },

  async createConversation(userId: number): Promise<Conversation> {
    const response = await apiClient.post<Conversation>('/conversations', {
      user_id: userId,
    });
    return response.data;
  },
};
