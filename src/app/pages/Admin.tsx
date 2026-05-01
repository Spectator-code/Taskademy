import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Users, ListChecks, FolderOpen, Shield, 
  CheckCircle, XCircle, Search, ChevronLeft, ChevronRight,
  MoreVertical, ShieldAlert, BadgeCheck, Clock, Eye,
  ArrowUpRight, AlertCircle, Trash2, Info
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  announcementDurations,
  formatAnnouncementTimeRemaining,
  getStoredAnnouncements,
  pruneExpiredAnnouncements,
  saveAnnouncements,
} from "../utils/announcements";
import { Announcement } from "../types/api";

// Reusable Premium Confirmation Dialog
function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Delete", 
  confirmColor = "bg-red-500" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  description: string; 
  confirmText?: string; 
  confirmColor?: string; 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-card/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <AlertCircle className="w-32 h-32 text-red-500" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">{title}</h3>
              <p className="text-foreground/40 font-medium mb-8 leading-relaxed">
                {description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-foreground/40 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onConfirm(); onClose(); }}
                  className={`px-6 py-4 rounded-2xl ${confirmColor} text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/20`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Admin() {
  const { t } = useTranslation();
  
  const getDefaultCustomExpiry = () => {
    const date = new Date(Date.now() + 60 * 60 * 1000);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
  };

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

  // Pagination & Filtering State
  const [userPage, setUserPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const itemsPerPage = 10;
  const [userSearch, setUserSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");

  // Confirmation Dialog State
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsResponse, usersResponse, tasksResponse] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getTasks(),
      ]);
      setStats(statsResponse);
      setUsers(usersResponse.data);
      setTasks(tasksResponse.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

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

  // Derived Data
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, userPage]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase());
      const matchesStatus = taskStatusFilter === "all" || t.moderation_status === taskStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, taskSearch, taskStatusFilter]);

  const paginatedTasks = useMemo(() => {
    const start = (taskPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, taskPage]);

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
    { icon: Users, label: t("totalUsers") || "Total Users", value: stats?.users ?? 0, color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: ListChecks, label: t("totalTasks") || "Total Tasks", value: stats?.tasks ?? 0, color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: FolderOpen, label: t("openTasksAdmin") || "Open Tasks", value: stats?.open_tasks ?? 0, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Shield, label: t("pendingReview") || "Pending Review", value: stats?.pending_tasks ?? 0, color: "text-amber-500", bg: "bg-amber-500/10" },
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

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "info",
    durationSeconds: "86400",
    customExpiresAt: getDefaultCustomExpiry(),
  });

  useEffect(() => {
    const syncAnnouncements = () => {
      setAnnouncements(getStoredAnnouncements());
    };
    syncAnnouncements();
    const interval = window.setInterval(() => {
      setAnnouncements((current) => pruneExpiredAnnouncements(current));
    }, 1000);
    window.addEventListener('storage', syncAnnouncements);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', syncAnnouncements);
    };
  }, []);

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    const expiresAt =
      newAnnouncement.durationSeconds === "custom"
        ? new Date(newAnnouncement.customExpiresAt).toISOString()
        : new Date(Date.now() + Number(newAnnouncement.durationSeconds) * 1000).toISOString();

    if (new Date(expiresAt).getTime() <= Date.now()) {
      toast.error("Choose a future expiration time.");
      return;
    }

    const announcement: Announcement = {
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      type: newAnnouncement.type as Announcement["type"],
      id: Date.now(),
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
      is_active: true,
    };
    const updated = [announcement, ...announcements];
    setAnnouncements(saveAnnouncements(updated));
    setNewAnnouncement({
      title: "",
      content: "",
      type: "info",
      durationSeconds: "86400",
      customExpiresAt: getDefaultCustomExpiry(),
    });
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

  const handleDeleteAnnouncement = (id: number) => {
    const filtered = announcements.filter(a => a.id !== id);
    setAnnouncements(saveAnnouncements(filtered));
    toast.success("Announcement terminated.");
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                  {t("adminPanel")}
                </h1>
                <p className="text-foreground/40 font-medium">{t("adminPanelDesc") || "Live platform overview and management"}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live System Status
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-7 border border-white/5 group hover:border-primary/20 transition-all duration-500 shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 group-hover:text-primary/40 transition-colors">
                      Live
                    </div>
                  </div>
                  <div className="text-4xl font-black mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-foreground/40 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" 
                />
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Synchronizing Core...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Registration Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl shadow-black/20"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t("userRegistrations") || "User Analytics"}</h2>
                      <p className="text-sm text-foreground/40 font-medium">{t("trackSignups") || "Platform growth and registration velocity."}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex p-1.5 bg-black/20 rounded-2xl border border-white/5">
                        {(["daily", "weekly", "monthly"] as RegistrationPeriod[]).map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => setPeriod(period)}
                            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                              registrationPeriod === period
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-foreground/40 hover:text-foreground/60"
                            }`}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-[350px]">
                    {analyticsLoading ? (
                      <div className="h-full flex items-center justify-center text-foreground/20 italic font-medium">
                        Calculating trajectories...
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={registrationData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis
                            dataKey="label"
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fontSize: 10, fontWeight: 700 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                          />
                          <YAxis
                            allowDecimals={false}
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fontSize: 10, fontWeight: 700 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(10,10,10,0.9)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "20px",
                              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                            }}
                            itemStyle={{ color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", fontSize: "10px" }}
                            labelStyle={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "10px", marginBottom: "4px" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="registrations"
                            name="Registrations"
                            stroke="var(--primary)"
                            strokeWidth={4}
                            dot={{ r: 4, strokeWidth: 2, fill: "var(--card)" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </motion.div>

                {/* User Management Section */}
                <div className="grid lg:grid-cols-1 gap-10">
                  <motion.div
                    id="user-management"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl shadow-black/20 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                        <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
                          <Users className="w-6 h-6 text-primary" />
                          {t("recentUsers") || "Community Manager"}
                        </h2>
                        <p className="text-sm text-foreground/40 font-medium">Manage and monitor user accounts and status.</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                          <input 
                            type="text"
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                            className="pl-11 pr-4 py-3 rounded-2xl bg-black/20 border border-white/5 focus:border-primary/40 focus:outline-none transition-all text-sm font-medium w-full md:w-64"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto -mx-8 px-8">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-white/5">
                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 px-4">Identity</th>
                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 px-4">Role</th>
                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 px-4">Status</th>
                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 px-4">Joined</th>
                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          <AnimatePresence mode="popLayout">
                            {paginatedUsers.map((user) => (
                              <motion.tr 
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="group hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg ${
                                      user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 shadow-amber-500/10' : 'bg-primary/10 text-primary shadow-primary/10'
                                    }`}>
                                      {user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-bold text-sm flex items-center gap-2">
                                        {user.name}
                                        {user.role === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                                      </div>
                                      <div className="text-xs text-foreground/40 font-medium">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                    user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                    user.role === 'client' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                                    'bg-primary/10 text-primary border border-primary/20'
                                  }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  {user.is_banned ? (
                                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-[11px] uppercase tracking-wider">
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                      Suspended
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] uppercase tracking-wider">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                      Active
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-xs text-foreground/40 font-bold">
                                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link 
                                      to={`/profile/${user.id}`}
                                      className="p-2 rounded-xl bg-white/5 text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all"
                                      title="View Profile"
                                    >
                                      <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                    {user.role !== 'admin' && (
                                      user.is_banned ? (
                                        <button 
                                          onClick={() => handleUnbanUser(user.id)}
                                          className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                          title="Restore access"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </button>
                                      ) : (
                                        <button 
                                          onClick={() => handleBanUser(user.id)}
                                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                          title="Suspend user"
                                        >
                                          <ShieldAlert className="w-4 h-4" />
                                        </button>
                                      )
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
                      <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">
                        Showing {Math.min(filteredUsers.length, (userPage - 1) * itemsPerPage + 1)} - {Math.min(filteredUsers.length, userPage * itemsPerPage)} of {filteredUsers.length} Users
                      </p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setUserPage(p => Math.max(1, p - 1))}
                          disabled={userPage === 1}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-foreground/40 hover:text-primary disabled:opacity-20 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setUserPage(i + 1)}
                              className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${userPage === i + 1 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-white/5 text-foreground/40 hover:text-foreground'}`}
                            >
                              {i + 1}
                            </button>
                          )).slice(Math.max(0, userPage - 3), Math.min(Math.ceil(filteredUsers.length / itemsPerPage), userPage + 2))}
                        </div>
                        <button 
                          onClick={() => setUserPage(p => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), p + 1))}
                          disabled={userPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-foreground/40 hover:text-primary disabled:opacity-20 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Task Moderation Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl shadow-black/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                        <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
                          <BadgeCheck className="w-6 h-6 text-primary" />
                          {t("taskModeration") || "Moderation Queue"}
                        </h2>
                        <p className="text-sm text-foreground/40 font-medium">Review and approve incoming task requests.</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex p-1.5 bg-black/20 rounded-2xl border border-white/5">
                          {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                            <button
                              key={filter}
                              onClick={() => { setTaskStatusFilter(filter); setTaskPage(1); }}
                              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                taskStatusFilter === filter
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                  : "text-foreground/40 hover:text-foreground/60"
                              }`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                          <input 
                            type="text"
                            placeholder="Filter tasks..."
                            value={taskSearch}
                            onChange={(e) => { setTaskSearch(e.target.value); setTaskPage(1); }}
                            className="pl-11 pr-4 py-3 rounded-2xl bg-black/20 border border-white/5 focus:border-primary/40 focus:outline-none transition-all text-sm font-medium w-full md:w-64"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <AnimatePresence mode="popLayout">
                        {paginatedTasks.map((task) => (
                          <motion.div 
                            key={task.id} 
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all duration-500"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    {task.category}
                                  </span>
                                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                    task.moderation_status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    task.moderation_status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                                  }`}>
                                    {task.moderation_status}
                                  </span>
                                </div>
                                <Link to={`/task/${task.id}`} className="text-xl font-black mb-2 hover:text-primary transition-colors block leading-tight">
                                  {task.title}
                                </Link>
                                <div className="flex items-center gap-4 text-xs text-foreground/40 font-bold mt-2">
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    {task.client?.name ?? "Anonymous"}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(task.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                {task.moderation_status === "pending" ? (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleApprove(task.id)}
                                      disabled={moderatingTaskId === task.id}
                                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        const reason = window.prompt("Rejection Reason:", rejectionReasons[task.id] || "");
                                        if (reason) {
                                          setRejectionReasons(prev => ({ ...prev, [task.id]: reason }));
                                          handleReject(task.id);
                                        }
                                      }}
                                      disabled={moderatingTaskId === task.id}
                                      className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <Link 
                                    to={`/task/${task.id}`}
                                    className="px-5 py-2.5 rounded-xl bg-white/5 text-foreground/40 font-black text-[11px] uppercase tracking-widest hover:text-primary hover:bg-primary/10 transition-all flex items-center gap-2"
                                  >
                                    Review <Eye className="w-4 h-4" />
                                  </Link>
                                )}
                              </div>
                            </div>

                            {task.moderation_status === "rejected" && task.rejection_reason && (
                              <div className="mt-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Rejection Note</p>
                                  <p className="text-sm text-foreground/60 font-medium italic">"{task.rejection_reason}"</p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                        {filteredTasks.length === 0 && (
                          <div className="text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
                            <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
                              <BadgeCheck className="w-8 h-8 text-foreground/10" />
                            </div>
                            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Queue Clear. No tasks pending.</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Task Pagination */}
                    {filteredTasks.length > itemsPerPage && (
                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
                        <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">
                          Showing {Math.min(filteredTasks.length, (taskPage - 1) * itemsPerPage + 1)} - {Math.min(filteredTasks.length, taskPage * itemsPerPage)} of {filteredTasks.length} Tasks
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setTaskPage(p => Math.max(1, p - 1))}
                            disabled={taskPage === 1}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-foreground/40 hover:text-primary disabled:opacity-20 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(filteredTasks.length / itemsPerPage) }).map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setTaskPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${taskPage === i + 1 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-white/5 text-foreground/40 hover:text-foreground'}`}
                              >
                                {i + 1}
                              </button>
                            )).slice(Math.max(0, taskPage - 3), Math.min(Math.ceil(filteredTasks.length / itemsPerPage), taskPage + 2))}
                          </div>
                          <button 
                            onClick={() => setTaskPage(p => Math.min(Math.ceil(filteredTasks.length / itemsPerPage), p + 1))}
                            disabled={taskPage >= Math.ceil(filteredTasks.length / itemsPerPage)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-foreground/40 hover:text-primary disabled:opacity-20 transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
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
                  className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t("platformAnnouncements") || "Broadcast Hub"}</h2>
                      <p className="text-sm text-foreground/40 font-medium">Broadcast system-wide messages to all active users.</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                      <div className="p-6 bg-black/20 rounded-[2rem] border border-white/5 space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-3 block ml-2">Subject</label>
                          <input 
                            type="text" 
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                            placeholder="e.g., Scheduled Maintenance"
                            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 focus:border-primary/40 focus:outline-none transition-all text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-3 block ml-2">Broadcast Content</label>
                          <textarea 
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                            placeholder="Tell users what's happening..."
                            rows={4}
                            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 focus:border-primary/40 focus:outline-none transition-all text-sm font-medium resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-3 block ml-2">Priority Level</label>
                          <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                            {(['info', 'warning', 'urgent'] as const).map(type => (
                              <button
                                key={type}
                                onClick={() => setNewAnnouncement({...newAnnouncement, type})}
                                className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                  newAnnouncement.type === type 
                                    ? type === 'info' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : type === 'warning' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                    : 'text-foreground/20 hover:text-foreground/40'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-3 block ml-2">Expiration Protocol</label>
                          <Select
                            value={newAnnouncement.durationSeconds}
                            onValueChange={(value) => setNewAnnouncement({...newAnnouncement, durationSeconds: value})}
                          >
                            <SelectTrigger className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-sm font-medium">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 backdrop-blur-3xl border-white/10">
                              {announcementDurations.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-xs font-bold uppercase tracking-wider focus:bg-primary/20">
                                  {option.label}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom" className="text-xs font-bold uppercase tracking-wider focus:bg-primary/20">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          {newAnnouncement.durationSeconds === "custom" && (
                            <input
                              type="datetime-local"
                              value={newAnnouncement.customExpiresAt}
                              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                              onChange={(e) => setNewAnnouncement({...newAnnouncement, customExpiresAt: e.target.value})}
                              className="mt-3 w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 focus:border-primary/40 focus:outline-none transition-all text-sm font-medium"
                            />
                          )}
                        </div>
                        <button 
                          onClick={handlePostAnnouncement}
                          disabled={!newAnnouncement.title || !newAnnouncement.content}
                          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                          Push Broadcast
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-4 ml-2">Active Broadcasts</h3>
                        <AnimatePresence mode="popLayout">
                          {announcements.length === 0 ? (
                            <div className="p-16 rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                              <div className="p-4 bg-white/5 rounded-full mb-4">
                                <AlertCircle className="w-8 h-8 text-foreground/10" />
                              </div>
                              <p className="text-foreground/20 font-black uppercase tracking-widest text-[10px]">No active transmissions</p>
                            </div>
                          ) : (
                            announcements.map(ann => (
                              <motion.div 
                                key={ann.id} 
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={`p-6 rounded-[2rem] border relative group ${
                                  ann.type === 'info' ? 'bg-blue-500/5 border-blue-500/20' : ann.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-6">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                        ann.type === 'info' ? 'bg-blue-500 text-white' : ann.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                                      }`}>
                                        {ann.type}
                                      </span>
                                      <h4 className="font-black text-sm tracking-tight">{ann.title}</h4>
                                    </div>
                                    <p className="text-xs text-foreground/60 font-medium leading-relaxed">{ann.content}</p>
                                    <div className="flex items-center gap-2 mt-4 text-[10px] text-foreground/30 font-bold uppercase tracking-wider">
                                      <Clock className="w-3.5 h-3.5" />
                                      Removes in {formatAnnouncementTimeRemaining(ann.expires_at)}
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setDeleteId(ann.id)}
                                    className="p-2 rounded-xl bg-white/5 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <ConfirmDialog 
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDeleteAnnouncement(deleteId)}
        title="Terminate Broadcast?"
        description="This will immediately remove the announcement from all user dashboards. This action cannot be undone."
      />
    </div>
  );
}
