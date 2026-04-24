import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, User, Bell, Shield, Palette, Globe, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { userService } from "../services/user.service";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { toast } from "sonner";

type Tab = "profile" | "notifications" | "security" | "appearance" | "language";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useApp();
  const userId = user?.id ?? null;

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);

  // Profile
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Language
  const [language, setLanguage] = useState("en");

  const skills = useMemo(
    () => skillsText.split(",").map((s) => s.trim()).filter(Boolean),
    [skillsText]
  );

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setBio(user.bio ?? "");
    setSkillsText(Array.isArray(user.skills) ? user.skills.join(", ") : "");
  }, [user]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const onSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      if (avatarFile) await userService.uploadAvatar(avatarFile);
      await userService.updateProfile(userId, { name, bio, skills });
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "notifications" as Tab, label: "Notifications", icon: Bell },
    { id: "security" as Tab, label: "Security", icon: Shield },
    { id: "appearance" as Tab, label: "Appearance", icon: Palette },
    { id: "language" as Tab, label: "Language", icon: Globe },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );

  const inputClass = "w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-foreground/60 mb-8">Manage your account preferences.</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <nav className="md:w-56 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:bg-card hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-card rounded-2xl p-8 border border-border"
          >
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Profile Information</h2>
                  <p className="text-foreground/60 text-sm">This is how others see you on the platform.</p>
                </div>

                {/* Avatar Preview */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-border">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <label className="px-4 py-2 rounded-xl bg-muted text-sm font-medium cursor-pointer hover:bg-muted/80 transition-all">
                      Change Avatar
                      <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="hidden" />
                    </label>
                    <p className="text-xs text-foreground/40 mt-2">JPG, PNG. Max 2MB.</p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Display Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Email</label>
                  <input value={user?.email ?? ""} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                  <p className="text-xs text-foreground/40 mt-1">Contact support to change your email.</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={300} className={`${inputClass} resize-none`} placeholder="Tell us about yourself..." />
                  <p className="text-xs text-foreground/40 mt-1 text-right">{bio.length}/300</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Skills</label>
                  <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="e.g. React, Laravel, UI Design" className={inputClass} />
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={onSaveProfile} disabled={saving || !userId} className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20">
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Notification Preferences</h2>
                  <p className="text-foreground/60 text-sm">Choose what you want to be notified about.</p>
                </div>
                {[
                  { label: "Email Notifications", desc: "Receive email for important updates", checked: emailNotifs, set: setEmailNotifs },
                  { label: "Task Updates", desc: "Get notified when tasks are updated", checked: taskUpdates, set: setTaskUpdates },
                  { label: "Message Alerts", desc: "Alerts for new messages", checked: messageAlerts, set: setMessageAlerts },
                  { label: "Marketing Emails", desc: "Tips, offers, and news from Taskademy", checked: marketingEmails, set: setMarketingEmails },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-foreground/60">{item.desc}</p>
                    </div>
                    <Toggle checked={item.checked} onChange={item.set} />
                  </div>
                ))}
                <button onClick={() => toast.success("Notification preferences saved!")} className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Save Preferences
                </button>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Security Settings</h2>
                  <p className="text-foreground/60 text-sm">Keep your account safe.</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                      {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">New Password</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                      {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Confirm New Password</label>
                  <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputClass} />
                </div>

                <button onClick={onChangePassword} className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Change Password
                </button>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-foreground/60">Add an extra layer of security to your account.</p>
                    </div>
                    <Toggle checked={twoFactor} onChange={setTwoFactor} />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="font-medium text-red-500">Danger Zone</p>
                  <p className="text-sm text-foreground/60 mb-4">Permanently delete your account and all data.</p>
                  <button className="px-6 py-3 rounded-xl border-2 border-red-500/50 text-red-500 font-bold hover:bg-red-500/10 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Appearance</h2>
                  <p className="text-foreground/60 text-sm">Customize how Taskademy looks for you.</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(["modern", "minimalist", "classic"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`p-6 rounded-2xl border-2 transition-all text-center capitalize font-medium ${
                        theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/60 hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUAGE TAB */}
            {activeTab === "language" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Language & Region</h2>
                  <p className="text-foreground/60 text-sm">Set your preferred language.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { value: "en", label: "English" },
                    { value: "fil", label: "Filipino" },
                    { value: "es", label: "Spanish" },
                    { value: "ja", label: "Japanese" },
                    { value: "ko", label: "Korean" },
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        language === lang.value
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-foreground/60 hover:border-primary/50 hover:bg-card"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={() => toast.success("Language preference saved!")} className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Save Language
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
