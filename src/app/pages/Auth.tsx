import { Link, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, CheckCircle2, XCircle, Info, Sparkles } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "../hooks/useTranslation";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo light.png" : "/logo dark.png";
  const { login, register } = useAuth();
  const { t } = useTranslation();

  // Determine initial mode based on path
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'login'
  );

  // Shared state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Register specific state
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'client'>('student');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Sync mode with URL
  useEffect(() => {
    if (location.pathname === '/register') setMode('register');
    if (location.pathname === '/login') setMode('login');
  }, [location.pathname]);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-primary";
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const showMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const normalizedEmail = email.trim().toLowerCase();
  const isStudentEduEmail = normalizedEmail.endsWith(".edu.ph");
  const showStudentEmailError = mode === 'register' && role === "student" && email.length > 0 && !isStudentEduEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords don't match!");
          setLoading(false);
          return;
        }
        if (role === "student" && !isStudentEduEmail) {
          toast.error("Student accounts must use a valid .edu.ph email address.");
          setLoading(false);
          return;
        }
        if (!agreeTerms) {
          toast.error("Please agree to the Terms and Conditions");
          setLoading(false);
          return;
        }
        await register({ name, email, password, password_confirmation: confirmPassword, role });
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (mode === 'login' ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden py-20">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.1, 0.15, 0.1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative w-full max-w-lg z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary mb-6 transition-all group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("backToHome") || "Back to home"}
        </Link>

        <div className="bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-4 flex flex-col items-center text-center">
            <Link to="/" className="mb-6 block group">
              <img src={logoSrc} alt="Taskademy" className="h-12 w-auto group-hover:scale-110 transition-transform duration-500" />
            </Link>
            
            {/* Toggle Switch */}
            <div className="relative flex p-1.5 bg-muted/20 backdrop-blur-md rounded-2xl w-full max-w-[320px] mb-8 border border-border/50">
              <motion.div
                className="absolute inset-y-1.5 left-1.5 bg-primary rounded-[0.85rem] shadow-lg shadow-primary/30"
                initial={false}
                animate={{ 
                  x: mode === 'login' ? 0 : '100%',
                  width: 'calc(50% - 6px)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => { setMode('login'); navigate('/login'); }}
                className={`relative flex-1 py-2.5 text-sm font-bold transition-colors z-10 ${mode === 'login' ? 'text-primary-foreground' : 'text-foreground/40 hover:text-foreground/60'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('register'); navigate('/register'); }}
                className={`relative flex-1 py-2.5 text-sm font-bold transition-colors z-10 ${mode === 'register' ? 'text-primary-foreground' : 'text-foreground/40 hover:text-foreground/60'}`}
              >
                Join Now
              </button>
            </div>

            <motion.h1 
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
            >
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
            <p className="text-foreground/40 text-sm font-medium">
              {mode === 'login' 
                ? 'Login to continue your tasking journey' 
                : 'Join the community of student earners'}
            </p>
          </div>

          <div className="p-8 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {mode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/30 ml-4">Full Name</label>
                      <div className="relative group">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-foreground/20'}`} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/20 border border-border focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-foreground/20"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/30 ml-4">Email Address</label>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-foreground/20'}`} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder={mode === 'register' && role === 'student' ? "you@school.edu.ph" : "you@example.com"}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/20 border ${showStudentEmailError ? 'border-red-500/50' : 'border-border'} focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-foreground/20`}
                        required
                      />
                    </div>
                    {showStudentEmailError && (
                      <p className="text-[10px] text-red-500 font-bold ml-4 mt-1">Must use a .edu.ph email for student accounts</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/30">Password</label>
                      {mode === 'login' && (
                        <Link to="#" className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/60 hover:text-primary transition-colors">Forgot?</Link>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-foreground/20'}`} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-muted/20 border border-border focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-foreground/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {mode === 'register' && password && (
                      <div className="px-4 pt-1">
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            className={`h-full ${getStrengthColor()} transition-all duration-500`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === 'register' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/30 ml-4">Confirm Password</label>
                        <div className="relative group">
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'confirm' ? 'text-primary' : 'text-foreground/20'}`} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocusedField('confirm')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-muted/20 border ${showMismatch ? 'border-red-500/50' : passwordsMatch ? 'border-emerald-500/50' : 'border-border'} focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-foreground/20`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-primary transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/30 ml-4">I am joining as a</label>
                        <div className="flex gap-3 px-1">
                          <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'student' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,255,136,0.1)]' : 'border-border/50 bg-muted/30 text-foreground/30 hover:border-border'}`}
                          >
                            Student
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('client')}
                            className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'client' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,255,136,0.1)]' : 'border-border/50 bg-muted/30 text-foreground/30 hover:border-border'}`}
                          >
                            Client
                          </button>
                        </div>
                      </div>

                      <div className="px-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="w-5 h-5 rounded-md border-2 border-border bg-muted text-primary focus:ring-primary/20 transition-all appearance-none checked:bg-primary checked:border-primary cursor-pointer mt-0.5"
                          />
                          <span className="text-xs text-foreground/40 leading-relaxed group-hover:text-foreground/60 transition-colors">
                            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> & <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                          </span>
                        </label>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99, y: 0 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-[0_20px_40px_-12px_rgba(0,255,136,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,255,136,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                >
                  {loading ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Login to Dashboard' : 'Create My Account'}</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:text-primary-foreground transition-colors" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-foreground/30 text-xs font-medium">
                {mode === 'login' ? "New to Taskademy?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary hover:text-primary-foreground hover:bg-primary/20 px-2 py-1 rounded-lg transition-all font-black uppercase tracking-wider text-[10px]"
                >
                  {mode === 'login' ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
