import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Mail, MapPin, Calendar, ExternalLink } from "lucide-react";

const portfolioProjects = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description: "Modern admin dashboard for online store",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    title: "Mobile Banking App",
    description: "UI/UX design for fintech application",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    title: "Travel Booking Platform",
    description: "Full-stack booking system with React",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Fitness Tracker App",
    description: "Mobile app for workout tracking",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop"
  }
];

const reviews = [
  {
    id: 1,
    author: "Sarah Chen",
    rating: 5,
    text: "Excellent work! Very professional and delivered ahead of schedule.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    author: "Michael Brown",
    rating: 5,
    text: "Great communication and quality work. Would hire again!",
    date: "1 month ago"
  },
  {
    id: 3,
    author: "Emma Davis",
    rating: 4,
    text: "Good job overall. Minor revisions needed but delivered well.",
    date: "2 months ago"
  }
];

const completedTasks = [
  { id: 1, title: "Design Landing Page for Startup", completed: "1 week ago" },
  { id: 2, title: "Build React Component Library", completed: "2 weeks ago" },
  { id: 3, title: "Social Media Graphics Package", completed: "3 weeks ago" }
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-8 border border-border mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              JD
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-medium">4.8</span>
                    <span className="text-foreground/60">(12 reviews)</span>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary">React Developer</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary">UI/UX Designer</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary">Content Writer</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-foreground/60">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  john.doe@example.com
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined March 2026
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-border">
            <button className="px-6 py-3 border-b-2 border-primary text-primary">
              Portfolio
            </button>
            <button className="px-6 py-3 text-foreground/60 hover:text-foreground transition-colors">
              Reviews
            </button>
            <button className="px-6 py-3 text-foreground/60 hover:text-foreground transition-colors">
              Completed Tasks
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {portfolioProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all group"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-foreground/70 mb-4">{project.description}</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
