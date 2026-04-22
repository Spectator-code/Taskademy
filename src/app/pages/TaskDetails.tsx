import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, DollarSign, Clock, User, Star, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { taskService } from "../services/task.service";
import { Task } from "../types/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function TaskDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let ignore = false;

    taskService
      .getTaskById(Number(id))
      .then((response) => {
        if (!ignore) {
          setTask(response);
        }
      })
      .catch((error: any) => {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load task.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const requirements = useMemo(() => {
    if (!task?.requirements) {
      return [];
    }

    return task.requirements
      .split(/\r?\n/)
      .map((item) => item.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }, [task?.requirements]);

  const handleApply = async () => {
    if (!task) {
      return;
    }

    setApplying(true);
    try {
      await taskService.applyToTask(task.id);
      toast.success("Application submitted.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply for task.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading task...</div>
      </div>
    );
  }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                  {task.category}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 capitalize">
                  {task.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{task.title}</h1>
              <div className="flex items-center gap-6 text-foreground/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  ${Number(task.budget).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                {task.description}
              </p>

              {requirements.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {requirements.map((requirement) => (
                      <li key={requirement} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span className="text-foreground/70">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Posted By</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{task.client?.name ?? "Client"}</div>
                  <div className="flex items-center gap-4 text-foreground/60 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      {task.client?.rating ?? "0.00"}
                    </div>
                    <div>{task.client?.completed_tasks ?? 0} tasks completed</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-8 space-y-6">
              <button
                onClick={handleApply}
                disabled={applying || user?.role !== "student" || task.status !== "open"}
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {task.status !== "open"
                  ? "Task Closed"
                  : user?.role !== "student"
                  ? "Students Can Apply"
                  : applying
                  ? "Submitting..."
                  : "Apply for Task"}
              </button>

              <button className="w-full px-6 py-3 rounded-xl bg-card border border-border hover:bg-muted transition-all flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Save Task
              </button>

              <div className="pt-6 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Budget</span>
                  <span className="font-medium">${Number(task.budget).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Deadline</span>
                  <span className="font-medium">{new Date(task.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Category</span>
                  <span className="font-medium">{task.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Client</span>
                  <span className="font-medium">{task.client?.name ?? "Client"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
