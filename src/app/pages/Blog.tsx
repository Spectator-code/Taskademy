import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { toast } from "sonner";

export default function Blog() {
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
  const featuredPost = {
    category: "Platform Updates",
    title: "Taskademy 2.0: Redefining Student Freelancing",
    excerpt: "Today, we're incredibly excited to announce the next generation of Taskademy. With a completely redesigned interface, faster matching algorithms, and a brand new real-time messaging system, finding and completing tasks has never been easier.",
    author: "Sarah Jenkins",
    date: "April 20, 2026",
    readTime: "5 min read",
    imagePlaceholder: "bg-gradient-to-br from-primary/20 to-purple-500/20"
  };

  const posts = [
    {
      category: "Guides",
      title: "How to land your first freelance task",
      excerpt: "A comprehensive guide for students looking to start their freelance journey. From crafting the perfect profile to writing winning proposals.",
      date: "April 15, 2026",
      readTime: "8 min read"
    },
    {
      category: "Success Stories",
      title: "From CS Student to Lead Developer: Alex's Journey",
      excerpt: "How Alex used Taskademy to build a portfolio that landed him a senior position at a Fortune 500 company right after graduation.",
      date: "April 10, 2026",
      readTime: "6 min read"
    },
    {
      category: "Tips & Tricks",
      title: "5 Portfolio Mistakes You're Probably Making",
      excerpt: "Are you applying to tasks but not getting responses? Your portfolio might be to blame. Here are the most common mistakes and how to fix them.",
      date: "April 5, 2026",
      readTime: "4 min read"
    },
    {
      category: "News",
      title: "Taskademy reaches 10,000 active students",
      excerpt: "Celebrating a major milestone in our mission to empower students globally with real-world experience and financial independence.",
      date: "March 28, 2026",
      readTime: "3 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border">
          <div className="text-center mb-16 flex flex-col items-center">
            <Link to="/">
              <img src={logoSrc} alt="Taskademy" className="h-20 w-auto mb-8 hover:scale-105 transition-transform" />
            </Link>
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">The Taskademy Blog</h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Insights, guides, success stories, and platform updates from the Taskademy community.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16 group cursor-pointer">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-muted rounded-3xl p-4 border border-border hover:border-primary/50 transition-colors">
              <div className={`aspect-video rounded-2xl ${featuredPost.imagePlaceholder} flex items-center justify-center relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                 <BookOpen className="w-16 h-16 text-primary/50" />
              </div>
              <div className="p-4 md:p-8 md:pl-4">
                <span className="text-primary font-bold text-sm uppercase tracking-wider mb-4 block">{featuredPost.category}</span>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{featuredPost.title}</h2>
                <p className="text-foreground/70 leading-relaxed mb-6 text-lg">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-foreground/50">
                  <span className="font-medium text-foreground">{featuredPost.author}</span>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {featuredPost.date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featuredPost.readTime}</div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-8">Latest Posts</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {posts.map((post, i) => (
              <div key={i} className="p-8 bg-card rounded-3xl border border-border group hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full">
                <span className="text-primary text-sm font-bold tracking-wider uppercase mb-3 block">{post.category}</span>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-foreground/60 leading-relaxed mb-8 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-foreground/50 pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-[2.5rem] p-12 md:p-16 border border-primary/20 text-center">
            <h3 className="text-3xl font-bold mb-4">Stay in the loop</h3>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto text-lg">
              Get the latest success stories, freelance tips, and platform updates delivered straight to your inbox every week.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed!"); }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-2xl bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
