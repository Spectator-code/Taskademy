import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Save, Info, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
          <Megaphone className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Announcements</h2>
          <p className="text-sm text-foreground/60">Broadcast important messages to all users.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Creation Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border shadow-xl space-y-5 sticky top-24"
        >
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create Announcement
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider ml-1">Title</label>
              <input
                type="text"
                placeholder="e.g., Scheduled Maintenance"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-background/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider ml-1">Content</label>
              <textarea
                placeholder="What do users need to know?"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-background/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider ml-1">Priority Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'info', label: 'Info', color: 'blue', icon: Info },
                  { id: 'success', label: 'Update', color: 'emerald', icon: CheckCircle },
                  { id: 'warning', label: 'Urgent', color: 'amber', icon: AlertTriangle }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewAnnouncement({ ...newAnnouncement, type: type.id as any })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                      newAnnouncement.type === type.id 
                        ? `bg-${type.color}-500/10 border-${type.color}-500/50 text-${type.color}-500 ring-4 ring-${type.color}-500/5`
                        : 'bg-background/30 border-border text-foreground/40 hover:border-foreground/20'
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Megaphone className="w-5 h-5" />
              Broadcast Message
            </button>
          </div>
        </motion.div>

        {/* Announcements List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="font-bold text-foreground/60 flex items-center gap-2 text-sm uppercase tracking-widest">
              Live Announcements ({announcements.length})
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            {announcements.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center border-2 border-dashed border-border rounded-3xl bg-card/30"
              >
                <Megaphone className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                <p className="text-foreground/40 italic">No active announcements.</p>
              </motion.div>
            ) : (
              announcements.map((a, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  key={a.id}
                  className={`relative p-5 rounded-3xl border group transition-all hover:shadow-xl ${
                    a.type === 'warning' ? 'bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40' : 
                    a.type === 'success' ? 'bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40' : 
                    'bg-primary/[0.03] border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      a.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                      a.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      {a.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : 
                       a.type === 'success' ? <CheckCircle className="w-6 h-6" /> : 
                       <Info className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className={`font-bold text-lg truncate ${
                          a.type === 'warning' ? 'text-amber-500' : 
                          a.type === 'success' ? 'text-emerald-500' : 
                          'text-primary'
                        }`}>
                          {a.title}
                        </h4>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-2 rounded-xl bg-red-500/0 hover:bg-red-500/10 text-foreground/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-foreground/70 leading-relaxed pr-4">
                        {a.content}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-4 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(a.date).toLocaleDateString()}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-foreground/10" />
                        <div>{new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
