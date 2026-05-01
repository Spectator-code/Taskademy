// Careers page component
// This page showcases the company's core values, perks, and hiring information.
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Users, Rocket, Heart, Globe, Zap, Coffee } from "lucide-react";
import { useApp } from "../contexts/AppContext";

// Main Careers component renders the page layout and sections.
export default function Careers() {
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo light.png" : "/logo dark.png";
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
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
              <Rocket className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Build the future of student work</h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              We are on a mission to democratize early-career experience. Join our team and help us empower millions of students to launch their careers before they even graduate.
            </p>
          </div>

          {/* Section: Core Values – highlights the team's guiding principles. */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-muted rounded-3xl border border-border text-center">
                <Heart className="w-10 h-10 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-3">Student First</h3>
                <p className="text-foreground/60">Every decision we make starts with asking: "How does this help our students succeed?"</p>
              </div>
              <div className="p-8 bg-muted rounded-3xl border border-border text-center">
                <Globe className="w-10 h-10 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-3">Radical Inclusion</h3>
                <p className="text-foreground/60">Opportunity shouldn't be limited by geography or background. We build for everyone.</p>
              </div>
              <div className="p-8 bg-muted rounded-3xl border border-border text-center">
                <Zap className="w-10 h-10 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-3">Move Fast, Learn Faster</h3>
                <p className="text-foreground/60">We iterate rapidly, embrace failures as learning opportunities, and constantly evolve.</p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-[2rem] p-10 md:p-12 border border-border mb-16 flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Perks & Benefits</h2>
              <ul className="space-y-4 mt-6">
                <li className="flex items-center gap-3"><CheckIcon /> Competitive equity and salary packages</li>
                <li className="flex items-center gap-3"><CheckIcon /> 100% remote-first culture with flexible hours</li>
                <li className="flex items-center gap-3"><CheckIcon /> Unlimited paid time off (with a minimum required!)</li>
                <li className="flex items-center gap-3"><CheckIcon /> Annual team retreats around the world</li>
                <li className="flex items-center gap-3"><CheckIcon /> Generous home-office and wellness stipends</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="overflow-hidden rounded-[2rem] border border-border">
                <img 
                  src="/taskademy_team_photo_1777185254562.png" 
                  alt="Taskademy Team" 
                  className="w-full aspect-video object-cover hover:scale-110 transition-transform duration-1000" 
                />
              </div>
            </div>
          </div>

          <div className="text-center p-12 bg-primary/5 rounded-[2.5rem] border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Don't see a role for you?</h2>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
              We're always looking for talented individuals who are passionate about the student economy. Send us your resume and tell us why you'd be a great fit.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <Users className="w-5 h-5" />
              Join Our Talent Pool
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper component rendering a checkmark icon for list items.
function CheckIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
