import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { defaultAds } from "../AdvertisementCarousel";

interface Ad {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
}

interface CarouselSettings {
  autoPlaySpeed: number;
  pauseOnHover: boolean;
  transitionEffect: 'slide' | 'fade';
  showControls: boolean;
  isVisible: boolean;
}

const defaultSettings: CarouselSettings = {
  autoPlaySpeed: 6,
  pauseOnHover: true,
  transitionEffect: 'slide',
  showControls: true,
  isVisible: true
};

export default function AdvertisementManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Ad>>({});
  const [isAdding, setIsAdding] = useState(false);

  const [settings, setSettings] = useState<CarouselSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("taskademy_ads");
    if (stored) {
      try {
        setAds(JSON.parse(stored));
      } catch (e) {
        setAds(defaultAds);
      }
    } else {
      setAds(defaultAds);
    }

    const storedSettings = localStorage.getItem("taskademy_carousel_settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {}
    }
  }, []);

  const updateSettings = (newSettings: Partial<CarouselSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("taskademy_carousel_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    toast.success("Carousel settings updated.");
  };

  const saveToStorage = (data: Ad[]) => {
    localStorage.setItem("taskademy_ads", JSON.stringify(data));
    window.dispatchEvent(new Event("storage"));
  };

  const handleSave = () => {
    if (!editForm.title || !editForm.imageUrl || !editForm.link) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let updatedList: Ad[];
    
    if (isAdding) {
      const newAd: Ad = {
        id: Date.now(),
        title: editForm.title,
        imageUrl: editForm.imageUrl,
        link: editForm.link,
      };
      updatedList = [...ads, newAd];
      toast.success("Advertisement added successfully!");
    } else {
      updatedList = ads.map(a => 
        a.id === editingId ? { ...a, ...editForm } as Ad : a
      );
      toast.success("Advertisement updated successfully!");
    }

    setAds(updatedList);
    saveToStorage(updatedList);
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      const updatedList = ads.filter(a => a.id !== id);
      setAds(updatedList);
      saveToStorage(updatedList);
      toast.success("Advertisement deleted.");
    }
  };

  const startEdit = (ad: Ad) => {
    setEditingId(ad.id);
    setEditForm(ad);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ title: "", imageUrl: "", link: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-card rounded-2xl p-6 border border-border mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Manage Advertisements</h2>
          <p className="text-sm text-foreground/60">Update the banner ads shown on the landing page.</p>
        </div>
        <button
          onClick={startAdd}
          disabled={isAdding || editingId !== null}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add New Ad
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <div className="p-4 bg-muted/30 border border-primary/30 rounded-xl space-y-4 relative">
            <h3 className="font-bold text-primary">Add New Advertisement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Title (e.g., Premium Student Tools) *" 
                value={editForm.title || ""} 
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <input 
                placeholder="Link URL (e.g., /register or https://...) *" 
                value={editForm.link || ""} 
                onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <input 
                placeholder="Image URL (Unsplash or direct link) *" 
                value={editForm.imageUrl || ""} 
                onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm md:col-span-2"
              />
            </div>
            {editForm.imageUrl && (
              <div className="w-full h-32 rounded-lg bg-black/10 overflow-hidden relative border border-border mt-2">
                <img src={editForm.imageUrl} className="w-full h-full object-cover opacity-50" alt="Preview" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-white drop-shadow-md">
                  Preview
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={cancelEdit} className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        )}

        {ads.map((ad) => (
          <div key={ad.id} className="p-4 bg-background/50 border border-border rounded-xl">
            {editingId === ad.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    placeholder="Title *" 
                    value={editForm.title || ""} 
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input 
                    placeholder="Link URL *" 
                    value={editForm.link || ""} 
                    onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input 
                    placeholder="Image URL *" 
                    value={editForm.imageUrl || ""} 
                    onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm md:col-span-2"
                  />
                </div>
                {editForm.imageUrl && (
                  <div className="w-full h-32 rounded-lg bg-black/10 overflow-hidden relative border border-border mt-2">
                    <img src={editForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={cancelEdit} className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-24 rounded-lg bg-black/10 overflow-hidden relative border border-border shrink-0">
                  <img src={ad.imageUrl} className="w-full h-full object-cover" alt={ad.title} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-lg mb-1">{ad.title}</div>
                      <a href={ad.link} target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center gap-1 hover:underline">
                        {ad.link} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(ad)} className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ad.id)} className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-12 p-6 bg-secondary/20 rounded-2xl border border-border">
          <h3 className="text-lg font-bold mb-4">Carousel Behavior Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/60">Auto-play Speed (seconds)</label>
              <input 
                type="number" 
                min="1" 
                max="30"
                value={settings.autoPlaySpeed}
                onChange={(e) => updateSettings({ autoPlaySpeed: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/60">Transition Effect</label>
              <select 
                value={settings.transitionEffect}
                onChange={(e) => updateSettings({ transitionEffect: e.target.value as 'slide' | 'fade' })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                <option value="slide">Slide (Horizontal)</option>
                <option value="fade">Smooth Fade</option>
              </select>
            </div>

            <div className="flex flex-col gap-4 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={settings.pauseOnHover}
                  onChange={(e) => updateSettings({ pauseOnHover: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Pause on Hover</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={settings.showControls}
                  onChange={(e) => updateSettings({ showControls: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Show Controls & Dots</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={settings.isVisible}
                  onChange={(e) => updateSettings({ isVisible: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors text-primary font-bold">Enabled (Global Toggle)</span>
              </label>
            </div>
          </div>
        </div>
        {ads.length === 0 && !isAdding && (
          <div className="text-foreground/60 text-center py-6">No advertisements active.</div>
        )}
      </div>
    </motion.div>
  );
}
