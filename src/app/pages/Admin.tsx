import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Users, ListChecks, FolderOpen, Shield, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminService } from "../services/admin.service";
import { AdminStats, RegistrationPeriod, RegistrationPoint, Task, User } from "../types/api";
import { toast } from "sonner";
import TestimonialManager from "../components/admin/TestimonialManager";
import AdvertisementManager from "../components/admin/AdvertisementManager";
import AnnouncementManager from "../components/admin/AnnouncementManager";

import DashboardSidebar from "../components/DashboardSidebar";
import { useTranslation } from "../hooks/useTranslation";

export default function Admin() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [registrationData, setRegistrationData] = useState<RegistrationPoint[]>([]);
  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod>("daily");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 29);
    return date.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<Record<number, string>>({});
  const [moderatingTaskId, setModeratingTaskId] = useState<number | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    Promise.all([
      adminService.getStats(),
      adminService.getUsers(),
      adminService.getTasks(),
    ])
      .then(([statsResponse, usersResponse, tasksResponse]) => {
        setStats(statsResponse);
        setUsers(usersResponse.data.slice(0, 5));
        setTasks(tasksResponse.data);
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || "Failed to load admin data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAdminData();
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
    setAnalyticsLoading(true);

    adminService
      .getRegistrations({
        period: registrationPeriod,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        if (!ignore) {
          setRegistrationData(response.data);
        }
      })
      .catch((error: any) => {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load registration analytics.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setAnalyticsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [registrationPeriod, startDate, endDate]);

  const setPeriod = (period: RegistrationPeriod) => {
    const end = new Date();
    const start = new Date();

    if (period === "daily") {
      start.setDate(end.getDate() - 29);
    } else if (period === "weekly") {
      start.setDate(end.getDate() - 7 * 11);
    } else if (period === "monthly") {
      start.setMonth(end.getMonth() - 11);
    } else {
      start.setFullYear(end.getFullYear() - 4);
    }

    setRegistrationPeriod(period);
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
  };

  const statCards = [
    {
      icon: Users,
      label: t("totalUsers") || "Total Users",
      value: stats?.users ?? 0,
    },
    {
      icon: ListChecks,
      label: t("totalTasks") || "Total Tasks",
      value: stats?.tasks ?? 0,
    },
    {
      icon: FolderOpen,
      label: t("openTasksAdmin") || "Open Tasks",
      value: stats?.open_tasks ?? 0,
    },
    {
      icon: Shield,
      label: t("pendingReview") || "Pending Review",
      value: stats?.pending_tasks ?? 0,
    },
  ];

  const handleApprove = async (taskId: number) => {
    setModeratingTaskId(taskId);
    try {
      await adminService.approveTask(taskId);
      toast.success("Task approved.");
      await loadAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve task.");
    } finally {
      setModeratingTaskId(null);
    }
  };

  const handleReject = async (taskId: number) => {
    const reason = rejectionReasons[taskId]?.trim();
    if (!reason) {
      toast.error("Add a rejection reason first.");
      return;
    }

    setModeratingTaskId(taskId);
    try {
      await adminService.rejectTask(taskId, reason);
      toast.success("Task rejected and poster notified.");
      setRejectionReasons((current) => ({ ...current, [taskId]: "" }));
      await loadAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject task.");
    } finally {
      setModeratingTaskId(null);
    }
  };

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", type: "info" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('announcements') || '[]');
    setAnnouncements(saved);
  }, []);

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    const announcement = {
      ...newAnnouncement,
      id: Date.now(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
    setNewAnnouncement({ title: "", content: "", type: "info" });
    toast.success("Announcement broadcasted!");
  };

  const handleBanUser = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_banned: true } : u));
    toast.success("User has been suspended.");
  };

  const handleUnbanUser = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_banned: false } : u));
    toast.success("User access restored.");
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
          >
            <h1 className="text-4xl font-bold mb-2">{t("adminPanel")}</h1>
            <p className="text-foreground/60 mb-8">{t("adminPanelDesc") || "Live platform overview and management"}</p>

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
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold mb-1">{t("userRegistrations") || "User Registrations"}</h2>
                      <p className="text-sm text-foreground/60">{t("trackSignups") || "Track signups by selected date range."}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex rounded-xl border border-border overflow-hidden">
                        {(["daily", "weekly", "monthly", "yearly"] as RegistrationPeriod[]).map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => setPeriod(period)}
                            className={`px-4 py-2 text-sm capitalize transition-colors ${
                              registrationPeriod === period
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground/70 hover:bg-background"
                            }`}
                          >
                            {period}
                          </button>
                        ))}
                      </div>

                      <input
                        type="date"
                        value={startDate}
                        max={endDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="h-80">
                    {analyticsLoading ? (
                      <div className="h-full flex items-center justify-center text-foreground/60">
                        Loading analytics...
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={registrationData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis
                            dataKey="label"
                            stroke="var(--muted-foreground)"
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                          />
                          <YAxis
                            allowDecimals={false}
                            stroke="var(--muted-foreground)"
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                              color: "var(--foreground)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="registrations"
                            name="Registrations"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  id="user-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-card rounded-2xl p-6 border border-border scroll-mt-24"
                >
                  <h2 className="text-xl font-bold mb-6">{t("recentUsers") || "Recent Users"}</h2>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            user.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {user.name}
                              {user.is_banned && <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full border border-red-500/20 uppercase font-bold tracking-wider">Suspended</span>}
                            </div>
                            <div className="text-sm text-foreground/60">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <div className="text-sm capitalize text-primary font-bold">{user.role}</div>
                            <div className="text-xs text-foreground/60">
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {user.role !== 'admin' && (
                              user.is_banned ? (
                                <button 
                                  onClick={() => handleUnbanUser(user.id)}
                                  className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                                  title="Restore access"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleBanUser(user.id)}
                                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                  title="Suspend user"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )
                            )}
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
                  <h2 className="text-xl font-bold mb-6">{t("taskModeration") || "Task Moderation"}</h2>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-4 rounded-xl bg-background/50 border border-border space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          <div>
                            <Link to={`/task/${task.id}`} className="font-medium mb-1 hover:text-primary transition-colors block">
                              {task.title}
                            </Link>
                            <div className="text-sm text-foreground/60">
                              Posted by {task.client?.name ?? "User"} · {new Date(task.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary capitalize">
                              {task.status.replace("_", " ")}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm capitalize ${
                                task.moderation_status === "approved"
                                  ? "bg-green-500/10 text-green-400"
                                  : task.moderation_status === "rejected"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-yellow-500/10 text-yellow-300"
                              }`}
                            >
                              {task.moderation_status}
                            </span>
                          </div>
                        </div>

                        {task.moderation_status === "rejected" && task.rejection_reason && (
                          <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                            {task.rejection_reason}
                          </p>
                        )}

                        {task.moderation_status === "pending" && (
                          <div className="space-y-3">
                            <textarea
                              value={rejectionReasons[task.id] ?? ""}
                              onChange={(e) =>
                                setRejectionReasons((current) => ({ ...current, [task.id]: e.target.value }))
                              }
                              placeholder="Reason required only when rejecting..."
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                            />
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleApprove(task.id)}
                                disabled={moderatingTaskId === task.id}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(task.id)}
                                disabled={moderatingTaskId === task.id}
                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-foreground/60">No tasks to review.</div>
                    )}
                  </div>
                </motion.div>
                </div>
                <TestimonialManager />
                <AdvertisementManager />

                {/* Platform Announcements Section */}
                <motion.div
                  id="announcements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-card rounded-2xl p-6 border border-border scroll-mt-24"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-bold mb-1">{t("platformAnnouncements") || "Platform Announcements"}</h2>
                      <p className="text-sm text-foreground/60">{t("broadcastGlobally") || "Broadcast messages to all users globally."}</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                      <div className="p-4 bg-background/50 rounded-xl border border-border space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Announcement Title</label>
                          <input 
                            type="text" 
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                            placeholder="e.g., Scheduled Maintenance"
                            className="w-full px-4 py-2.5 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Content</label>
                          <textarea 
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                            placeholder="Tell users what's happening..."
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Priority Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['info', 'warning', 'urgent'] as const).map(type => (
                              <button
                                key={type}
                                onClick={() => setNewAnnouncement({...newAnnouncement, type})}
                                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                                  newAnnouncement.type === type 
                                    ? type === 'info' ? 'bg-blue-500 border-blue-500 text-white' : type === 'warning' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-red-500 border-red-500 text-white'
                                    : 'border-border text-foreground/40 hover:border-foreground/20'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={handlePostAnnouncement}
                          disabled={!newAnnouncement.title || !newAnnouncement.content}
                          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          Broadcast Message
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="space-y-3">
                        {announcements.length === 0 ? (
                          <div className="p-12 border border-dashed border-border rounded-xl text-center text-foreground/40 italic">
                            No active announcements.
                          </div>
                        ) : (
                          announcements.map(ann => (
                            <div key={ann.id} className={`p-4 rounded-xl border flex items-center justify-between ${
                              ann.type === 'info' ? 'bg-blue-500/5 border-blue-500/20' : ann.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'
                            }`}>
                              <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                  ann.type === 'info' ? 'bg-blue-500' : ann.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                <div>
                                  <h4 className="font-bold text-sm">{ann.title}</h4>
                                  <p className="text-xs text-foreground/60">{ann.content}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const filtered = announcements.filter(a => a.id !== ann.id);
                                  setAnnouncements(filtered);
                                  localStorage.setItem('announcements', JSON.stringify(filtered));
                                  toast.success("Announcement removed.");
                                }}
                                className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
