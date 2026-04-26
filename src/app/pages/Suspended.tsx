import { motion } from "motion/react";
import { ShieldAlert, LogOut, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Suspended() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Account Suspended</h1>
        <p className="text-foreground/60 mb-8 leading-relaxed">
          Your account has been suspended for violating our platform's terms of service or community guidelines.
        </p>

        {user?.ban_reason && (
          <div className="mb-8 p-4 bg-muted rounded-2xl border border-border text-left">
            <p className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-2">Reason for suspension:</p>
            <p className="text-foreground/80">{user.ban_reason}</p>
          </div>
        )}

        <div className="space-y-4">
          <a
            href="mailto:support@taskademy.com"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-all"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
