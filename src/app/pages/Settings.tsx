import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { userService } from "../services/user.service";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const skills = useMemo(
    () =>
      skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skillsText]
  );

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setBio(user.bio ?? "");
    setSkillsText(Array.isArray(user.skills) ? user.skills.join(", ") : "");
  }, [user]);

  const onSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      if (avatarFile) {
        await userService.uploadAvatar(avatarFile);
      }

      await userService.updateProfile(userId, {
        name,
        bio,
        skills,
      });

      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          Back to Dashboard
        </Link>

        <div className="bg-card rounded-2xl p-8 border border-border">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-foreground/60 mb-8">Update your profile details.</p>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Skills</label>
              <input
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. React, Laravel, UI Design"
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-sm text-foreground/60 mt-2">Comma-separated.</p>
            </div>

            <div>
              <label className="block mb-2 font-medium">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-foreground/70"
              />
            </div>

            <button
              onClick={onSave}
              disabled={saving || !userId}
              className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

