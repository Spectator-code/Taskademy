import { Link } from "react-router";
import { motion } from "motion/react";
import { ClipboardCheck, Clock, PhilippinePeso } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DashboardSidebar from "../components/DashboardSidebar";
import { taskService } from "../services/task.service";
import { Task } from "../types/api";
import { formatPeso } from "../utils/currency";

export default function DraftTasks() {
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    taskService
      .getMyTasks("posted")
      .then((tasks) => {
        if (!ignore) {
          setPostedTasks(tasks);
        }
      })
      .catch((error: any) => {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load draft tasks.");
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
  }, []);

  const draftTasks = useMemo(
    () => postedTasks.filter((task) => task.status === "draft"),
    [postedTasks],
  );

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <ClipboardCheck className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Draft Tasks</h1>
            </div>
            <p className="text-foreground/60 mb-8">
              Continue unfinished task posts and publish them when you're ready.
            </p>

            {loading ? (
              <div className="text-foreground/60">Loading draft tasks...</div>
            ) : draftTasks.length === 0 ? (
              <div className="p-10 bg-card rounded-2xl border border-dashed border-border text-center text-foreground/40">
                <p>No draft tasks yet.</p>
                <Link to="/post-task" className="text-primary hover:underline text-sm mt-3 inline-block">
                  Create a task
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {draftTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="bg-card rounded-2xl p-6 border border-dashed border-border"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {task.category}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-muted text-foreground/70 text-sm capitalize">
                            {task.status}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">{task.title}</h2>
                        <div className="flex items-center gap-6 text-foreground/60 flex-wrap text-sm">
                          <div className="flex items-center gap-2">
                            <PhilippinePeso className="w-4 h-4" />
                            {formatPeso(task.budget)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Last updated {new Date(task.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/post-task?draft=${task.id}`}
                        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-bold"
                      >
                        Continue Editing
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
