import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Mail, MapPin, Calendar, ExternalLink, Upload, FileText, Plus, X, Heart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { userService } from "../services/user.service";
import { ResumeManual, User as UserType } from "../types/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "../hooks/useTranslation";

const defaultPortfolioProjects = [
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
  }
];

const reviews = [
  {
    id: 1,
    author: "User A",
    rating: 5,
    text: "Excellent work! Very professional and delivered ahead of schedule.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    author: "User B",
    rating: 5,
    text: "Great communication and quality work. Would hire again!",
    date: "1 month ago"
  },
  {
    id: 3,
    author: "User C",
    rating: 4,
    text: "Good job overall. Minor revisions needed but delivered well.",
    date: "2 months ago"
  }
];

const emptyResume = (): ResumeManual => ({
  summary: "",
  experience: [{ company: "", position: "", duration: "", description: "" }],
  education: [{ school: "", degree: "", year: "" }],
  skills: [""],
});

export default function Profile() {
  const { t } = useTranslation();
  const params = useParams();
  const { user, refreshUser } = useAuth();
  const userId = Number(params.id);
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState("");

  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'tasks' | 'resume'>('portfolio');
  const [resumeMode, setResumeMode] = useState<'upload' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualResume, setManualResume] = useState<ResumeManual>(emptyResume);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>(defaultPortfolioProjects);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", image: "" });

  useEffect(() => {
    if (userId) {
      const savedProjects = localStorage.getItem(`portfolio_${userId}`);
      if (savedProjects) {
        setPortfolioProjects(JSON.parse(savedProjects));
      } else {
        setPortfolioProjects(defaultPortfolioProjects);
      }
    }
  }, [userId]);

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error("Please fill in title and description.");
      return;
    }
    const updated = [{ ...newProject, id: Date.now(), image: newProject.image || "https://images.unsplash.com/photo-1507238692062-870ce5f14e5b?w=800&h=600&fit=crop" }, ...portfolioProjects];
    setPortfolioProjects(updated);
    localStorage.setItem(`portfolio_${userId}`, JSON.stringify(updated));
    setNewProject({ title: "", description: "", image: "" });
    setIsAddingProject(false);
    toast.success("Project added to portfolio!");
  };

  const handleDeleteProject = (projectId: number) => {
    const updated = portfolioProjects.filter(p => p.id !== projectId);
    setPortfolioProjects(updated);
    localStorage.setItem(`portfolio_${userId}`, JSON.stringify(updated));
    toast.success("Project removed.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
    } else if (file) {
      toast.error("Please upload a PDF or DOCX file.");
    }
  };

  const addExperience = () => {
    setManualResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", duration: "", description: "" }]
    }));
  };

  const removeExperience = (index: number) => {
    setManualResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setManualResume(prev => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setManualResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setManualResume(prev => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };

  const removeSkill = (index: number) => {
    setManualResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (!Number.isFinite(userId)) return;
    setLoading(true);
    userService
      .getUserById(userId)
      .then((loadedUser) => {
        setProfileUser(loadedUser);
        setEditName(loadedUser.name ?? "");
        setEditBio(loadedUser.bio ?? "");
        setEditSkills(Array.isArray(loadedUser.skills) ? loadedUser.skills.join(", ") : "");
        setManualResume(loadedUser.resume_manual ?? emptyResume());
        setUploadedFile(null);
        setResumeMode(null);
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || "Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const canEditProfile = profileUser && (user?.id === profileUser.id || user?.role === "admin");
  const isResumeOwner = profileUser?.id === user?.id;
  const hasUploadedResume = Boolean(profileUser?.resume_file_name && profileUser?.resume_url);
  const hasManualResume = Boolean(
    profileUser?.resume_manual?.summary?.trim() ||
    profileUser?.resume_manual?.experience?.some((item) =>
      [item.company, item.position, item.duration, item.description].some((value) => value?.trim())
    ) ||
    profileUser?.resume_manual?.education?.some((item) =>
      [item.school, item.degree, item.year].some((value) => value?.trim())
    ) ||
    profileUser?.resume_manual?.skills?.some((value) => value?.trim())
  );
  const hasAnyResume = hasUploadedResume || hasManualResume;

  const handleCancelEdit = () => {
    setEditName(profileUser?.name ?? "");
    setEditBio(profileUser?.bio ?? "");
    setEditSkills(Array.isArray(profileUser?.skills) ? profileUser.skills.join(", ") : "");
    setEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!profileUser) return;

    setSavingProfile(true);
    try {
      const updatedUser = await userService.updateProfile(profileUser.id, {
        name: editName.trim(),
        bio: editBio.trim() || undefined,
        skills: editSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      setProfileUser(updatedUser);
      setEditName(updatedUser.name ?? "");
      setEditBio(updatedUser.bio ?? "");
      setEditSkills(Array.isArray(updatedUser.skills) ? updatedUser.skills.join(", ") : "");
      setEditing(false);

      if (user?.id === updatedUser.id) {
        await refreshUser();
      }

      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const profileCompletion = useMemo(() => {
    if (!profileUser) return 0;
    const fields = [
      profileUser.name,
      profileUser.bio,
      profileUser.avatar_url,
      profileUser.skills?.length ? true : false,
      profileUser.resume_url || profileUser.resume_manual ? true : false
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [profileUser]);

  const initials = useMemo(() => {
    const name = profileUser?.name?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
  }, [profileUser?.name]);

  const updateExperience = (index: number, field: keyof ResumeManual["experience"][number], value: string) => {
    setManualResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const updateEducation = (index: number, field: keyof ResumeManual["education"][number], value: string) => {
    setManualResume((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const updateResumeSkill = (index: number, value: string) => {
    setManualResume((prev) => ({
      ...prev,
      skills: prev.skills.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSaveUploadedResume = async () => {
    if (!uploadedFile || !profileUser || !isResumeOwner) return;

    setSavingResume(true);
    try {
      const updatedUser = await userService.uploadResume(uploadedFile);
      setProfileUser(updatedUser);
      setUploadedFile(null);
      setResumeMode(null);
      toast.success("Resume uploaded");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload resume.");
    } finally {
      setSavingResume(false);
    }
  };

  const handleSaveManualResume = async () => {
    if (!profileUser || !isResumeOwner) return;

    const cleanedResume: ResumeManual = {
      summary: manualResume.summary.trim(),
      experience: manualResume.experience
        .map((item) => ({
          company: item.company.trim(),
          position: item.position.trim(),
          duration: item.duration.trim(),
          description: item.description.trim(),
        }))
        .filter((item) => item.company || item.position || item.duration || item.description),
      education: manualResume.education
        .map((item) => ({
          school: item.school.trim(),
          degree: item.degree.trim(),
          year: item.year.trim(),
        }))
        .filter((item) => item.school || item.degree || item.year),
      skills: manualResume.skills.map((item) => item.trim()).filter(Boolean),
    };

    setSavingResume(true);
    try {
      const updatedUser = await userService.updateResume(profileUser.id, cleanedResume);
      setProfileUser(updatedUser);
      setManualResume(updatedUser.resume_manual ?? emptyResume());
      setResumeMode(null);
      toast.success("Resume saved");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save resume.");
    } finally {
      setSavingResume(false);
    }
  };

  const handleEditManualResume = () => {
    setManualResume(profileUser?.resume_manual ?? emptyResume());
    setResumeMode("manual");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToDashboard") || "Back to Dashboard"}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 border border-border mb-8"
        >
          <div className="flex items-start gap-6">
            {profileUser?.avatar_url ? (
              <img
                src={profileUser.avatar_url}
                alt={profileUser.name ?? "User"}
                className="w-24 h-24 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                {initials}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {editing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-3xl font-bold mb-2 w-full max-w-md px-4 py-2 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-2">
                      {loading ? "Loading..." : (profileUser?.name ?? "User")}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-medium">{profileUser?.rating ?? "0.00"}</span>
                    <span className="text-foreground/60">
                      ({profileUser?.completed_tasks ?? 0} {t("completed") || "completed"})
                    </span>
                  </div>
                  {isResumeOwner && profileUser?.role === 'student' && profileCompletion < 100 && (
                    <div className="mt-4 max-w-xs">
                      <div className="flex justify-between text-xs mb-1 font-bold text-emerald-500">
                        <span>{t("profileCompletionScore") || "Profile Completion Score"}</span>
                        <span>{profileCompletion}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${profileCompletion}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                {canEditProfile && (
                  editing ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={savingProfile}
                        className="px-5 py-3 rounded-xl bg-background hover:bg-muted transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={savingProfile || !editName.trim()}
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {savingProfile ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  ) : (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold"
                      >
                        {t("editProfile") || "Edit Profile"}
                      </button>
                  )
                )}
                {!canEditProfile && user?.role === 'client' && profileUser?.role === 'student' && (
                  <button
                    type="button"
                    onClick={() => {
                      const saved = JSON.parse(localStorage.getItem('saved_students') || '[]');
                      if (saved.find((s: any) => s.id === profileUser.id)) {
                        const filtered = saved.filter((s: any) => s.id !== profileUser.id);
                        localStorage.setItem('saved_students', JSON.stringify(filtered));
                        toast.success("Student removed from your list");
                      } else {
                        saved.push({ id: profileUser.id, name: profileUser.name, avatar: profileUser.avatar_url, skills: profileUser.skills });
                        localStorage.setItem('saved_students', JSON.stringify(saved));
                        toast.success("Student saved to your list!");
                      }
                      window.dispatchEvent(new Event('storage')); // Trigger update
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 font-bold"
                  >
                    <Heart className="w-5 h-5" />
                    Save Student
                  </button>
                )}
              </div>

              {editing ? (
                <div className="mb-4 space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground/70">Bio</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Tell clients and students about this profile..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground/70">Skills</label>
                    <input
                      value={editSkills}
                      onChange={(e) => setEditSkills(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="React, Laravel, UI Design"
                    />
                    <p className="text-sm text-foreground/60 mt-2">Separate skills with commas.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 mb-4">
                  {(profileUser?.skills ?? []).slice(0, 8).map((s) => (
                    <span key={s} className="px-4 py-2 rounded-full bg-primary/10 text-primary">
                      {s}
                    </span>
                  ))}
                  {(profileUser?.skills ?? []).length === 0 && (
                    <span className="text-foreground/60">No skills added yet.</span>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4 text-foreground/60">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profileUser?.email ?? ""}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profileUser?.bio ? "Bio set" : "No bio yet"}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {profileUser?.created_at ? new Date(profileUser.created_at).toLocaleDateString() : ""}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="mb-8">
          <div className="flex gap-4 border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Completed Tasks
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'resume'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Resume
            </button>
          </div>
        </div>
        {activeTab === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t("portfolio") || "Portfolio"}</h2>
              {canEditProfile && (
                <button 
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 text-sm font-bold"
                >
                  <Plus className="w-4 h-4" />
                  {isAddingProject ? "Cancel" : "Add Project"}
                </button>
              )}
            </div>

            {isAddingProject && (
              <div className="mb-8 bg-card rounded-2xl p-6 border border-primary/20 space-y-4">
                <input 
                  type="text" 
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-input border border-border focus:border-primary outline-none"
                />
                <textarea 
                  placeholder="Short Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-input border border-border focus:border-primary outline-none resize-none"
                  rows={2}
                />
                <input 
                  type="text" 
                  placeholder="Image URL (Optional)"
                  value={newProject.image}
                  onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-input border border-border focus:border-primary outline-none"
                />
                <button 
                  onClick={handleAddProject}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
                >
                  Save Project
                </button>
              </div>
            )}

            {portfolioProjects.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl text-foreground/40 italic">
                No portfolio projects added yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {portfolioProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all group relative"
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
                    {canEditProfile && (
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold mb-1">{review.author}</div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-foreground/60">{review.date}</span>
                  </div>
                  <p className="text-foreground/80">{review.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Completed Tasks</h2>
            <div className="space-y-4">
              {(profileUser?.tasksAsStudent ?? []).length === 0 ? (
                <div className="bg-card rounded-2xl p-6 border border-border text-foreground/60">
                  No completed tasks yet.
                </div>
              ) : (
                (profileUser?.tasksAsStudent ?? []).map((task) => (
                  <div key={task.id} className="bg-card rounded-2xl p-6 border border-border flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link to={`/task/${task.id}`} className="font-bold mb-1 hover:text-primary transition-colors block">
                        {task.title}
                      </Link>
                      <p className="text-sm text-foreground/60">
                        Completed {task.updated_at ? new Date(task.updated_at).toLocaleDateString() : ""}
                        {task.client?.name ? ` • Posted by ${task.client.name}` : ""}
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm whitespace-nowrap">
                      Completed
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
        {activeTab === 'resume' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Resume</h2>

            {!resumeMode && !uploadedFile && isResumeOwner && (
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => setResumeMode('upload')}
                  className="bg-card rounded-2xl p-8 border border-border hover:border-primary transition-all group"
                >
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Upload Resume</h3>
                  <p className="text-foreground/60">Upload your existing resume (PDF or DOCX)</p>
                </button>

                <button
                  onClick={() => setResumeMode('manual')}
                  className="bg-card rounded-2xl p-8 border border-border hover:border-primary transition-all group"
                >
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Create Resume</h3>
                  <p className="text-foreground/60">Build your resume manually using our form</p>
                </button>
              </div>
            )}

            {!isResumeOwner && hasAnyResume && (
              <div className="space-y-6">
                {hasUploadedResume && (
                  <div className="bg-card rounded-2xl p-8 border border-border">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <FileText className="w-12 h-12 text-primary" />
                        <div>
                          <h3 className="text-xl font-bold">{profileUser?.resume_file_name}</h3>
                          <p className="text-sm text-foreground/60">Uploaded resume</p>
                        </div>
                      </div>
                      <a
                        href={profileUser?.resume_url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        View File
                      </a>
                    </div>
                  </div>
                )}

                {hasManualResume && (
                  <div className="bg-card rounded-2xl p-8 border border-border space-y-8">
                    {profileUser?.resume_manual?.summary && (
                      <div>
                        <h3 className="text-xl font-bold mb-3">Professional Summary</h3>
                        <p className="text-foreground/70 leading-relaxed">{profileUser.resume_manual.summary}</p>
                      </div>
                    )}

                    {(profileUser?.resume_manual?.experience?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4">Work Experience</h3>
                        <div className="space-y-4">
                          {profileUser?.resume_manual?.experience.map((item, index) => (
                            <div key={`${item.company}-${index}`} className="rounded-xl border border-border p-4">
                              <div className="font-semibold">{item.position || item.company}</div>
                              <div className="text-sm text-foreground/60">
                                {[item.company, item.duration].filter(Boolean).join(" | ")}
                              </div>
                              {item.description && <p className="text-foreground/70 mt-2">{item.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(profileUser?.resume_manual?.education?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4">Education</h3>
                        <div className="space-y-4">
                          {profileUser?.resume_manual?.education.map((item, index) => (
                            <div key={`${item.school}-${index}`} className="rounded-xl border border-border p-4">
                              <div className="font-semibold">{item.degree || item.school}</div>
                              <div className="text-sm text-foreground/60">
                                {[item.school, item.year].filter(Boolean).join(" | ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(profileUser?.resume_manual?.skills?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-3">
                          {profileUser?.resume_manual?.skills.map((skill) => (
                            <span key={skill} className="px-4 py-2 rounded-full bg-primary/10 text-primary">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isResumeOwner && !hasAnyResume && (
              <div className="bg-card rounded-2xl p-8 border border-border text-foreground/60">
                No resume has been added yet.
              </div>
            )}

            {resumeMode === 'upload' && !uploadedFile && isResumeOwner && (
              <div className="bg-card rounded-2xl p-8 border border-border">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 hover:border-primary transition-all cursor-pointer">
                  <Upload className="w-16 h-16 text-primary mb-4" />
                  <p className="text-lg font-medium mb-2">Click to upload your resume</p>
                  <p className="text-sm text-foreground/60 mb-4">PDF or DOCX (Max 10MB)</p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                    Choose File
                  </button>
                </label>
                <button
                  onClick={() => setResumeMode(null)}
                  className="mt-4 px-6 py-3 rounded-xl bg-background hover:bg-muted transition-all"
                >
                  Cancel
                </button>
              </div>
            )}

            {uploadedFile && isResumeOwner && (
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <FileText className="w-12 h-12 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">{uploadedFile.name}</h3>
                      <p className="text-sm text-foreground/60">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setResumeMode(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Remove
                  </button>
                </div>
                <button
                  onClick={handleSaveUploadedResume}
                  disabled={savingResume}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  Save Resume
                </button>
              </div>
            )}

            {resumeMode === 'manual' && isResumeOwner && (
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="space-y-8">
                  <div>
                    <label className="block mb-3 font-medium">Professional Summary</label>
                    <textarea
                      value={manualResume.summary}
                      onChange={(e) => setManualResume({ ...manualResume, summary: e.target.value })}
                      placeholder="Brief overview of your professional background and goals..."
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      rows={4}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Work Experience</h3>
                      <button
                        onClick={addExperience}
                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Experience
                      </button>
                    </div>
                    <div className="space-y-4">
                      {manualResume.experience.map((exp, index) => (
                        <div key={index} className="bg-background/50 rounded-xl p-4 border border-border">
                          <div className="flex justify-end mb-2">
                            {index > 0 && (
                              <button
                                onClick={() => removeExperience(index)}
                                className="text-red-400 hover:text-red-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(index, "company", e.target.value)}
                              placeholder="Company Name"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateExperience(index, "position", e.target.value)}
                              placeholder="Position"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => updateExperience(index, "duration", e.target.value)}
                            placeholder="Duration (e.g., Jan 2023 - Present)"
                            className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all mb-4"
                          />
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Job description and achievements..."
                            className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Education</h3>
                      <button
                        onClick={addEducation}
                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Education
                      </button>
                    </div>
                    <div className="space-y-4">
                      {manualResume.education.map((edu, index) => (
                        <div key={index} className="bg-background/50 rounded-xl p-4 border border-border">
                          <div className="flex justify-end mb-2">
                            {index > 0 && (
                              <button
                                onClick={() => removeEducation(index)}
                                className="text-red-400 hover:text-red-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => updateEducation(index, "school", e.target.value)}
                              placeholder="School/University"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, "degree", e.target.value)}
                              placeholder="Degree"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateEducation(index, "year", e.target.value)}
                              placeholder="Year"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Skills</h3>
                      <button
                        onClick={addSkill}
                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {manualResume.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateResumeSkill(index, e.target.value)}
                            placeholder="e.g., React, Python, UI Design"
                            className="flex-1 px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => removeSkill(index)}
                              className="px-3 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSaveManualResume}
                      disabled={savingResume}
                      className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      Save Resume
                    </button>
                    <button
                      onClick={() => setResumeMode(null)}
                      className="px-6 py-3 rounded-xl bg-background hover:bg-muted transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!resumeMode && !uploadedFile && isResumeOwner && hasAnyResume && (
              <div className="space-y-6 mt-6">
                {hasUploadedResume && (
                  <div className="bg-card rounded-2xl p-8 border border-border">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <FileText className="w-12 h-12 text-primary" />
                        <div>
                          <h3 className="text-xl font-bold">{profileUser?.resume_file_name}</h3>
                          <p className="text-sm text-foreground/60">Uploaded resume</p>
                        </div>
                      </div>
                      <a
                        href={profileUser?.resume_url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl bg-background hover:bg-muted transition-all"
                      >
                        View File
                      </a>
                    </div>
                  </div>
                )}

                {hasManualResume && (
                  <div className="bg-card rounded-2xl p-8 border border-border space-y-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="text-xl font-bold">Manual Resume</h3>
                        <p className="text-sm text-foreground/60">Editable only from your own profile.</p>
                      </div>
                      <button
                        onClick={handleEditManualResume}
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        Edit Resume
                      </button>
                    </div>
                    {profileUser?.resume_manual?.summary && (
                      <p className="text-foreground/70 leading-relaxed">{profileUser.resume_manual.summary}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
