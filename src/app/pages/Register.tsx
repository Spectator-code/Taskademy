import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Info, User, Mail, Lock, CheckCircle2, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "../hooks/useTranslation";

export default function Register() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
  const { register } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'student' | 'client'>('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
  const showStudentEmailError = role === "student" && email.length > 0 && !isStudentEduEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }
    if (role === "student" && !isStudentEduEmail) {
      toast.error("Student accounts must use a valid .edu.ph email address.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        role,
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden py-20">
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
              {t("createAccount") || "Create Account"}
            </motion.h1>
            <p className="text-foreground/60">{t("joinTaskademy") || "Join Taskademy and start earning"}</p>
          </div>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className={`block mb-2 text-sm font-medium transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-foreground/80'}`}>
                {t("fullName") || "Full Name"}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-foreground/40'}`}>
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                  required
                />
              </div>
            </motion.div>

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
                  placeholder={role === "student" ? "you@school.edu.ph" : "you@example.com"}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-input border ${
                    showStudentEmailError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  } focus:outline-none focus:ring-2 transition-all hover:border-primary/50`}
                  required
                />
              </div>
              <p className={`mt-2 text-xs ${showStudentEmailError ? "text-red-500" : "text-foreground/50"}`}>
                {role === "student"
                  ? "Student accounts must use a school email ending in .edu.ph."
                  : "Clients can register with any valid email address."}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className={`block mb-2 text-sm font-medium transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-foreground/80'}`}>
                {t("password") || "Password"}
              </label>
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
              <AnimatePresence>
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <div className="h-1.5 w-full bg-input rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        className={`h-full ${getStrengthColor()} transition-colors`}
                      />
                    </div>
                    <p className="text-[10px] uppercase font-bold mt-1 tracking-wider text-foreground/50">
                      Strength: <span className={passwordStrength <= 50 ? "text-yellow-500" : passwordStrength <= 75 ? "text-blue-500" : "text-primary"}>
                        {passwordStrength <= 50 ? "Weak" : passwordStrength <= 75 ? "Good" : "Strong"}
                      </span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className={`block mb-2 text-sm font-medium transition-colors ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-foreground/80'}`}>
                {t("confirmPassword") || "Confirm Password"}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-foreground/40'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-input border ${showMismatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : passwordsMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : 'border-border focus:border-primary focus:ring-primary/20'} focus:outline-none focus:ring-2 transition-all hover:border-primary/50`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {confirmPassword && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1.5"
                  >
                    {passwordsMatch ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-500">Passwords match</span></>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5 text-red-500" /><span className="text-xs text-red-500">Passwords do not match</span></>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-medium">I am a</label>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 text-primary cursor-help hover:scale-110 transition-transform" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-popover text-xs rounded-xl border border-border opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                    <span className="font-bold text-primary block mb-1">Student:</span> Browse and complete tasks.<br/>
                    <span className="font-bold text-primary block mt-2 mb-1">Client:</span> Post tasks and hire students.
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex-1 relative">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value as 'student' | 'client')}
                    className="sr-only"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${role === 'student' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground/60 hover:border-primary/50'}`}
                  >
                    Student
                  </motion.div>
                </label>
                <label className="flex-1 relative">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === 'client'}
                    onChange={(e) => setRole(e.target.value as 'student' | 'client')}
                    className="sr-only"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${role === 'client' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground/60 hover:border-primary/50'}`}
                  >
                    Client
                  </motion.div>
                </label>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 rounded-md border-2 border-border bg-input text-primary focus:ring-primary/20 transition-all group-hover:border-primary/50 cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                  />
                  <CheckCircle2 className={`absolute w-3.5 h-3.5 text-primary-foreground pointer-events-none transition-opacity ${agreeTerms ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className="text-sm text-foreground/70 leading-tight select-none">
                  I agree to the <Link to="/terms" className="text-primary hover:underline font-bold transition-all">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-bold transition-all">Privacy Policy</Link>
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-5 h-5 rounded-md border-2 border-border bg-input text-primary focus:ring-primary/20 transition-all group-hover:border-primary/50 cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                  />
                  <CheckCircle2 className={`absolute w-3.5 h-3.5 text-primary-foreground pointer-events-none transition-opacity ${newsletter ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className="text-sm text-foreground/70 leading-tight select-none">
                  Send me task updates and career tips (Optional)
                </span>
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 mt-2"
              >
                {loading ? "..." : t("register") || "Register"}
              </motion.button>
            </motion.div>
          </motion.form>

          <div className="mt-8 text-center">
            <p className="text-foreground/60">
              {t("alreadyHaveAccount") || "Already have an account?"}{" "}
              <Link to="/login" className="text-primary hover:underline font-bold transition-all">
                {t("login") || "Login"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
