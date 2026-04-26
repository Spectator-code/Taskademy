import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Brain, Briefcase, Star, ArrowRight, User, Search, Twitter, Github, Instagram, Linkedin, Mail, Send } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import ThemeSwitcher from "../components/ui/ThemeSwitcher";
import "../../styles/SparkleButton.css";
import Testimonials from "../components/Testimonials";
import AdvertisementCarousel from "../components/AdvertisementCarousel";
import TypewriterText from "../components/ui/TypewriterText";
import { useTranslation } from "../hooks/useTranslation";
import { useEffect } from "react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { theme } = useApp();
  const homeTarget = isAuthenticated ? "/dashboard" : "/";
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
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
              <img src={logoSrc} alt="Taskademy" className="h-35 w-auto object-contain" />
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link to={homeTarget} onClick={handleHomeClick} className="text-foreground/80 hover:text-foreground transition-colors">
              {t("home") || "Home"}
            </Link>
            <Link to="/browse" className="text-foreground/80 hover:text-foreground transition-colors">
              {t("browseTasks") || "Browse Tasks"}
            </Link>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              {t("howItWorks") || "How it Works"}
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
                  {t("login") || "Login"}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  {t("register") || "Register"}
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
              {t("learnWorkEarn") || "Learn. Work. Earn."}
            </h1>
            <div className="text-xl text-foreground/70 mb-15 leading-relaxed h-8">
              <TypewriterText text={t("studentFriendlyFreelance") || "A student-friendly freelance platform for real-world experience"} delay={50} />
            </div>
            <Link
              to="/register"
              className="sparkle-button"
            >
              <div className="dots_border"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="sparkle"
              >
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                ></path>
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                ></path>
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                ></path>
              </svg>
              <span className="text_button">{t("getStarted") || "Get Started"}</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <Testimonials isHero={true} />
          </motion.div>
        </div>
      </section>

      <AdvertisementCarousel />

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
              {t("whyTaskademy") || "Why Taskademy?"}
            </h2>
            <div className="text-foreground/70 text-lg h-8">
              <TypewriterText text={t("buildCareer") || "Build your career while you learn"} />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: t("skillBuilding") || "Skill Building",
                description: t("skillBuildingDesc") || "Learn by doing real projects that matter"
              },
              {
                icon: Briefcase,
                title: t("realTasks") || "Real Tasks",
                description: t("realTasksDesc") || "Work on genuine projects with real clients"
              },
              {
                icon: Star,
                title: t("portfolioGrowth") || "Portfolio Growth",
                description: t("portfolioGrowthDesc") || "Build a portfolio that showcases your work"
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
                <div className="text-foreground/70 leading-relaxed min-h-[3rem]">
                  <TypewriterText text={feature.description} delay={30} />
                </div>
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
                  <div className="text-foreground/70 leading-relaxed min-h-[4rem]">
                    <TypewriterText text={item.description} delay={25} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials moved to hero section */}
      
      <footer className="relative border-t border-border bg-background pt-24 pb-12 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link to={homeTarget} onClick={handleHomeClick}>
                  <img src={logoSrc} alt="Taskademy" className="h-35 w-auto object-contain hover:opacity-80 transition-opacity" />
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
                <li><a href="#how-it-works" className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />{t("howItWorks") || "How it Works"}</a></li>
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

          {/* Legal column removed as requested - links preserved in the bottom row */}
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
