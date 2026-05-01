import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Brain, Briefcase, Star, ArrowRight, User, Search, Twitter, Github, Instagram, Linkedin, Mail, Send, Globe, Shield, HelpCircle, Phone, Sparkles, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import ThemeSwitcher from "../components/ui/ThemeSwitcher";
import "../../styles/SparkleButton.css";
import Testimonials from "../components/Testimonials";
import AdvertisementCarousel from "../components/AdvertisementCarousel";
import TypewriterText from "../components/ui/TypewriterText";
import { useTranslation } from "../hooks/useTranslation";
import { useEffect, useState } from "react";
import apiClient from "../config/api";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { theme } = useApp();
  const homeTarget = isAuthenticated ? "/dashboard" : "/";
  const logoSrc = theme === "modern" ? "/logo light.png" : "/logo dark.png";
  const location = useLocation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeStudents: 0,
    completedTasks: 0,
    averageRating: 4.9
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/platform-stats');
        setStats({
          activeStudents: response.data.active_students || 0,
          completedTasks: response.data.completed_tasks || 0,
          averageRating: response.data.average_rating || 4.9
        });
      } catch (error) {
        console.error("Failed to fetch platform stats", error);
      }
    };
    fetchStats();
  }, []);

  const formatStat = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k+';
    return num.toString();
  };

  const handleHomeClick = (e: any) => {
    if (isAuthenticated) {
      e.preventDefault();
      navigate("/dashboard");
      return;
    }

    if (location.pathname === "/") {
      e.preventDefault();
      if (location.hash) {
        window.history.replaceState(null, "", "/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* 
          🌟 HIGH-FIDELITY FLOATING NAVBAR
          A premium, center-aligned glassmorphic pill that transitions on scroll.
          Contains: Logo, Primary Navigation, Theme Switcher, and Auth CTAs.
      */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-6 px-4">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`
            flex items-center justify-between px-6 py-2 w-full max-w-5xl rounded-full border border-border/10 backdrop-blur-2xl transition-all duration-500 pointer-events-auto
            ${scrolled 
              ? 'bg-background/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-3 px-8 border-border/20' 
              : 'bg-transparent border-transparent px-2'}
          `}
        >
          <div className="flex items-center gap-10">
            <Link to={homeTarget} onClick={handleHomeClick} className="relative group">
              <motion.img 
                src={logoSrc} 
                alt="Taskademy" 
                className={`transition-all duration-500 ${scrolled ? 'h-10' : 'h-20'}`} 
              />
              <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
              {['home', 'browseTasks', 'howItWorks'].map((key) => (
                <Link 
                  key={key}
                  to={key === 'howItWorks' ? "/#how-it-works" : key === 'home' ? homeTarget : `/${key}`}
                  onClick={key === 'howItWorks' ? (e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                    }
                  } : key === 'home' ? handleHomeClick : undefined}
                  className="relative text-foreground/50 hover:text-primary transition-colors group overflow-hidden"
                >
                  {t(key) || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              <ThemeSwitcher />
              <div className="w-px h-4 bg-border/20" />
            </div>
            
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group relative px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold overflow-hidden shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs tracking-widest uppercase"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:block px-5 py-2.5 text-foreground/50 hover:text-foreground transition-all font-bold text-xs tracking-widest uppercase"
                >
                  {t("login") || "Login"}
                </Link>
                <Link
                  to="/register"
                  className="group relative px-7 py-3 rounded-full bg-primary text-primary-foreground font-black overflow-hidden shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-xs tracking-widest uppercase"
                >
                  <span className="relative z-10">{t("register") || "Register"}</span>
                  <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </div>
        </motion.nav>
      </div>

      {/* 🚀 HERO SECTION: Learn. Work. Earn. */}
      <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
        {/* Animated Background Mesh - aesthetic utilities found in theme.css */}
        <div className="absolute inset-0 aesthetic-aura opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,255,136,0.1),transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
              <Sparkles className="w-4 h-4" /> The future of student earning is here
            </div>
            {/* Title uses .aesthetic-text-mask (theme.css) for the animated shine */}
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter aesthetic-text-mask">
              {t("learnWorkEarn") || "Learn. Work. Earn."}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/60 mb-12 leading-relaxed max-w-xl font-medium">
              Join thousands of students building their careers through high-impact freelance tasks.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              {/* Primary CTA: Sparkle Button component */}
              <Link
                to="/register"
                className="sparkle-button !px-10 !py-5"
              >
                <div className="dots_border"></div>
                <span className="text_button text-lg uppercase tracking-widest">{t("getStarted") || "Get Started"}</span>
              </Link>
              <Link to="/browse" className="group flex items-center gap-3 text-lg font-bold text-foreground/80 hover:text-primary transition-colors">
                Browse open tasks <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Redesigned Stats: Data fetched from /api/platform-stats */}
            <div className="mt-20 flex gap-12 items-center">
              {[
                { label: "Active Students", value: stats.activeStudents > 0 ? formatStat(stats.activeStudents) : "12k+" },
                { label: "Tasks Done", value: stats.completedTasks > 0 ? formatStat(stats.completedTasks) : "45k+" },
                { label: "Rating", value: "4.9/5", highlight: true }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className={`text-4xl font-black ${stat.highlight ? 'text-primary' : 'text-foreground'}`}>{stat.value}</span>
                  <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Embedded Testimonials: Found in src/app/components/Testimonials.tsx */}
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <Testimonials isHero={true} />
          </motion.div>
        </div>
      </section>

      <AdvertisementCarousel />

      {/* Feature Section */}
      <section className="relative py-40 bg-secondary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
              Built for <span className="text-primary italic">Professionals</span>.
            </h2>
            <p className="text-xl text-foreground/50 font-medium leading-relaxed">
              We've stripped away the noise. Only high-impact tasks, verified students, and secure payments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Brain, title: "Skill Forge", desc: "Forge your career with real-world project experience." },
              { icon: Briefcase, title: "Elite Tasks", desc: "Access high-tier projects from top global clients." },
              { icon: Star, title: "Growth Engine", desc: "Build a verified portfolio that speaks for itself." }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="aesthetic-card bg-card/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-border group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl shadow-primary/20">
                  <f.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-foreground/50 leading-relaxed text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UNDO DESIGN: Restored 3-Column How It Works Section */}
      <section id="how-it-works" className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right transform translate-y-24" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              {t("yourJourney") || "Your Journey at Taskademy"}
            </h2>
            <div className="text-foreground/60 text-lg max-w-2xl mx-auto h-8">
              <TypewriterText text={t("journeyDesc") || "From student to professional in three simple steps."} />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {[
              { 
                step: "01", 
                title: t("createProfile") || "Create Profile", 
                description: t("createProfileDesc") || "Showcase your skills, university, and passion. Build a profile that grabs attention.",
                icon: User,
                color: "from-blue-500/20 to-cyan-500/20"
              },
              { 
                step: "02", 
                title: t("pickYourTask") || "Pick Your Task", 
                description: t("pickYourTaskDesc") || "Filter through real-world projects. From web dev to design, find your perfect match.",
                icon: Search,
                color: "from-purple-500/20 to-pink-500/20"
              },
              { 
                step: "03", 
                title: t("launchCareer") || "Launch Career", 
                description: t("launchCareerDesc") || "Deliver high-quality work, get paid, and earn verified ratings for your resume.",
                icon: Star,
                color: "from-emerald-500/20 to-teal-500/20"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* Enhanced Animated Glow Background */}
                <div className={`absolute -inset-4 bg-gradient-to-br ${item.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl group-hover:blur-2xl`} />
                
                <div className="relative bg-card/80 backdrop-blur-md p-10 rounded-3xl border border-border group-hover:border-primary/40 transition-all duration-300 text-center shadow-lg group-hover:shadow-primary/20">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-8 relative"
                  >
                    <item.icon className="w-10 h-10 text-primary drop-shadow-md" />
                    
                    {/* Animated Step Badge */}
                    <motion.div 
                      whileHover={{ scale: 1.2, backgroundColor: "var(--color-primary-focus)" }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30"
                    >
                      {item.step}
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <div className="text-foreground/70 leading-relaxed min-h-[4rem]">
                    <TypewriterText text={item.description} delay={25} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* UNDO DESIGN: Restored Original Footer Layout */}
      <footer className="relative border-t border-border bg-background pt-24 pb-12 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link to={homeTarget} onClick={handleHomeClick}>
                  <img src={logoSrc} alt="Taskademy" className="h-28 w-auto object-contain hover:opacity-80 transition-opacity" />
                </Link>
              </div>
              <p className="text-foreground/60 text-lg leading-relaxed max-w-sm mb-8">
                {t("empoweringStudents") || "Empowering students to build real-world experience through meaningful tasks. Learn, work, and earn."}
              </p>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground tracking-tight">{t("platform") || "Platform"}</h4>
              <ul className="space-y-4">
                <li><Link to="/browse" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("browseTasks") || "Browse Tasks"}</Link></li>
                <li><Link to="/#how-it-works" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("howItWorks") || "How it Works"}</Link></li>
                <li><Link to="/register" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("getStarted") || "Get Started"}</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground tracking-tight">{t("support") || "Support"}</h4>
              <ul className="space-y-4">
                <li><Link to="/help" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("helpCenter") || "Help Center"}</Link></li>
                <li><Link to="/safety" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("safety") || "Safety"}</Link></li>
                <li><Link to="/contact" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("contact") || "Contact"}</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground tracking-tight">{t("company") || "Company"}</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-foreground/60 hover:text-primary transition-colors">{t("aboutUs") || "About Us"}</Link></li>
                <li><Link to="/careers" className="text-foreground/60 hover:text-primary transition-colors">{t("careers") || "Careers"}</Link></li>
                <li><Link to="/blog" className="text-foreground/60 hover:text-primary transition-colors">{t("blog") || "Blog"}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-foreground/40 text-sm">
            <p>&copy; 2026 Taskademy Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link to="/terms" className="hover:text-primary transition-colors">{t("terms") || "Terms"}</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">{t("privacy") || "Privacy"}</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">{t("cookies") || "Cookies"}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
