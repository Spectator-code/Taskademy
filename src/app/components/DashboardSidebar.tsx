import { Link, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Search,
  ListChecks,
  MessageSquare,
  User,
  Settings,
  Star,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  FileEdit
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { useTranslation } from "../hooks/useTranslation";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const { isSidebarCollapsed, toggleSidebar, theme } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logoSrc = theme === "modern" ? "/logo light.png" : "/logo dark.png";
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: t("dashboard"),
    },
    {
      to: "/browse",
      icon: Search,
      label: t("browseTasks"),
    },
    {
      to: "/my-tasks",
      icon: ListChecks,
      label: t("myTasks"),
    },
    {
      to: "/messages",
      icon: MessageSquare,
      label: t("messages"),
    },
    {
      to: user?.id ? `/profile/${user.id}` : "/profile/0",
      icon: User,
      label: t("profile"),
    },
    {
      to: "/settings",
      icon: Settings,
      label: t("settings"),
    },
    ...(user
      ? [
          {
            to: "/saved-students",
            icon: Heart,
            label: "Saved Students",
          },
        ]
      : []),
    ...(user?.role === "client" || user?.role === "admin"
      ? [
          {
            to: "/draft-tasks",
            icon: FileEdit,
            label: "Draft Tasks",
          },
        ]
      : []),
    ...(user?.role === "admin"
      ? [
          {
            to: "/admin",
            icon: Star,
            label: t("adminPanel") || "Admin Panel",
            isAdmin: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <aside
        className={`border-r border-border flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0 bg-background z-20 ${
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
            <motion.img 
              src={logoSrc} 
              alt="Taskademy Logo" 
              className="h-20 w-auto object-contain flex-shrink-0" 
              initial={{ scale: 0.8, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
          </Link>
        )}
        {isSidebarCollapsed && (
          <Link to="/dashboard" className="flex justify-center">
            <motion.img 
              src={logoSrc} 
              alt="Taskademy Logo" 
              className="h-11 w-auto object-contain" 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
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

      {user && (user.role === "client" || user.role === "admin") && (
        <div className={`${isSidebarCollapsed ? "p-3" : "p-4"} border-b border-border`}>
          <Link
            to="/post-task"
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${
              isSidebarCollapsed ? "h-11 px-0" : "px-4 py-3"
            }`}
            title={t("postTask")}
            aria-label={t("postTask")}
          >
            <span className="text-lg leading-none">+</span>
            {!isSidebarCollapsed && <span>{t("postTask")}</span>}
          </Link>
        </div>
      )}

      <nav className={`${isSidebarCollapsed ? "p-3" : "p-4"} sidebar-scroll flex-1 space-y-2 overflow-y-auto`}>
        {navItems.map((item) => {
          const isActive = 
            (location.pathname + location.hash === item.to) || 
            (location.pathname === item.to && !item.to.includes('#') && !location.hash);
          
          return (
            <Link
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={`flex items-center rounded-xl transition-all ${
                isSidebarCollapsed
                  ? "h-12 justify-center px-0"
                  : "gap-3 px-4 py-3"
              } ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : (item as any).isAdmin
                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20"
                  : "text-foreground/60 hover:bg-card hover:text-foreground"
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border bg-card/10 backdrop-blur-sm">
        <div className={`${isSidebarCollapsed ? "p-3" : "p-4"} space-y-4`}>
          <div
            className={`flex items-center group cursor-pointer ${
              isSidebarCollapsed ? "justify-center" : "gap-3 px-3 py-2 rounded-2xl hover:bg-card/50 transition-all"
            }`}
            onClick={() => navigate(user?.id ? `/profile/${user.id}` : "/profile/0")}
            title={isSidebarCollapsed ? `${user?.name} - ${user?.role}` : ""}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20 overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name ?? "User"} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            </div>
            
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                  {user?.name ?? "User"}
                </div>
                <div className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md w-fit mt-1 ${
                  user?.role === 'admin' 
                    ? 'bg-amber-500/20 text-amber-500' 
                    : user?.role === 'client'
                    ? 'bg-blue-500/20 text-blue-500'
                    : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {user?.role ? t(user.role as any) || user.role.charAt(0).toUpperCase() + user.role.slice(1) : t("student" as any) || "Student"}
                </div>
              </div>
            )}
          </div>
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? "flex-col gap-3" : "justify-end gap-2 px-2"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className={`group flex items-center justify-center rounded-xl text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all overflow-hidden ${
                isSidebarCollapsed ? "w-10 h-10" : "w-10 h-10"
              }`}
              aria-label={t("logout") || "Logout"}
              title={t("logout") || "Logout"}
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4 text-red-500">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Log Out</h3>
              </div>
              <p className="text-foreground/70 mb-6">
                Are you sure you want to log out of your account? You will need to sign back in to access your dashboard.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
