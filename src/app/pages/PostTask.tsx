import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, PhilippinePeso, Calendar, Tag, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { taskService } from "../services/task.service";
import { toast } from "sonner";
import { useTranslation } from "../hooks/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function PostTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    budget: "",
    deadline: "",
    category: "Design"
  });
  const [taskImage, setTaskImage] = useState<File | null>(null);

  useEffect(() => {
    if (draftId) {
      setLoading(true);
      taskService.getTaskById(parseInt(draftId))
        .then(task => {
          setFormData({
            title: task.title,
            description: task.description,
            requirements: task.requirements || "",
            budget: String(task.budget),
            deadline: task.deadline.split('T')[0],
            category: task.category
          });
        })
        .catch(() => toast.error("Failed to load draft."))
        .finally(() => setLoading(false));
    }
  }, [draftId]);

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        requirements: formData.requirements,
        budget: parseFloat(formData.budget) || 0,
        deadline: formData.deadline,
        image: taskImage,
        status: isDraft ? 'draft' : 'open'
      } as any;

      const task = draftId 
        ? await taskService.updateTask(parseInt(draftId), payload)
        : await taskService.createTask(payload);

      toast.success(isDraft ? "Task saved as draft!" : "Task posted successfully!");
      if (isDraft) {
        navigate('/dashboard');
      } else {
        navigate(`/task/${task.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isDraft ? 'save draft' : 'post task'}. Please try again.`);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setTaskImage(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToDashboard")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">{t("postTask")}</h1>
          <p className="text-foreground/60 mb-8">
            Find talented students to help with your project
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="title" className="block mb-3 font-bold">
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
              <label htmlFor="category" className="block mb-3 font-bold">
                <Tag className="inline w-4 h-4 mr-2" />
                Category
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Writing">Writing</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="description" className="block mb-3 font-bold">
                {t("description")}
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
              <label htmlFor="requirements" className="block mb-3 font-bold">
                {t("requirements")}
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
            <div className="bg-card rounded-2xl p-6 border border-border">
              <label htmlFor="image" className="block mb-3 font-bold">
                <ImageIcon className="inline w-4 h-4 mr-2" />
                Task Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {taskImage && (
                <p className="text-sm text-foreground/60 mt-3">{taskImage.name}</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <label htmlFor="budget" className="block mb-3 font-bold">
                  <PhilippinePeso className="inline w-4 h-4 mr-2" />
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">{"\u20b1"}</span>
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
                <label htmlFor="deadline" className="block mb-3 font-bold">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {loading ? "Processing..." : "Post Task Now"}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(null as any, true)}
                disabled={loading || !formData.title}
                className="flex-1 px-8 py-4 rounded-xl bg-card border border-border hover:bg-muted transition-all font-bold disabled:opacity-50"
              >
                {t("draftTasks")}
              </button>
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-xl bg-card border border-border hover:bg-muted transition-all text-center flex-1 font-bold"
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
                <span className="text-primary mt-1">{"\u2022"}</span>
                <span>Be clear and specific about what you need</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">{"\u2022"}</span>
                <span>Set a realistic budget and deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">{"\u2022"}</span>
                <span>List all requirements upfront to avoid confusion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">{"\u2022"}</span>
                <span>Respond quickly to applications to attract top talent</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
