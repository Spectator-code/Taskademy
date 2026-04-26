import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Search, Book, MessageCircle, FileText, UserCircle, Briefcase, HelpCircle, ChevronRight } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export default function HelpCenter() {
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
  const categories = [
    { icon: UserCircle, title: "Account & Profile", desc: "Manage your settings, verify your identity, and build a standout portfolio." },
    { icon: Briefcase, title: "Finding Work", desc: "Tips on searching, bidding, and communicating with prospective clients." },
    { icon: Book, title: "Completing Tasks", desc: "Guidelines for submission, revisions, and quality standards." },
    { icon: MessageCircle, title: "Payments & Fees", desc: "Understanding our secure escrow system, withdrawal methods, and fees." },
    { icon: FileText, title: "Policies & Rules", desc: "Our terms of service, privacy policies, and code of conduct." },
    { icon: HelpCircle, title: "Dispute Resolution", desc: "How to handle disagreements, mediation, and reporting issues." }
  ];

  const popularArticles = [
    "How do I verify my student status?",
    "When will my payment become available for withdrawal?",
    "What should I include in my proposal?",
    "How does the rating and review system work?",
    "Can I work with international clients?"
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border">
          <div className="text-center mb-16 flex flex-col items-center">
            <Link to="/">
              <img src={logoSrc} alt="Taskademy" className="h-20 w-auto mb-8 hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">How can we help?</h1>
            <p className="text-foreground/60 text-xl max-w-2xl mx-auto">Search our comprehensive knowledge base or browse through the specific categories below to find exactly what you need.</p>
            <div className="mt-10 relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40 group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Search for articles, guides, or keywords..." className="w-full bg-background border-2 border-border rounded-full py-5 pl-16 pr-6 text-lg focus:outline-none focus:border-primary transition-all shadow-sm" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((cat, i) => (
              <div key={i} className="p-8 bg-muted rounded-3xl border border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg hover:-translate-y-1">
                <cat.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Popular Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {popularArticles.map((article, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-muted/50 rounded-2xl border border-border group hover:bg-muted transition-all cursor-pointer">
                  <span className="font-medium group-hover:text-primary transition-colors">{article}</span>
                  <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary/20 rounded-[2rem] p-10 md:p-12 border border-border text-center">
            <h3 className="text-3xl font-bold mb-4">Still need help?</h3>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
              If you couldn't find the answer you were looking for, our support team is available 24/7 to assist you with any platform-related issues.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-foreground/10"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
