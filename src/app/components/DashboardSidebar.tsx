import { Link, useNavigate, useLocation } from "react-router";
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
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
  const location = useLocation();

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
          },
        ]
      : []),
  ];

  return (
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
            <img src={logoSrc} alt="Taskademy" className="h-20 w-50 object-contain flex-shrink-0" />
            
          </Link>
        )}
        {isSidebarCollapsed && (
          <Link to="/dashboard" className="flex justify-center">
            <img src={logoSrc} alt="Taskademy" className="h-11 w-auto object-contain" />
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
              onClick={handleLogout}
              className={`flex items-center justify-center rounded-xl text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all ${
                isSidebarCollapsed ? "w-10 h-10" : "w-10 h-10"
              }`}
              aria-label={t("logout") || "Logout"}
              title={t("logout") || "Logout"}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
