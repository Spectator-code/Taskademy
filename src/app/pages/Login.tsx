import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Github, Chrome, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "../hooks/useTranslation";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("backToBrowse") || "Back to home"}
        </Link>

        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link to="/">
              <img src={logoSrc} alt="Taskademy" className="h-16 w-auto mb-6 hover:scale-105 transition-transform" />
            </Link>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {t("welcome") || "Welcome Back"}
            </motion.h1>
            <p className="text-foreground/60">{t("loginToYourAccount") || "Login to continue to Taskademy"}</p>
          </div>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className={`block mb-2 text-sm font-medium transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-foreground/80'}`}>
                {t("email") || "Email"}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-foreground/40'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className={`text-sm font-medium transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-foreground/80'}`}>
                  {t("password") || "Password"}
                </label>
                <Link to="#" className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-foreground/40'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-foreground/60 cursor-pointer select-none hover:text-foreground transition-colors">
                Remember me
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
              >
                {loading ? "..." : t("login") || "Login"}
              </motion.button>
            </motion.div>
          </motion.form>



          <div className="mt-8 text-center">
            <p className="text-foreground/60">
              {t("dontHaveAccount") || "Don't have an account?"}{" "}
              <Link to="/register" className="text-primary hover:underline font-bold transition-all">
                {t("createAccount") || "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
