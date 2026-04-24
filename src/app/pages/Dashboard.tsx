/** User dashboard featuring statistics and recommended tasks */
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
  PhilippinePeso,
  CheckCircle,
  ClipboardCheck,
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
import ThemeSwitcher from "../components/ui/ThemeSwitcher";
import { useApp } from "../contexts/AppContext";
import { formatPeso } from "../utils/currency";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isSidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);

   const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      taskService.getTasks(),
      taskService.getMyTasks("posted"),
      taskService.getMyTasks("assigned"),
    ])
      .then(([response, postedResponse, assignedResponse]) => {
        if (!ignore) {
          setTasks(response.data);
          setPostedTasks(postedResponse);
          setAssignedTasks(assignedResponse);
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
      assignedTasks.filter(
        (task) =>
          (task.status === "open" || task.status === "in_progress")
      ).length,
    [assignedTasks]
  );

  const completedTasks = useMemo(
    () => assignedTasks.filter((task) => task.status === "completed").length,
    [assignedTasks]
  );

  const totalEarnings = useMemo(
    () =>
      assignedTasks
        .filter((task) => task.status === "completed")
        .reduce((sum, task) => sum + Number(task.budget), 0),
    [assignedTasks]
  );

  const handleCompleteTask = async (taskId: number) => {
    setCompletingTaskId(taskId);
    try {
      const updatedTask = await taskService.completeTask(taskId);
      setPostedTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      setAssignedTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      setTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success("Task marked as completed.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete task.");
    } finally {
      setCompletingTaskId(null);
    }
  };

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
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`border-b border-border flex items-center ${
            isSidebarCollapsed ? "p-4 justify-center" : "p-6 justify-between gap-3"
          }`}
        >
          {!isSidebarCollapsed && (
            <Link to="/dashboard" className="text-xl font-bold flex items-center gap-3 min-w-0">
              <img src="/logo.png" alt="Taskademy" className="h-10 w-10 object-contain flex-shrink-0" />
              <span className="whitespace-nowrap">Taskademy</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link to="/dashboard" className="flex justify-center">
              <img src="/logo.png" alt="Taskademy" className="h-10 w-auto object-contain" />
            </Link>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/60 hover:bg-card hover:text-foreground transition-all"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

         {user && (
          <div className={`${isSidebarCollapsed ? "p-3" : "p-4"} border-b border-border`}>
            <Link
              to="/post-task"
              className={`w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${
                isSidebarCollapsed ? "h-11 px-0" : "px-4 py-3"
              }`}
              title="Post a Task"
              aria-label="Post a Task"
            >
              <span className="text-lg leading-none">+</span>
              {!isSidebarCollapsed && <span>Post a Task</span>}
            </Link>
          </div>
        )}

        <nav className={`${isSidebarCollapsed ? "p-3" : "p-4"} flex-1 space-y-2`}>
          {navItems.map((item) => (
            <Link
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={`flex items-center rounded-xl transition-all ${
                isSidebarCollapsed
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
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border bg-card/10 backdrop-blur-sm">
          <div className={`${isSidebarCollapsed ? "p-3" : "p-4"} space-y-4`}>
            {/* User Profile Block */}
            <div
              className={`flex items-center group cursor-pointer ${
                isSidebarCollapsed ? "justify-center" : "gap-3 px-3 py-2 rounded-2xl hover:bg-card/50 transition-all"
              }`}
              onClick={() => navigate(user?.id ? `/profile/${user.id}` : "/profile/0")}
              title={isSidebarCollapsed ? `${user?.name} - ${user?.role}` : ""}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              </div>
              
              {!isSidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                    {user?.name ?? "User"}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-foreground/40">
                    {user?.role ?? "Student"}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? "flex-col gap-3" : "justify-end gap-2 px-2"
              }`}
            >
              <button
                type="button"
                onClick={handleLogout}
                className={`flex items-center justify-center rounded-xl text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all ${
                  isSidebarCollapsed ? "w-10 h-10" : "w-10 h-10"
                }`}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
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
                  icon: PhilippinePeso,
                  label: "Total Earnings",
                  value: formatPeso(totalEarnings),
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
                              <PhilippinePeso className="w-4 h-4" />
                              {formatPeso(task.budget)}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Posted Tasks</h2>
              </div>

              {loading ? (
                <div className="text-foreground/60">Loading posted tasks...</div>
              ) : postedTasks.length === 0 ? (
                <div className="bg-card rounded-2xl p-6 border border-border text-foreground/60">
                  You have not posted any tasks yet.
                </div>
              ) : (
                <div className="grid gap-4">
                  {postedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-card rounded-2xl p-6 border border-border"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                              {task.category}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-foreground/70 text-sm capitalize">
                              {task.moderation_status}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm capitalize">
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                          <Link
                            to={`/task/${task.id}`}
                            className="text-xl font-bold hover:text-primary transition-colors"
                          >
                            {task.title}
                          </Link>
                          <div className="mt-3 flex items-center gap-6 text-foreground/60 flex-wrap">
                            <div className="flex items-center gap-2">
                              <PhilippinePeso className="w-4 h-4" />
                              {formatPeso(task.budget)}
                            </div>
                            {task.student && (
                              <div className="text-sm">
                                Assigned to{" "}
                                <Link to={`/profile/${task.student.id}`} className="text-primary hover:underline">
                                  {task.student.name}
                                </Link>
                              </div>
                            )}
                            {task.rejection_reason && (
                              <div className="text-sm text-red-300">
                                Rejection: {task.rejection_reason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={`/task/${task.id}`}
                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            View
                          </Link>
                          {task.status === "in_progress" && task.student_id && (
                            <button
                              type="button"
                              onClick={() => handleCompleteTask(task.id)}
                              disabled={completingTaskId === task.id}
                              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <ClipboardCheck className="w-4 h-4" />
                              {completingTaskId === task.id ? "Completing..." : "Mark Completed"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
