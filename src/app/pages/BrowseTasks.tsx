import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, Filter, DollarSign, Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { taskService } from "../services/task.service";
import { Task } from "../types/api";
import { toast } from "sonner";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Design", "Writing", "Development", "Admin", "Marketing"];

  useEffect(() => {
    loadTasks();
  }, [selectedCategory]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: searchQuery || undefined,
      });
      setTasks(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Browse Tasks</h1>
          <p className="text-foreground/60">Find your next opportunity</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search tasks..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Search
            </button>
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground/60">Loading tasks...</p>
          </div>
        ) : (
          <>
            {/* Task Grid */}
            <div className="grid gap-6">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {task.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          task.status === 'open' ? 'bg-green-500/10 text-green-400' :
                          task.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-foreground/70 mb-4 leading-relaxed">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-6 text-foreground/60">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          ${task.budget}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
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

            {filteredTasks.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-foreground/60 text-lg">No tasks found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
