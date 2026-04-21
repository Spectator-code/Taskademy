import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, DollarSign, Clock, User, Star, Heart } from "lucide-react";
import { useState } from "react";

const taskData = {
  1: {
    title: "Design Landing Page for Startup",
    description: "Need a modern, responsive landing page for a SaaS startup. Should include hero section, features, and pricing.",
    fullDescription: "We're looking for a talented designer to create a stunning landing page for our new SaaS product. The design should be modern, clean, and conversion-focused. We need the following sections: Hero with CTA, Features showcase, Pricing table, Testimonials, and Footer. The design should be responsive and work well on all devices.",
    requirements: [
      "Figma design files",
      "Responsive design (mobile, tablet, desktop)",
      "Modern UI/UX principles",
      "Brand colors integration",
      "3 revision rounds included"
    ],
    budget: "$150",
    deadline: "3 days",
    category: "Design",
    postedBy: {
      name: "Sarah Chen",
      rating: 4.9,
      completedTasks: 23
    }
  }
};

export default function TaskDetails() {
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState("");
  const task = taskData[id as keyof typeof taskData];

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task not found</h1>
          <Link to="/browse" className="text-primary hover:underline">
            Browse other tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                  {task.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{task.title}</h1>
              <div className="flex items-center gap-6 text-foreground/60">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {task.budget}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Deadline: {task.deadline}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                {task.fullDescription}
              </p>

              <h3 className="text-xl font-bold mb-4">Requirements</h3>
              <ul className="space-y-3">
                {task.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="text-foreground/70">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Posted By</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{task.postedBy.name}</div>
                  <div className="flex items-center gap-4 text-foreground/60">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      {task.postedBy.rating}
                    </div>
                    <div>{task.postedBy.completedTasks} tasks completed</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-8 space-y-6">
              <div>
                <label className="block mb-3 font-medium">Your Bid (Optional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <button className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                Apply for Task
              </button>

              <button className="w-full px-6 py-3 rounded-xl bg-card border border-border hover:bg-muted transition-all flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Save Task
              </button>

              <div className="pt-6 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Budget</span>
                  <span className="font-medium">{task.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Deadline</span>
                  <span className="font-medium">{task.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Category</span>
                  <span className="font-medium">{task.category}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
