import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", type: 'info' as const });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('platform_announcements');
    if (saved) {
      setAnnouncements(JSON.parse(saved));
    } else {
      // Default announcements
      const defaults: Announcement[] = [
        { id: '1', title: 'Welcome to Taskademy 2.0!', content: 'Check out our new features and improved dashboard.', date: new Date().toISOString(), type: 'info' },
        { id: '2', title: 'New Category Added', content: 'You can now post and browse tasks in the "Administrative" category.', date: new Date().toISOString(), type: 'success' }
      ];
      setAnnouncements(defaults);
      localStorage.setItem('platform_announcements', JSON.stringify(defaults));
    }
  }, []);

  const handleAdd = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error("Please fill in all fields");
      return;
    }

    const announcement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAnnouncement,
      date: new Date().toISOString()
    };

    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('platform_announcements', JSON.stringify(updated));
    setNewAnnouncement({ title: "", content: "", type: 'info' });
    setIsAdding(false);
    toast.success("Announcement published!");
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('platform_announcements', JSON.stringify(updated));
    toast.success("Announcement removed");
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Platform Announcements</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 text-sm font-bold"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> New Announcement</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6 space-y-4">
              <input
                type="text"
                placeholder="Announcement Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
              />
              <textarea
                placeholder="Content..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                rows={3}
              />
              <div className="flex items-center gap-4">
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                  className="px-4 py-2 rounded-lg bg-background border border-border outline-none"
                >
                  <option value="info">Information (Blue)</option>
                  <option value="success">Success (Green)</option>
                  <option value="warning">Warning (Amber)</option>
                </select>
                <button
                  onClick={handleAdd}
                  className="ml-auto px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-center py-8 text-foreground/60 italic">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 group ${
                a.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 
                a.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex-1">
                <div className={`font-bold mb-1 ${
                  a.type === 'warning' ? 'text-amber-500' : 
                  a.type === 'success' ? 'text-emerald-500' : 
                  'text-primary'
                }`}>
                  {a.title}
                </div>
                <p className="text-sm text-foreground/70">{a.content}</p>
                <div className="text-[10px] text-foreground/40 mt-2">
                  {new Date(a.date).toLocaleDateString()} at {new Date(a.date).toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
