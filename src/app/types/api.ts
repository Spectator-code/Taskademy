export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'client' | 'admin';
  avatar?: string;
  avatar_url?: string | null;
  resume_file_path?: string | null;
  resume_file_name?: string | null;
  resume_url?: string | null;
  resume_manual?: ResumeManual | null;
  bio?: string;
  skills?: string[];
  rating?: number;
  completed_tasks?: number;
  completedTasks?: number;
  tasksAsStudent?: Task[];
  is_banned?: boolean;
  ban_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface ResumeEducation {
  school: string;
  degree: string;
  year: string;
}

export interface ResumeManual {
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
}

export interface Task {
  id: number;
  title: string;
  category: string;
  description: string;
  requirements?: string;
  image_path?: string | null;
  image_name?: string | null;
  image_url?: string | null;
  budget: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'draft';
  moderation_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  archived_at?: string | null;
  client_id: number;
  student_id?: number;
  client?: User;
  student?: User;
  created_at: string;
  updated_at: string;
}

export interface TaskApplication {
  id: number;
  task_id: number;
  applicant_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  applicant?: User;
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
  pending_tasks: number;
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

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  admin_id: number;
  is_active: boolean;
  created_at: string;
}
