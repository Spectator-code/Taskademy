import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Users, ListChecks, FolderOpen, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "../services/admin.service";
import { AdminStats, Task, User } from "../types/api";
import { toast } from "sonner";

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      adminService.getStats(),
      adminService.getUsers(),
      adminService.getTasks(),
    ])
      .then(([statsResponse, usersResponse, tasksResponse]) => {
        if (ignore) {
          return;
        }

        setStats(statsResponse);
        setUsers(usersResponse.data.slice(0, 5));
        setTasks(tasksResponse.data.slice(0, 5));
      })
      .catch((error: any) => {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load admin data.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.users ?? 0,
    },
    {
      icon: ListChecks,
      label: "Total Tasks",
      value: stats?.tasks ?? 0,
    },
    {
      icon: FolderOpen,
      label: "Open Tasks",
      value: stats?.open_tasks ?? 0,
    },
    {
      icon: Shield,
      label: "Admin Access",
      value: "Enabled",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-foreground/60 mb-8">Live platform overview and management</p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {loading ? (
            <div className="text-foreground/60">Loading admin data...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h2 className="text-xl font-bold mb-6">Recent Users</h2>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <div className="font-medium mb-1">{user.name}</div>
                        <div className="text-sm text-foreground/60">{user.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm capitalize text-primary">{user.role}</div>
                        <div className="text-xs text-foreground/60">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h2 className="text-xl font-bold mb-6">Recent Tasks</h2>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                      <div>
                        <div className="font-medium mb-1">{task.title}</div>
                        <div className="text-sm text-foreground/60">{task.client?.name ?? "Client"}</div>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary capitalize">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
