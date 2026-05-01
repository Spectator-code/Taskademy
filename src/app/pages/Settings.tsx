import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { 
  ArrowLeft, User, Bell, Shield, Palette, Globe, 
  Eye, EyeOff, Upload, Camera, Trash2, ShieldCheck,
  AlertTriangle, CheckCircle2, ChevronRight, Lock,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { userService } from "../services/user.service";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";

type Tab = "profile" | "notifications" | "security" | "appearance" | "language";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const { theme, setTheme, language, setLanguage } = useApp();
  const { t } = useTranslation();
  const userId = user?.id ?? null;

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const skills = useMemo(
    () => skillsText.split(",").map((v) => v.trim()).filter(Boolean),
    [skillsText]
  );

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setHeadline((user as any).headline ?? "");
    setLocation((user as any).location ?? "");
    setPortfolioUrl((user as any).portfolio_url ?? "");
    setBio(user.bio ?? "");
    setSkillsText(Array.isArray(user.skills) ? user.skills.join(", ") : "");
    setAvatarPreview(user.avatar_url ?? null);
  }, [user]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const onSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await userService.updateProfile(userId, { 
        name, bio, skills, headline, location, portfolio_url: portfolioUrl 
      } as any);
      
      if (avatarFile) {
        await userService.uploadAvatar(avatarFile);
      }
      
      const refreshedUser = await refreshUser();
      setAvatarFile(null);
      
      if (refreshedUser?.avatar_url) {
        setAvatarPreview(refreshedUser.avatar_url);
      }
      
      toast.success("Identity profile updated!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Configuration failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile" as Tab, label: t("profile"), icon: User, desc: "Personal identity & details" },
    { id: "notifications" as Tab, label: t("notifications"), icon: Bell, desc: "Alerts & email preferences" },
    { id: "security" as Tab, label: t("security"), icon: Shield, desc: "Passwords & protection" },
    { id: "appearance" as Tab, label: t("appearance"), icon: Palette, desc: "Theme & visual styling" },
    { id: "language" as Tab, label: t("language"), icon: Globe, desc: "Regional localization" },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-500 ${checked ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted border border-border"}`}
    >
      <motion.div 
        animate={{ x: checked ? 26 : 2 }}
        className={`absolute top-1 w-4 h-4 rounded-full shadow-md ${checked ? 'bg-primary-foreground' : 'bg-foreground/40'}`}
      />
    </button>
  );

  const inputClass = "w-full px-6 py-4 rounded-[1.5rem] bg-muted/40 border border-border focus:border-primary/40 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all text-sm font-medium placeholder:text-foreground/20";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary mb-4 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Command
              </Link>
              <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
                Control Center
              </h1>
              <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Synchronize your account & preferences</p>
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-muted/30 border border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">System Ready</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <motion.nav 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-80 flex flex-col gap-2 shrink-0"
            >
              {tabs.map((tab, idx) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-start gap-4 p-5 rounded-[2rem] transition-all duration-500 text-left ${
                    activeTab === tab.id
                      ? "bg-primary/10 border border-primary/20 shadow-xl shadow-primary/5"
                      : "bg-muted/30 border border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-foreground/20 group-hover:text-foreground/40"
                  }`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black tracking-tight mb-0.5 ${activeTab === tab.id ? "text-primary" : "text-foreground/60"}`}>
                      {tab.label}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{tab.desc}</p>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-nav" className="absolute right-6 top-1/2 -translate-y-1/2 text-primary">
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.nav>

            {/* Content Area */}
            <motion.div
              layout
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 bg-card/40 backdrop-blur-3xl rounded-[3rem] border border-border p-10 shadow-2xl shadow-black/5 overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <h2 className="text-2xl font-black mb-1">{t("profileInfo") || "Identity Configuration"}</h2>
                        <p className="text-sm text-foreground/40 font-medium">Define how you appear within the ecosystem.</p>
                      </div>
                      
                      <div 
                        className="relative group shrink-0"
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                      >
                        <motion.div 
                          animate={{ 
                            scale: isDragging ? 1.1 : 1,
                            borderColor: isDragging ? "var(--primary)" : "var(--border)"
                          }}
                          className={`w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 shadow-2xl transition-all duration-500 group-hover:scale-105 relative ${isDragging ? 'ring-8 ring-primary/20' : ''}`}
                        >
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-primary/40" />
                          )}
                          
                          {isDragging && (
                            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center">
                              <Plus className="w-8 h-8 text-white animate-bounce" />
                            </div>
                          )}
                        </motion.div>
                        <label className="absolute -right-2 -bottom-2 p-3 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 cursor-pointer hover:scale-110 active:scale-95 transition-all">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                            className="hidden"
                          />
                        </label>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <p className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isDragging ? 'opacity-100 text-primary' : 'opacity-0'}`}>Drop Image Now</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Public Name</label>
                          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Full name" />
                        </div>
                        <div>
                          <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Professional Headline</label>
                          <input value={headline} onChange={(e) => setHeadline(e.target.value)} className={inputClass} placeholder="e.g. Creative Director" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Base Location</label>
                          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="e.g. Manila, PH" />
                        </div>
                        <div>
                          <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Portfolio / URL</label>
                          <input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className={inputClass} placeholder="https://yourwork.com" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Bio / Overview</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          maxLength={300}
                          className={`${inputClass} resize-none`}
                          placeholder="Brief mission statement..."
                        />
                        <div className="mt-2 flex justify-end">
                          <span className="text-[10px] font-black tracking-widest text-foreground/20">{bio.length}/300</span>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Verified Email</label>
                        <div className="relative group">
                          <input value={user?.email ?? ""} disabled className={`${inputClass} opacity-40 cursor-not-allowed`} />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-foreground/20 mt-3 uppercase tracking-widest ml-2">Primary protocol address. Non-editable.</p>
                      </div>

                      <div>
                        <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Skill Matrix</label>
                        <input
                          value={skillsText}
                          onChange={(e) => setSkillsText(e.target.value)}
                          placeholder="Type skills separated by commas..."
                          className={inputClass}
                        />
                        <div className="flex flex-wrap gap-2 mt-4">
                          {skills.map((skill) => (
                            <span key={skill} className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onSaveProfile}
                      disabled={saving || !userId}
                      className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                    >
                      {saving ? "Processing..." : "Commit Changes"}
                    </button>
                  </motion.div>
                )}

                {activeTab === "notifications" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t("notifPreferences") || "Transmission Protocols"}</h2>
                      <p className="text-sm text-foreground/40 font-medium">Control how and when you receive system signals.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Global Email Sync", desc: "Critical platform updates and summaries", checked: emailNotifs, set: setEmailNotifs },
                        { label: "Task Intelligence", desc: "Live status updates for your active projects", checked: taskUpdates, set: setTaskUpdates },
                        { label: "Real-time Messaging", desc: "Instant alerts for direct and team chats", checked: messageAlerts, set: setMessageAlerts },
                        { label: "Community Insights", desc: "Curated news, tips, and platform highlights", checked: marketingEmails, set: setMarketingEmails },
                      ].map((item) => (
                        <div key={item.label} className="p-6 rounded-[2rem] bg-muted/30 border border-border flex items-center justify-between group hover:border-primary/20 transition-all duration-500">
                          <div>
                            <h4 className="font-black text-sm tracking-tight mb-1 group-hover:text-primary transition-colors">{item.label}</h4>
                            <p className="text-xs text-foreground/40 font-medium">{item.desc}</p>
                          </div>
                          <Toggle checked={item.checked} onChange={item.set} />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => toast.success("Signal protocols updated!")}
                      className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-primary/20"
                    >
                      Update Signal Config
                    </button>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t("securitySettings") || "Defense Matrix"}</h2>
                      <p className="text-sm text-foreground/40 font-medium">Manage access credentials and account protection.</p>
                    </div>

                    <div className="grid gap-8">
                      <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Lock className="w-5 h-5 text-primary" />
                          <h3 className="font-black text-sm uppercase tracking-widest">Protocol Encryption</h3>
                        </div>
                        
                        <div>
                          <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Current Key</label>
                          <div className="relative">
                            <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClass} pr-16 bg-card/20`} placeholder="••••••••" />
                            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-primary transition-colors">
                              {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">New Access Key</label>
                            <div className="relative">
                              <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pr-16 bg-card/20`} placeholder="Min. 8 chars" />
                              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-primary transition-colors">
                                {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-2">Re-verify Key</label>
                            <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={`${inputClass} bg-card/20`} placeholder="Confirm new key" />
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            if (newPassword === confirmNewPassword && newPassword.length >= 8) {
                              toast.success("Security keys rotated successfully.");
                              setNewPassword(""); setCurrentPassword(""); setConfirmNewPassword("");
                            } else {
                              toast.error("Verification failed. Check your inputs.");
                            }
                          }}
                          className="w-full py-4 rounded-2xl bg-muted/50 border border-border text-foreground/60 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          Rotate Security Keys
                        </button>
                      </div>

                      <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-4">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <h3 className="font-black text-sm uppercase tracking-widest text-red-500">Destruction Sequence</h3>
                        </div>
                        <p className="text-xs text-foreground/40 font-medium leading-relaxed">
                          Permanently terminate this identity and all associated data records. This action is irreversible.
                        </p>
                        <button className="px-8 py-3 rounded-2xl border-2 border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                          Deactivate System Identity
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "appearance" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t("appearance") || "Visual Synthesis"}</h2>
                      <p className="text-sm text-foreground/40 font-medium">Customize the platform's visual projection.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {(["modern", "minimalist"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setTheme(v)}
                          className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 group overflow-hidden ${
                            theme === v 
                              ? "border-primary bg-primary/10 shadow-2xl shadow-primary/10" 
                              : "border-border bg-muted/30 hover:border-border"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 ${
                            theme === v ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-foreground/20 group-hover:text-foreground/40'
                          }`}>
                            <Palette className="w-6 h-6" />
                          </div>
                          <h4 className={`text-lg font-black mb-1 ${theme === v ? 'text-primary' : 'text-foreground/60'}`}>{v}</h4>
                          <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest">
                            {v === 'modern' ? 'Glass & Gradients' : 'Clean & Precise'}
                          </p>
                          {theme === v && (
                            <motion.div layoutId="theme-check" className="absolute top-8 right-8 text-primary">
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "language" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t("languageRegion") || "Localization Matrix"}</h2>
                      <p className="text-sm text-foreground/40 font-medium">Select your preferred communication protocol.</p>
                    </div>

                    <div className="grid gap-3">
                      {[
                        { value: "en", label: "Standard English", desc: "US/UK Global standard" },
                        { value: "fil", label: "Tagalog / Filipino", desc: "Local region dialect" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setLanguage(opt.value)}
                          className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 group ${
                            language === opt.value
                              ? "border-primary/40 bg-primary/10 shadow-xl shadow-primary/5"
                              : "border-border bg-muted/30 hover:border-border"
                          }`}
                        >
                          <div className="text-left">
                            <h4 className={`font-black text-sm tracking-tight ${language === opt.value ? 'text-primary' : 'text-foreground/60'}`}>{opt.label}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/20">{opt.desc}</p>
                          </div>
                          {language === opt.value ? (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-all" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
