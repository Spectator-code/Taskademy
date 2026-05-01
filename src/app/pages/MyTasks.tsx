import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ListChecks,
  Clock,
  CheckCircle,
  Star,
  Search,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { taskService } from "../services/task.service";
import { Task, TaskApplication } from "../types/api";
import { toast } from "sonner";
import DashboardSidebar from "../components/DashboardSidebar";
import { useTranslation } from "../hooks/useTranslation";
import { formatPeso } from "../utils/currency";
import confetti from "canvas-confetti";

export default function MyTasks() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [taskApplications, setTaskApplications] = useState<Record<number, TaskApplication[]>>({});
  const [loadingApplicantsTaskId, setLoadingApplicantsTaskId] = useState<number | null>(null);
  const [acceptingApplicantId, setAcceptingApplicantId] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    Promise.all([
      taskService.getMyTasks("posted"),
      taskService.getMyTasks("assigned"),
    ])
      .then(([postedResponse, assignedResponse]) => {
        if (!ignore) {
          setPostedTasks(postedResponse);
          setAssignedTasks(assignedResponse);
        }
      })
      .catch((error: any) => {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load tasks.");
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

  const handleCompleteTask = async (taskId: number) => {
    const paymentReference = window.prompt(
      "Enter the GCash reference number if payment already arrived. Leave it blank to release earnings automatically after the task deadline.",
      "",
    );

    if (paymentReference === null) {
      return;
    }

    setCompletingTaskId(taskId);
    try {
      const updatedTask = await taskService.completeTask(taskId, paymentReference);
      setPostedTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      setAssignedTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success(
        paymentReference.trim()
          ? "Task completed and earnings released."
          : "Task completed. Earnings will auto-release after the deadline if no payment reference is added.",
      );
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

  const canManageApplicants = user?.role === "client" || user?.role === "admin";

  const handleToggleApplicants = async (taskId: number) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      return;
    }

    setExpandedTaskId(taskId);

    if (taskApplications[taskId]) {
      return;
    }

    setLoadingApplicantsTaskId(taskId);
    try {
      const applications = await taskService.getTaskApplications(taskId);
      setTaskApplications((current) => ({
        ...current,
        [taskId]: applications,
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load applicants.");
    } finally {
      setLoadingApplicantsTaskId((current) => (current === taskId ? null : current));
    }
  };

  const handleAcceptApplicant = async (taskId: number, studentId: number) => {
    setAcceptingApplicantId(studentId);
    try {
      const updatedTask = await taskService.acceptApplication(taskId, studentId);
      setPostedTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      setAssignedTasks((current) =>
        current.map((task) => (task.id === taskId ? updatedTask : task))
      );
      setTaskApplications((current) => ({
        ...current,
        [taskId]: (current[taskId] ?? []).map((application) => ({
          ...application,
          status: application.applicant_id === studentId ? "accepted" : "rejected",
        })),
      }));
      toast.success("Applicant accepted.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept applicant.");
    } finally {
      setAcceptingApplicantId(null);
    }
  };

  const tasksToDisplay = useMemo(() => {
    const baseTasks = user?.role === 'student' ? assignedTasks : postedTasks;
    let filtered = baseTasks;
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.status === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [user, postedTasks, assignedTasks, filter, searchQuery]);

  const stats = useMemo(() => {
    const baseTasks = user?.role === 'student' ? assignedTasks : postedTasks;
    return {
      active: baseTasks.filter(t => t.status === 'in_progress' || t.status === 'open').length,
      completed: baseTasks.filter(t => t.status === 'completed').length,
      total: baseTasks.length
    };
  }, [user, postedTasks, assignedTasks]);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <ListChecks className="w-10 h-10 text-primary" />
                  {t("myTasks")}
                </h1>
                <p className="text-foreground/60">
                  Manage and track the progress of your {user?.role === 'student' ? 'assigned' : 'posted'} tasks.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-foreground/60 font-medium uppercase text-xs tracking-widest">Active</span>
                </div>
                <div className="text-3xl font-bold">{stats.active}</div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-foreground/60 font-medium uppercase text-xs tracking-widest">Completed</span>
                </div>
                <div className="text-3xl font-bold">{stats.completed}</div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="text-foreground/60 font-medium uppercase text-xs tracking-widest">Total Tasks</span>
                </div>
                <div className="text-3xl font-bold">{stats.total}</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                {['all', 'open', 'in_progress', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      filter === f 
                        ? 'bg-card text-primary shadow-sm' 
                        : 'text-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="text" 
                  placeholder={t("searchTasks") || "Search tasks..."} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-card animate-pulse rounded-2xl border border-border" />
                ))}
              </div>
            ) : tasksToDisplay.length === 0 ? (
              <div className="bg-card rounded-[2.5rem] p-16 border-2 border-dashed border-border text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ListChecks className="w-10 h-10 text-foreground/20" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No tasks found</h3>
                <p className="text-foreground/60 mb-8">
                  {filter === 'all' 
                    ? "You haven't started any tasks yet." 
                    : `No tasks found with status "${filter.replace('_', ' ')}".`}
                </p>
                {user?.role === 'student' ? (
                  <Link to="/browse" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all inline-block">
                    Browse Available Tasks
                  </Link>
                ) : (
                  <Link to="/post-task" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all inline-block">
                    Post a New Task
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {tasksToDisplay.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all shadow-sm group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                            task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-foreground/40 font-medium">
                            Budget: {formatPeso(task.budget)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                        <div className="flex items-center gap-6 text-sm text-foreground/60 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                          {task.is_group_task && (
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-foreground/20" />
                              Team: <span className="font-bold">{task.assigned_students_count ?? task.assignees?.length ?? 0}/{task.required_students_count ?? 1}</span>
                            </div>
                          )}
                          {user?.role === 'student' ? (
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-foreground/20" />
                              Client: <span className="font-bold">{task.client?.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-foreground/20" />
                              {task.is_group_task ? (
                                <>Assigned team: <span className="font-bold">{task.assigned_students_count ?? task.assignees?.length ?? 0} hired</span></>
                              ) : (
                                <>Assigned to: <span className="font-bold">{task.student?.name || 'Unassigned'}</span></>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {canManageApplicants && (
                          <button
                            type="button"
                            onClick={() => handleToggleApplicants(task.id)}
                            className="px-6 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-bold transition-all inline-flex items-center gap-2"
                          >
                            Applicants
                            {expandedTaskId === task.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <Link
                          to={`/task/${task.id}`}
                          className="px-6 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold transition-all"
                        >
                          Details
                        </Link>
                        {user?.role === 'student' && task.status === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={completingTaskId === task.id}
                            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                          >
                            {completingTaskId === task.id ? "..." : "Complete"}
                          </button>
                        )}
                      </div>
                    </div>

                    {canManageApplicants && expandedTaskId === task.id && (
                      <div className="mt-6 border-t border-border pt-6">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <h4 className="text-lg font-bold">{t("applicants") || "Applicants"}</h4>
                          <span className="text-sm text-foreground/50">
                            {task.is_group_task
                              ? `${task.assigned_students_count ?? task.assignees?.length ?? 0}/${task.required_students_count ?? 1} hired`
                              : `${(taskApplications[task.id] ?? []).length} total`}
                          </span>
                        </div>

                        {loadingApplicantsTaskId === task.id ? (
                          <div className="text-sm text-foreground/60">Loading applicants...</div>
                        ) : (taskApplications[task.id] ?? []).length === 0 ? (
                          <div className="rounded-xl border border-border bg-background/40 p-4 text-sm text-foreground/60">
                            {t("noApplicantsYet") || "No one has applied yet."}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(taskApplications[task.id] ?? []).map((application) => (
                              <div
                                key={application.id}
                                className="flex flex-col gap-4 rounded-xl border border-border bg-background/40 p-4 md:flex-row md:items-center md:justify-between"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {application.applicant?.avatar_url ? (
                                    <img
                                      src={application.applicant.avatar_url}
                                      alt={application.applicant.name ?? "Applicant"}
                                      className="h-11 w-11 rounded-full object-cover border border-border"
                                    />
                                  ) : (
                                    <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center">
                                      <User className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <Link
                                      to={`/profile/${application.applicant_id}`}
                                      className="block truncate font-bold hover:text-primary transition-colors"
                                    >
                                      {application.applicant?.name ?? "Applicant"}
                                    </Link>
                                    <p className="text-sm text-foreground/60 truncate">
                                      {application.applicant?.email ?? "No email available"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                  <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                      application.status === "accepted"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : application.status === "rejected"
                                        ? "bg-red-500/10 text-red-500"
                                        : "bg-amber-500/10 text-amber-500"
                                    }`}
                                  >
                                    {application.status}
                                  </span>
                                  <Link
                                    to={`/profile/${application.applicant_id}`}
                                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold transition-all text-sm"
                                  >
                                    View Profile
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptApplicant(task.id, application.applicant_id)}
                                    disabled={
                                      application.status === "accepted"
                                      || acceptingApplicantId === application.applicant_id
                                      || task.status !== "open"
                                      || (
                                        Boolean(task.is_group_task)
                                        && (task.open_group_slots ?? 0) <= 0
                                      )
                                    }
                                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm inline-flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {application.status === "accepted"
                                      ? t("accepted") || "Accepted"
                                      : acceptingApplicantId === application.applicant_id
                                      ? t("accepting") || "Accepting..."
                                      : task.is_group_task
                                      ? "Hire Student"
                                      : t("accept") || "Accept"}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
