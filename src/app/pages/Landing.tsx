import { Link } from "react-router";
import { motion } from "motion/react";
import { Brain, Briefcase, Star, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const homeTarget = isAuthenticated ? "/dashboard" : "/";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to={homeTarget} className="text-2xl font-bold">
              Taskademy
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link to={homeTarget} className="text-foreground/80 hover:text-foreground transition-colors">
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

      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* How It Works */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Sign Up", description: "Create your student profile in minutes" },
              { step: "02", title: "Browse Tasks", description: "Find projects that match your skills" },
              { step: "03", title: "Start Earning", description: "Complete tasks and build your portfolio" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-primary/20 mb-6">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">Taskademy</div>
              <p className="text-foreground/60">Learn. Work. Earn.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/browse" className="text-foreground/60 hover:text-foreground transition-colors">Browse Tasks</Link></li>
                <li><a href="#how-it-works" className="text-foreground/60 hover:text-foreground transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-foreground/60">
            <p>&copy; 2026 Taskademy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
