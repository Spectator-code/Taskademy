
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
  Images,
  Clock,
  PhilippinePeso,
  CheckCircle,
  ClipboardCheck,
  ArrowRight,
  LogOut,
  Heart,
  X,
  UserCircle,
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

import DashboardSidebar from "../components/DashboardSidebar";

import { useTranslation } from "../hooks/useTranslation";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [savedStudents, setSavedStudents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const handleStorage = () => {
      setSavedStudents(JSON.parse(localStorage.getItem('saved_students') || '[]'));
      setAnnouncements(JSON.parse(localStorage.getItem('announcements') || '[]'));
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [window.location.hash]);

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

  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const fields = [
      user.name,
      user.bio,
      user.avatar_url,
      user.skills?.length ? true : false,
      user.resume_url || user.resume_manual ? true : false
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete task.");
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Role-specific header background glow */}
            <div className={`absolute -top-24 -left-24 w-64 h-64 blur-[100px] opacity-20 pointer-events-none ${
              user?.role === 'admin' ? 'bg-amber-500' : user?.role === 'client' ? 'bg-blue-500' : 'bg-emerald-500'
            }`} />

            <h1 className="text-4xl font-bold mb-2 relative z-10">{t("dashboard")}</h1>
            <p className="text-foreground/60 mb-8 relative z-10">
              {t("welcome")}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </p>

            {/* Platform Announcements */}
            {announcements.length > 0 && (
              <div className="mb-8 space-y-3 relative z-10">
                {announcements.map(ann => (
                  <motion.div 
                    key={ann.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-2xl border flex items-center gap-4 ${
                      ann.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : ann.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      ann.type === 'info' ? 'bg-blue-500' : ann.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <span className="font-bold mr-2 uppercase text-[10px] tracking-widest">{ann.type}:</span>
                      <span className="font-medium">{ann.title}</span>
                      <p className="text-sm opacity-80">{ann.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {user?.role === 'student' && profileCompletion < 100 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-card rounded-2xl border border-emerald-500/20 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t("profileCompletionScore") || "Profile Completion Score"}</h3>
                    <p className="text-sm text-foreground/60">{t("completeProfileBonus") || "Complete your profile to 3x your hiring chances!"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-500">{profileCompletion}%</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <User className="w-32 h-32 text-emerald-500" />
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: Clock,
                  label: t("activeTasks"),
                  value: String(activeTasks),
                  color: "text-blue-400",
                },
                {
                  icon: CheckCircle,
                  label: t("completedTasks"),
                  value: String(completedTasks),
                  color: "text-primary",
                },
                {
                  icon: PhilippinePeso,
                  label: t("totalEarnings"),
                  value: formatPeso(totalEarnings),
                  color: "text-yellow-400",
                },
                {
                  icon: Star,
                  label: t("rating"),
                  value: String(user?.rating ?? "0.00"),
                  color: "text-primary",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-card rounded-2xl p-6 border transition-all hover:scale-105 duration-300 ${
                    user?.role === 'admin' 
                      ? 'border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]' 
                      : user?.role === 'client'
                      ? 'border-blue-500/20 shadow-[0_0_15px_-5px_rgba(59,130,246,0.1)]'
                      : 'border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      user?.role === 'admin' ? 'bg-amber-500' : user?.role === 'client' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />
                  </div>
                  <div className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</div>
                  <div className="text-foreground/60 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t("recommendedTasks") || "Recommended Tasks"}</h2>
                <Link
                  to="/browse"
                  className="text-primary hover:underline flex items-center gap-2 font-medium"
                >
                  {t("viewAll")}
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
                      className={`bg-card rounded-2xl p-6 border transition-all group ${
                        user?.role === 'admin' 
                          ? 'border-amber-500/10 hover:border-amber-500/30' 
                          : user?.role === 'client'
                          ? 'border-blue-500/10 hover:border-blue-500/30'
                          : 'border-emerald-500/10 hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              user?.role === 'admin' 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : user?.role === 'client'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
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
                <div className="bg-card rounded-2xl p-6 border border-border text-foreground/60 mb-6">
                  No open tasks available yet.
                </div>
              )}
            </motion.div>

            {user?.role === "student" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{t("tasksWorkingOn") || "Tasks You're Working On"}</h2>
                  <Link
                    to="/my-tasks"
                    className="text-primary hover:underline flex items-center gap-2 font-medium"
                  >
                    {t("viewAll")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {loading ? (
                  <div className="text-foreground/60">{t("loadingTasks") || "Loading your tasks..."}</div>
                ) : assignedTasks.length === 0 ? (
                  <div className="bg-card rounded-2xl p-6 border border-border text-foreground/60">
                    {t("notWorkingOnAny") || "You're not working on any tasks yet."}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {assignedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-card rounded-2xl p-6 border border-emerald-500/10 hover:border-emerald-500/30 transition-all shadow-[0_0_10px_-3px_rgba(16,185,129,0.05)]"
                      >
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">{task.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-foreground/60">
                                <span className="capitalize px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                                  {task.status.replace("_", " ")}
                                </span>
                                <span>Budget: {formatPeso(task.budget)}</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Link
                                to={`/task/${task.id}`}
                                className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                              >
                                <ArrowRight className="w-4 h-4" />
                                {t("details") || "Details"}
                              </Link>
                              {task.status === "in_progress" && (
                                <button
                                  onClick={() => handleCompleteTask(task.id)}
                                  disabled={completingTaskId === task.id}
                                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 font-bold shadow-lg shadow-emerald-500/20"
                                >
                                  {completingTaskId === task.id ? "..." : t("completeTask") || "Complete Task"}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Progress Tracker */}
                          <div className="pt-4 border-t border-border/50">
                            <div className="flex justify-between relative px-2">
                              {[
                                { id: 'accepted', label: t('accepted') || 'Accepted', icon: CheckCircle },
                                { id: 'in_progress', label: t('inProgress') || 'In Progress', icon: Clock },
                                { id: 'completed', label: t('completed') || 'Completed', icon: Star },
                              ].map((step, idx, arr) => {
                                const isDone = 
                                  (task.status === 'in_progress' && idx <= 1) ||
                                  (task.status === 'completed' && idx <= 2) ||
                                  (task.status === 'open' && idx === 0);
                                
                                return (
                                  <div key={step.id} className="flex-1 relative flex flex-col items-center">
                                    {idx < arr.length - 1 && (
                                      <div className={`absolute top-4 left-[50%] w-full h-[2px] ${isDone && (task.status === 'completed' || (task.status === 'in_progress' && idx === 0)) ? 'bg-emerald-500' : 'bg-muted'}`} />
                                    )}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 mb-2 transition-all ${
                                      isDone ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20' : 'bg-muted text-foreground/40'
                                    }`}>
                                      <step.icon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-emerald-500' : 'text-foreground/40'}`}>
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {(user?.role === "client" || user?.role === "admin") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8"
              >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t("postedTasks")}</h2>
              </div>

              {loading ? (
                <div className="text-foreground/60">{t("loadingPostedTasks") || "Loading posted tasks..."}</div>
              ) : postedTasks.length === 0 ? (
                <div className="bg-card rounded-2xl p-6 border border-border text-foreground/60">
                  {t("noTasksPosted") || "You have not posted any tasks yet."}
                </div>
              ) : (
                <div className="grid gap-4">
                  {postedTasks.filter(t => t.status !== 'draft').map((task) => (
                    <div
                      key={task.id}
                      className={`bg-card rounded-2xl p-6 border transition-all ${
                        user?.role === 'admin' 
                          ? 'border-amber-500/10 hover:border-amber-500/30 shadow-[0_0_10px_-3px_rgba(245,158,11,0.05)]' 
                          : 'border-blue-500/10 hover:border-blue-500/30 shadow-[0_0_10px_-3px_rgba(59,130,246,0.05)]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              user?.role === 'admin' 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : 'bg-blue-500/10 text-blue-500'
                            }`}>
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

              {/* Draft Tasks Section */}
              {postedTasks.some(t => t.status === 'draft') && (
                <div id="draft-tasks" className="mt-12 scroll-mt-24">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground/60">
                    <ClipboardCheck className="w-5 h-5" />
                    {t("draftTasks") || "Draft Tasks"}
                  </h3>
                  <div className="grid gap-4 opacity-70 hover:opacity-100 transition-opacity">
                    {postedTasks.filter(t => t.status === 'draft').map((task) => (
                      <div key={task.id} className="bg-card/50 rounded-2xl p-6 border border-dashed border-border flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{task.title}</h4>
                          <p className="text-sm text-foreground/40 italic">Last saved on {new Date(task.updated_at).toLocaleDateString()}</p>
                        </div>
                        <Link 
                          to={`/post-task?draft=${task.id}`} 
                          className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold"
                        >
                          Continue Editing
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Students Section */}
              {user?.role === 'client' && (
                <div id="saved-students" className="mt-12 scroll-mt-24">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    {t("savedStudents") || "Saved Students"}
                  </h3>
                  {savedStudents.length === 0 ? (
                    <div className="p-8 bg-card rounded-2xl border border-dashed border-border text-center text-foreground/40">
                      <p>You haven't saved any students yet.</p>
                      <Link to="/browse" className="text-primary hover:underline text-sm mt-2 inline-block">Browse students</Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedStudents.map((student) => (
                        <div key={student.id} className="bg-card rounded-2xl p-6 border border-border group hover:border-blue-500/50 transition-all">
                          <div className="flex items-center gap-4 mb-4">
                            {student.avatar ? (
                              <img src={student.avatar} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <UserCircle className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold group-hover:text-blue-500 transition-colors">{student.name}</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {student.skills?.slice(0, 2).map((s: string) => (
                                  <span key={s} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/60">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/profile/${student.id}`} className="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-500 text-center text-sm font-bold hover:bg-blue-500 hover:text-white transition-all">
                              Profile
                            </Link>
                            <button 
                              onClick={() => {
                                const filtered = savedStudents.filter(s => s.id !== student.id);
                                localStorage.setItem('saved_students', JSON.stringify(filtered));
                                setSavedStudents(filtered);
                                toast.success("Student removed");
                              }}
                              className="px-3 py-2 rounded-lg bg-muted text-foreground/40 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
        </div>
      </main>
    </div>
  );
}
