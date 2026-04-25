import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, PhilippinePeso, Calendar, Tag } from "lucide-react";
import { useState } from "react";
import { taskService } from "../services/task.service";
import { toast } from "sonner";

export default function PostTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    budget: "",
    deadline: "",
    category: "Design"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const task = await taskService.createTask({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        requirements: formData.requirements,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
      });

      toast.success("Task posted successfully!");
      navigate(`/task/${task.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Post a New Task</h1>
          <p className="text-foreground/60 mb-8">
            Find talented students to help with your project
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="title" className="block mb-3">
                Task Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Design a modern landing page"
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="category" className="block mb-3">
                <Tag className="inline w-4 h-4 mr-2" />
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              >
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
                <option value="Admin">Admin</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="description" className="block mb-3">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of what you need..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                required
              />
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="requirements" className="block mb-3">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the requirements (one per line)&#10;- Requirement 1&#10;- Requirement 2&#10;- Requirement 3"
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <label htmlFor="budget" className="block mb-3">
                  <PhilippinePeso className="inline w-4 h-4 mr-2" />
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">Ã¢â€šÂ±</span>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="150"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <label htmlFor="deadline" className="block mb-3">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Deadline
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post Task"}
              </button>
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-xl bg-card border border-border hover:bg-muted transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-6"
          >
            <h3 className="font-bold mb-2 text-primary">Tips for posting a great task</h3>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">Ã¢â‚¬Â¢</span>
                <span>Be clear and specific about what you need</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">Ã¢â‚¬Â¢</span>
                <span>Set a realistic budget and deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">Ã¢â‚¬Â¢</span>
                <span>List all requirements upfront to avoid confusion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">Ã¢â‚¬Â¢</span>
                <span>Respond quickly to applications to attract top talent</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
