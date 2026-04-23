import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Search,
  ListChecks,
  MessageSquare,
  User,
  Settings,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { taskService } from "../services/task.service";
import { Task } from "../types/api";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    let ignore = false;

    taskService
      .getTasks()
      .then((response) => {
        if (!ignore) {
          setTasks(response.data);
        }
      })
      .catch((error: any) => {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load dashboard tasks.");
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

  const recommendedTasks = useMemo(
    () => tasks.filter((task) => task.status === "open").slice(0, 4),
    [tasks]
  );

  const activeTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.student_id === user?.id &&
          (task.status === "open" || task.status === "in_progress")
      ).length,
    [tasks, user?.id]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.student_id === user?.id && task.status === "completed").length,
    [tasks, user?.id]
  );

  const totalEarnings = useMemo(
    () =>
      tasks
        .filter((task) => task.student_id === user?.id && task.status === "completed")
        .reduce((sum, task) => sum + Number(task.budget), 0),
    [tasks, user?.id]
  );

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      active: true,
    },
    {
      to: "/browse",
      icon: Search,
      label: "Browse Tasks",
    },
    {
      to: "/browse",
      icon: ListChecks,
      label: "My Tasks",
    },
    {
      to: "/messages",
      icon: MessageSquare,
      label: "Messages",
    },
    {
      to: user?.id ? `/profile/${user.id}` : "/profile/0",
      icon: User,
      label: "Profile",
    },
    {
      to: "/settings",
      icon: Settings,
      label: "Settings",
    },
    ...(user?.role === "admin"
      ? [
          {
            to: "/admin",
            icon: Star,
            label: "Admin",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`border-b border-border flex items-center ${
            sidebarCollapsed ? "p-4 justify-center" : "p-6 justify-between gap-3"
          }`}
        >
          {!sidebarCollapsed && (
            <Link to="/dashboard" className="text-2xl font-bold truncate">
              Taskademy
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/60 hover:bg-card hover:text-foreground transition-all"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {user?.role === "client" && (
          <div className={`${sidebarCollapsed ? "p-3" : "p-4"} border-b border-border`}>
            <Link
              to="/post-task"
              className={`w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${
                sidebarCollapsed ? "h-11 px-0" : "px-4 py-3"
              }`}
              title="Post a Task"
              aria-label="Post a Task"
            >
              <span className="text-lg leading-none">+</span>
              {!sidebarCollapsed && <span>Post a Task</span>}
            </Link>
          </div>
        )}

        <nav className={`${sidebarCollapsed ? "p-3" : "p-4"} flex-1 space-y-2`}>
          {navItems.map((item) => (
            <Link
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={`flex items-center rounded-xl transition-all ${
                sidebarCollapsed
                  ? "h-12 justify-center px-0"
                  : "gap-3 px-4 py-3"
              } ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:bg-card hover:text-foreground"
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={`${sidebarCollapsed ? "p-3" : "p-4"} border-t border-border`}>
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "flex-col gap-2" : "justify-between gap-3 px-4 py-3"
            }`}
          >
            <div
              className={`flex items-center min-w-0 ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
              title={`${user?.name ?? "User"}${user?.role ? ` - ${user.role}` : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div className="font-medium truncate">{user?.name ?? "User"}</div>
                  <div className="text-sm text-foreground/60 capitalize">{user?.role ?? ""}</div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground/60 hover:bg-card hover:text-foreground transition-all"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/60 mb-8">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: Clock,
                  label: "Active Tasks",
                  value: String(activeTasks),
                  color: "text-blue-400",
                },
                {
                  icon: CheckCircle,
                  label: "Completed Tasks",
                  value: String(completedTasks),
                  color: "text-primary",
                },
                {
                  icon: DollarSign,
                  label: "Total Earnings",
                  value: `$${totalEarnings.toFixed(2)}`,
                  color: "text-yellow-400",
                },
                {
                  icon: Star,
                  label: "Rating",
                  value: String(user?.rating ?? "0.00"),
                  color: "text-primary",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Open Tasks</h2>
                <Link
                  to="/browse"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="text-foreground/60">Loading tasks...</div>
              ) : (
                <div className="grid gap-4">
                  {recommendedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                              {task.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-6 text-foreground/60 flex-wrap">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              ${Number(task.budget).toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/task/${task.id}`}
                          className="px-6 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          View
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && recommendedTasks.length === 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border text-foreground/60">
                  No open tasks available yet.
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
