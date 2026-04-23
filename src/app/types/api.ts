export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'client' | 'admin';
  avatar?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  // Laravel returns snake_case; keep both for compatibility.
  completed_tasks?: number;
  completedTasks?: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  category: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  client_id: number;
  student_id?: number;
  client?: User;
  student?: User;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender?: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  user1_id: number;
  user2_id: number;
  user1?: User;
  user2?: User;
  last_message?: Message;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  users: number;
  tasks: number;
  open_tasks: number;
}

export type RegistrationPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RegistrationPoint {
  date: string;
  label: string;
  registrations: number;
}

export interface RegistrationAnalytics {
  period: RegistrationPeriod;
  start_date: string;
  end_date: string;
  data: RegistrationPoint[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
