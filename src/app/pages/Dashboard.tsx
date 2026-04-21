import { Link } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Search,
  ListChecks,
  MessageSquare,
  User,
  Settings,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const mockTasks = [
  {
    id: 1,
    title: "Design Landing Page for Startup",
    budget: "$150",
    deadline: "3 days",
    category: "Design"
  },
  {
    id: 2,
    title: "Write Blog Post on Tech Trends",
    budget: "$75",
    deadline: "5 days",
    category: "Writing"
  },
  {
    id: 3,
    title: "Build React Component Library",
    budget: "$300",
    deadline: "1 week",
    category: "Development"
  },
  {
    id: 4,
    title: "Social Media Graphics Package",
    budget: "$100",
    deadline: "2 days",
    category: "Design"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="text-2xl font-bold">
            Taskademy
          </Link>
        </div>

        <div className="p-4 border-b border-border">
          <Link
            to="/post-task"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            + Post a Task
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/browse"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-card hover:text-foreground transition-all"
          >
            <Search className="w-5 h-5" />
            Browse Tasks
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-card hover:text-foreground transition-all"
          >
            <ListChecks className="w-5 h-5" />
            My Tasks
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-card hover:text-foreground transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </Link>
          <Link
            to="/profile/1"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-card hover:text-foreground transition-all"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-card hover:text-foreground transition-all"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-foreground/60">Student</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/60 mb-8">Welcome back, John</p>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: Clock,
                  label: "Active Tasks",
                  value: "3",
                  color: "text-blue-400"
                },
                {
                  icon: CheckCircle,
                  label: "Completed Tasks",
                  value: "12",
                  color: "text-primary"
                },
                {
                  icon: DollarSign,
                  label: "Total Earnings",
                  value: "$1,250",
                  color: "text-yellow-400"
                },
                {
                  icon: Star,
                  label: "Rating",
                  value: "4.8",
                  color: "text-primary"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Recommended Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recommended Tasks</h2>
                <Link
                  to="/browse"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid gap-4">
                {mockTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            {task.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-6 text-foreground/60">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {task.budget}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {task.deadline}
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/task/${task.id}`}
                        className="px-6 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        Apply
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
