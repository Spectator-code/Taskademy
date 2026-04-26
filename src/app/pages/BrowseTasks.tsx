
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, Filter, PhilippinePeso, Clock, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { taskService } from "../services/task.service";
import { Task } from "../types/api";
import { toast } from "sonner";
import { formatPeso } from "../utils/currency";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../contexts/AuthContext";

export default function BrowseTasks() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Design", "Writing", "Development", "Admin", "Marketing", "Other"];

  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      setLoading(true);
      try {
        const response = await taskService.getTasks({
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery || undefined,
        });

        if (!ignore) {
          setTasks(response.data);
        }
      } catch (error: any) {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load tasks.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(loadTasks, 250);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToDashboard") || "Back to Dashboard"}
          </Link>
          <h1 className="text-4xl font-bold mb-2">{t("browseTasks") || "Browse Tasks"}</h1>
          <p className="text-foreground/60">{t("findNextOpportunity") || "Find your next opportunity"}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchTasksPlaceholder") || "Search tasks..."}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-foreground/80">
              <Filter className="w-5 h-5" />
              Category:
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl transition-all font-medium ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted hover:text-foreground border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-foreground/60">Loading tasks...</div>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`bg-card rounded-2xl p-6 border transition-all group ${
                  user?.role === 'admin' 
                    ? 'border-amber-500/10 hover:border-amber-500/30 shadow-[0_0_10px_-3px_rgba(245,158,11,0.05)]' 
                    : user?.role === 'client'
                    ? 'border-blue-500/10 hover:border-blue-500/30 shadow-[0_0_10px_-3px_rgba(59,130,246,0.05)]'
                    : 'border-emerald-500/10 hover:border-emerald-500/30 shadow-[0_0_10px_-3px_rgba(16,185,129,0.05)]'
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {task.image_url && (
                      <div className="mb-4 overflow-hidden rounded-2xl border border-border">
                        <img
                          src={task.image_url}
                          alt={task.title}
                          className="h-56 w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {task.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm capitalize">
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-foreground/70 mb-4 leading-relaxed">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-6 text-foreground/60 flex-wrap">
                      <div className="flex items-center gap-2">
                        <PhilippinePeso className="w-4 h-4" />
                        {formatPeso(task.budget)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        Posted by <span className="text-primary">{task.client?.name ?? "Client"}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/task/${task.id}`}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-foreground/60 text-lg">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
