import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Brain, Briefcase, Star, ArrowRight, User, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ThemeSwitcher from "../components/ui/ThemeSwitcher";
import { useEffect } from "react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const homeTarget = isAuthenticated ? "/dashboard" : "/";
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to={homeTarget} onClick={handleHomeClick} className="text-2xl font-bold flex items-center gap-4">
              <img src="/logo.png" alt="Taskademy" className="h-70 w-70 object-contain" />
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link to={homeTarget} onClick={handleHomeClick} className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-foreground/80 hover:text-foreground transition-colors">
              Browse Tasks
            </Link>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How it Works
            </a>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <ThemeSwitcher />
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-foreground/80 hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </header>
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Learn. Work. Earn.
            </h1>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              A student-friendly freelance platform for real-world experience
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border">
              <div className="space-y-4">
                <div className="h-3 bg-primary/20 rounded-full w-3/4" />
                <div className="h-3 bg-primary/10 rounded-full w-full" />
                <div className="h-3 bg-primary/10 rounded-full w-5/6" />
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-background/80 rounded-2xl p-4 border border-border">
                    <div className="h-16 w-16 bg-primary/20 rounded-xl mb-3" />
                    <div className="h-2 bg-primary/10 rounded w-full mb-2" />
                    <div className="h-2 bg-primary/10 rounded w-2/3" />
                  </div>
                  <div className="bg-background/80 rounded-2xl p-4 border border-border">
                    <div className="h-16 w-16 bg-primary/20 rounded-xl mb-3" />
                    <div className="h-2 bg-primary/10 rounded w-full mb-2" />
                    <div className="h-2 bg-primary/10 rounded w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="relative py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Taskademy?
            </h2>
            <p className="text-foreground/70 text-lg">
              Build your career while you learn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Skill Building",
                description: "Learn by doing real projects that matter"
              },
              {
                icon: Briefcase,
                title: "Real Tasks",
                description: "Work on genuine projects with real clients"
              },
              {
                icon: Star,
                title: "Portfolio Growth",
                description: "Build a portfolio that showcases your work"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right transform translate-y-24" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Your Journey at Taskademy
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              From student to professional in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {[
              { 
                step: "01", 
                title: "Create Profile", 
                description: "Showcase your skills, university, and passion. Build a profile that grabs attention.",
                icon: User,
                color: "from-blue-500/20 to-cyan-500/20"
              },
              { 
                step: "02", 
                title: "Pick Your Task", 
                description: "Filter through real-world projects. From web dev to design, find your perfect match.",
                icon: Search,
                color: "from-purple-500/20 to-pink-500/20"
              },
              { 
                step: "03", 
                title: "Launch Career", 
                description: "Deliver high-quality work, get paid, and earn verified ratings for your resume.",
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
                className="relative group"
              >
                <div className={`absolute -inset-4 bg-gradient-to-br ${item.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />
                
                <div className="relative bg-card/80 backdrop-blur-md p-10 rounded-3xl border border-border group-hover:border-primary/30 transition-all text-center">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <item.icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="relative border-t border-border bg-card/30 pt-24 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="text-3xl font-bold mb-6 flex items-center gap-4">
                <img src="/logo.png" alt="Taskademy" className="h-30 w-auto object-contain" />
                
              </div>
              <p className="text-foreground/60 text-lg leading-relaxed max-w-sm mb-8">
                Empowering students to build real-world experience through meaningful tasks. Learn, work, and earn.
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/browse" className="text-foreground/60 hover:text-primary transition-colors">Browse Tasks</Link></li>
                <li><a href="#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">How it Works</a></li>
                <li><Link to="/register" className="text-foreground/60 hover:text-primary transition-colors">Get Started</Link></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors">Safety</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-foreground/60 hover:text-primary transition-colors">About Us</Link></li>
                <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-lg mb-6 text-foreground">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/terms" className="text-foreground/60 hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/privacy" className="text-foreground/60 hover:text-primary transition-colors">Privacy</Link></li>
                <li><a href="#" className="text-foreground/60 hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-foreground/40 text-sm">
            <p>&copy; 2026 Taskademy Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
