import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Mail, MapPin, Calendar, ExternalLink, Upload, FileText, Plus, X } from "lucide-react";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'tasks' | 'resume'>('portfolio');
  const [resumeMode, setResumeMode] = useState<'upload' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualResume, setManualResume] = useState({
    summary: "",
    experience: [{ company: "", position: "", duration: "", description: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: [""]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
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

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
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
        )}

        {/* Reviews Tab */}
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

        {/* Completed Tasks Tab */}
        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Completed Tasks</h2>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div key={task.id} className="bg-card rounded-2xl p-6 border border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-bold mb-1">{task.title}</h3>
                    <p className="text-sm text-foreground/60">Completed {task.completed}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Resume</h2>

            {!resumeMode && !uploadedFile && (
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

            {resumeMode === 'upload' && !uploadedFile && (
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

            {uploadedFile && (
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
                <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                  Save Resume
                </button>
              </div>
            )}

            {resumeMode === 'manual' && (
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="space-y-8">
                  {/* Summary */}
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

                  {/* Experience */}
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
                              placeholder="Company Name"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                              type="text"
                              placeholder="Position"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Duration (e.g., Jan 2023 - Present)"
                            className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all mb-4"
                          />
                          <textarea
                            placeholder="Job description and achievements..."
                            className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
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
                              placeholder="School/University"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                              type="text"
                              placeholder="Degree"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                              type="text"
                              placeholder="Year"
                              className="px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
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

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
