
import { createContext, useContext, useState, ReactNode } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  category: string;
  client: string;
  posted: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface TaskContextType {
  pendingTasks: Task[];
  approvedTasks: Task[];
  approveTask: (taskId: number) => void;
  rejectTask: (taskId: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialPendingTasks: Task[] = [
  {
    id: 1,
    title: "Logo Design for Tech Startup",
    client: "Client A",
    budget: "â‚±250",
    posted: "2 hours ago",
    description: "Need a modern, minimalist logo for our tech startup. Should work well in both color and black/white.",
    deadline: "5 days",
    category: "Design",
    status: 'pending'
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    client: "Client B",
    budget: "â‚±500",
    posted: "5 hours ago",
    description: "Looking for a talented designer to create UI/UX for our mobile banking app.",
    deadline: "1 week",
    category: "Design",
    status: 'pending'
  },
  {
    id: 3,
    title: "Content Writing for Blog",
    client: "Client C",
    budget: "â‚±150",
    posted: "1 day ago",
    description: "Need 5 blog posts about emerging tech trends. Each post should be 1000-1500 words.",
    deadline: "2 weeks",
    category: "Writing",
    status: 'pending'
  }
];

const initialApprovedTasks: Task[] = [
  {
    id: 101,
    title: "Design Landing Page for Startup",
    description: "Need a modern, responsive landing page for a SaaS startup. Should include hero section, features, and pricing.",
    budget: "â‚±150",
    deadline: "3 days",
    category: "Design",
    client: "Client D",
    posted: "1 day ago",
    status: 'approved'
  },
  {
    id: 102,
    title: "Write Blog Post on Tech Trends",
    description: "Looking for a 1500-word article about emerging tech trends in 2026. Should be SEO-optimized.",
    budget: "â‚±75",
    deadline: "5 days",
    category: "Writing",
    client: "Client E",
    posted: "2 days ago",
    status: 'approved'
  },
  {
    id: 103,
    title: "Build React Component Library",
    description: "Create a reusable component library with 10-15 common UI components using React and Tailwind.",
    budget: "â‚±300",
    deadline: "1 week",
    category: "Development",
    client: "Client F",
    posted: "3 days ago",
    status: 'approved'
  },
  {
    id: 104,
    title: "Social Media Graphics Package",
    description: "Design 10 Instagram post templates for a fitness brand. Modern, energetic style required.",
    budget: "â‚±100",
    deadline: "2 days",
    category: "Design",
    client: "Client G",
    posted: "4 days ago",
    status: 'approved'
  },
  {
    id: 105,
    title: "Data Entry and Organization",
    description: "Need help organizing customer data into spreadsheets. About 500 entries total.",
    budget: "â‚±50",
    deadline: "4 days",
    category: "Admin",
    client: "Client H",
    posted: "5 days ago",
    status: 'approved'
  },
  {
    id: 106,
    title: "Python Automation Script",
    description: "Create a script to automate daily data processing tasks. Experience with pandas required.",
    budget: "â‚±120",
    deadline: "6 days",
    category: "Development",
    client: "Client I",
    posted: "6 days ago",
    status: 'approved'
  }
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [pendingTasks, setPendingTasks] = useState<Task[]>(initialPendingTasks);
  const [approvedTasks, setApprovedTasks] = useState<Task[]>(initialApprovedTasks);

  const approveTask = (taskId: number) => {
    const task = pendingTasks.find(t => t.id === taskId);
    if (task) {
      setPendingTasks(prev => prev.filter(t => t.id !== taskId));
      setApprovedTasks(prev => [...prev, { ...task, status: 'approved' as const }]);
    }
  };

  const rejectTask = (taskId: number) => {
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ pendingTasks, approvedTasks, approveTask, rejectTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
