import { useState, useEffect } from "react";
import { motion, Reorder } from "motion/react";
import { Plus, Trash2, Edit2, Save, ExternalLink, GripVertical, Image as ImageIcon, Video, Power, UploadCloud, Settings, Zap, Repeat, Eye, Play, MousePointer2 } from "lucide-react";
import { toast } from "sonner";
import { defaultAds } from "../AdvertisementCarousel";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

interface Ad {
  id: number;
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  link?: string;
  ctaText?: string;
  isActive?: boolean;
}

interface CarouselSettings {
  autoPlaySpeed: number;
  pauseOnHover: boolean;
  transitionEffect: 'slide' | 'fade';
  showControls: boolean;
  isVisible: boolean;
  autoPlay: boolean;
  overlayOpacity: number;
  loop: boolean;
}

const defaultSettings: CarouselSettings = {
  autoPlaySpeed: 6,
  pauseOnHover: true,
  transitionEffect: 'slide',
  showControls: true,
  isVisible: true,
  autoPlay: true,
  overlayOpacity: 80,
  loop: true
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
        const parsedAds = JSON.parse(stored);
        setAds(parsedAds.map((a: any) => ({ ...a, isActive: a.isActive !== false, mediaType: a.mediaType || 'image' })));
      } catch (e) {
        setAds(defaultAds as Ad[]);
      }
    } else {
      setAds(defaultAds as Ad[]);
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
    try {
      localStorage.setItem("taskademy_ads", JSON.stringify(data));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      toast.error("Failed to save. If you uploaded a large video, it might exceed local storage limits. Please use a URL instead.");
    }
  };

  const handleSave = () => {
    if (!editForm.imageUrl && !editForm.videoUrl) {
      toast.error("Please provide an image or video URL.");
      return;
    }

    let updatedList: Ad[];
    
    if (isAdding) {
      const newAd: Ad = {
        id: Date.now(),
        title: editForm.title || "",
        imageUrl: editForm.imageUrl || "",
        link: editForm.link || "",
        videoUrl: editForm.videoUrl,
        mediaType: editForm.mediaType || 'image',
        ctaText: editForm.ctaText,
        isActive: editForm.isActive !== false
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

  const handleReorder = (reorderedAds: Ad[]) => {
    setAds(reorderedAds);
    saveToStorage(reorderedAds);
  };

  const toggleActive = (id: number) => {
    const updatedList = ads.map(a => 
      a.id === id ? { ...a, isActive: a.isActive === false ? true : false } as Ad : a
    );
    setAds(updatedList);
    saveToStorage(updatedList);
    toast.success("Advertisement status updated.");
  };

  const startEdit = (ad: Ad) => {
    setEditingId(ad.id);
    setEditForm({ ...ad, mediaType: ad.mediaType || 'image', isActive: ad.isActive !== false });
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ title: "", imageUrl: "", link: "", mediaType: 'image', isActive: true, ctaText: "Learn More" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
  };

  const handleFileSelected = (file: File) => {
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({ ...editForm, mediaType: 'video', videoUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({ ...editForm, mediaType: 'image', imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Unsupported file type. Please upload an image or video.");
    }
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
                placeholder="Title (e.g., Premium Student Tools)" 
                value={editForm.title || ""} 
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <input 
                placeholder="Link URL (e.g., /register or https://...)" 
                value={editForm.link || ""} 
                onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${editForm.mediaType === 'image' || !editForm.mediaType ? 'bg-primary/10 border-primary text-primary' : 'border-border text-foreground/60'}`}
                  onClick={() => setEditForm({...editForm, mediaType: 'image'})}
                >
                  <ImageIcon className="w-4 h-4" /> Image Ad
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${editForm.mediaType === 'video' ? 'bg-primary/10 border-primary text-primary' : 'border-border text-foreground/60'}`}
                  onClick={() => setEditForm({...editForm, mediaType: 'video'})}
                >
                  <Video className="w-4 h-4" /> Video Ad
                </button>
              </div>
              <div 
                className={`md:col-span-2 border-2 border-dashed ${editForm.imageUrl ? 'border-primary bg-primary/10' : 'border-primary/40 hover:border-primary bg-primary/5'} rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all relative group overflow-hidden`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('ad-file-upload')?.click()}
              >
                {editForm.imageUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      {editForm.mediaType === 'video' ? <Video className="w-8 h-8 text-primary" /> : <ImageIcon className="w-8 h-8 text-primary" />}
                    </div>
                    <p className="text-sm font-bold text-primary">Media Selected</p>
                    <p className="text-xs text-foreground/60 group-hover:text-primary transition-colors">Click or drag to replace</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">Drag & drop your picture or video here</p>
                    <p className="text-xs text-foreground/60 mt-1">or click to browse files</p>
                  </>
                )}
                <input 
                  id="ad-file-upload" 
                  type="file" 
                  accept={editForm.mediaType === 'video' ? "video/mp4,video/webm" : "image/*"} 
                  className="hidden" 
                  onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <hr className="flex-1 border-border" />
                <span className="text-xs text-foreground/40 uppercase font-bold">OR USE URL</span>
                <hr className="flex-1 border-border" />
              </div>

              <input 
                placeholder={editForm.mediaType === 'video' ? "Video URL (mp4, webm) *" : "Image URL (Unsplash or direct link) *"}
                value={editForm.mediaType === 'video' ? (editForm.videoUrl || "") : (editForm.imageUrl || "")} 
                onChange={(e) => {
                  if (editForm.mediaType === 'video') setEditForm({...editForm, videoUrl: e.target.value, imageUrl: editForm.imageUrl || 'https://via.placeholder.com/800x400?text=Video+Thumbnail'})
                  else setEditForm({...editForm, imageUrl: e.target.value})
                }}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm md:col-span-2"
              />
              <input 
                placeholder="Call to Action Text (e.g. Learn More)" 
                value={editForm.ctaText || ""} 
                onChange={(e) => setEditForm({...editForm, ctaText: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <label className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm cursor-pointer">
                <input type="checkbox" checked={editForm.isActive !== false} onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} className="w-4 h-4" />
                Active Advertisement
              </label>
            </div>
            {(editForm.imageUrl || editForm.videoUrl) && (
              <div className="w-full h-32 rounded-lg bg-black/10 overflow-hidden relative border border-border mt-2">
                {editForm.mediaType === 'video' ? (
                  <video src={editForm.videoUrl} className="w-full h-full object-cover opacity-50" muted playsInline />
                ) : (
                  <img src={editForm.imageUrl} className="w-full h-full object-cover opacity-50" alt="Preview" />
                )}
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

        <Reorder.Group axis="y" values={ads} onReorder={handleReorder} className="space-y-4">
          {ads.map((ad) => (
            <Reorder.Item key={ad.id} value={ad} className={`p-4 border rounded-xl flex gap-3 ${ad.isActive === false ? 'bg-background/30 border-border/50 opacity-75' : 'bg-background/50 border-border'} ${editingId === ad.id ? 'flex-col' : 'flex-row items-center'}`}>
              <div className="cursor-grab active:cursor-grabbing p-2 text-foreground/30 hover:text-foreground shrink-0 hidden md:flex items-center">
                <GripVertical className="w-5 h-5" />
              </div>
              
              {editingId === ad.id ? (
                <div className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      placeholder="Title" 
                      value={editForm.title || ""} 
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                    />
                    <input 
                      placeholder="Link URL" 
                      value={editForm.link || ""} 
                      onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                    />
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${editForm.mediaType === 'image' || !editForm.mediaType ? 'bg-primary/10 border-primary text-primary' : 'border-border text-foreground/60'}`}
                        onClick={() => setEditForm({...editForm, mediaType: 'image'})}
                      >
                        <ImageIcon className="w-4 h-4" /> Image Ad
                      </button>
                      <button
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${editForm.mediaType === 'video' ? 'bg-primary/10 border-primary text-primary' : 'border-border text-foreground/60'}`}
                        onClick={() => setEditForm({...editForm, mediaType: 'video'})}
                      >
                        <Video className="w-4 h-4" /> Video Ad
                      </button>
                    </div>
                    <div 
                      className={`md:col-span-2 border-2 border-dashed ${editForm.imageUrl ? 'border-primary bg-primary/10' : 'border-primary/40 hover:border-primary bg-primary/5'} rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all relative group overflow-hidden`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById(`ad-file-upload-${ad.id}`)?.click()}
                    >
                      {editForm.imageUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            {editForm.mediaType === 'video' ? <Video className="w-8 h-8 text-primary" /> : <ImageIcon className="w-8 h-8 text-primary" />}
                          </div>
                          <p className="text-sm font-bold text-primary">Media Selected</p>
                          <p className="text-xs text-foreground/60 group-hover:text-primary transition-colors">Click or drag to replace</p>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-sm font-medium">Drag & drop your picture or video here</p>
                          <p className="text-xs text-foreground/60 mt-1">or click to browse files</p>
                        </>
                      )}
                      <input 
                        id={`ad-file-upload-${ad.id}`} 
                        type="file" 
                        accept={editForm.mediaType === 'video' ? "video/mp4,video/webm" : "image/*"} 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-4">
                      <hr className="flex-1 border-border" />
                      <span className="text-xs text-foreground/40 uppercase font-bold">OR USE URL</span>
                      <hr className="flex-1 border-border" />
                    </div>

                    <input 
                      placeholder={editForm.mediaType === 'video' ? "Video URL *" : "Image URL *"}
                      value={editForm.mediaType === 'video' ? (editForm.videoUrl || "") : (editForm.imageUrl || "")} 
                      onChange={(e) => {
                        if (editForm.mediaType === 'video') setEditForm({...editForm, videoUrl: e.target.value})
                        else setEditForm({...editForm, imageUrl: e.target.value})
                      }}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm md:col-span-2"
                    />
                    <input 
                      placeholder="Call to Action Text" 
                      value={editForm.ctaText || ""} 
                      onChange={(e) => setEditForm({...editForm, ctaText: e.target.value})}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm cursor-pointer">
                      <input type="checkbox" checked={editForm.isActive !== false} onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} className="w-4 h-4" />
                      Active Advertisement
                    </label>
                  </div>
                  {(editForm.imageUrl || editForm.videoUrl) && (
                    <div className="w-full h-32 rounded-lg bg-black/10 overflow-hidden relative border border-border mt-2">
                      {editForm.mediaType === 'video' ? (
                        <video src={editForm.videoUrl} className="w-full h-full object-cover" muted playsInline />
                      ) : (
                        <img src={editForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      )}
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
                <div className="flex flex-col md:flex-row gap-4 w-full items-center">
                  <div className="w-full md:w-48 h-24 rounded-lg bg-black/10 overflow-hidden relative border border-border shrink-0">
                    {ad.mediaType === 'video' ? (
                      <video src={ad.videoUrl || ad.imageUrl} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={ad.imageUrl} className="w-full h-full object-cover" alt={ad.title} />
                    )}
                    {ad.mediaType === 'video' && <div className="absolute top-2 right-2 bg-black/60 rounded p-1 text-white"><Video className="w-3 h-3"/></div>}
                  </div>
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg mb-1 flex items-center gap-2">
                          {ad.title} 
                          {ad.isActive === false && <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full">Inactive</span>}
                        </div>
                        <a href={ad.link} target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center gap-1 hover:underline">
                          {ad.link} <ExternalLink className="w-3 h-3" />
                        </a>
                        {ad.ctaText && <div className="text-xs text-foreground/60 mt-1">CTA: {ad.ctaText}</div>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => toggleActive(ad.id)} className={`p-2 rounded-lg transition-colors ${ad.isActive !== false ? 'text-green-500 hover:bg-green-500/10' : 'text-foreground/50 hover:bg-foreground/10'}`} title="Toggle Active">
                          <Power className="w-4 h-4" />
                        </button>
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
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="mt-16 p-8 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-primary/10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Carousel Behavior Settings</h3>
                <p className="text-sm text-foreground/60">Configure how advertisements are displayed globally.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Controls */}
              <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <Label className="text-sm font-bold uppercase tracking-wider text-foreground/50">Auto-play Speed</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="20"
                        step="1"
                        value={settings.autoPlaySpeed}
                        onChange={(e) => updateSettings({ autoPlaySpeed: parseInt(e.target.value) })}
                        className="flex-1 accent-primary"
                      />
                      <div className="w-12 h-10 rounded-xl bg-background border border-border flex items-center justify-center font-bold text-primary">
                        {settings.autoPlaySpeed}s
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-primary" />
                      <Label className="text-sm font-bold uppercase tracking-wider text-foreground/50">Transition Effect</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-background/50 border border-border rounded-xl">
                      <button
                        onClick={() => updateSettings({ transitionEffect: 'slide' })}
                        className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${settings.transitionEffect === 'slide' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-foreground/5 text-foreground/40'}`}
                      >
                        Slide
                      </button>
                      <button
                        onClick={() => updateSettings({ transitionEffect: 'fade' })}
                        className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${settings.transitionEffect === 'fade' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-foreground/5 text-foreground/40'}`}
                      >
                        Fade
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-bold uppercase tracking-wider text-foreground/50">Overlay Opacity (Darkness)</Label>
                  </div>
                  <div className="space-y-6">
                    <Slider
                      value={[settings.overlayOpacity]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(val) => updateSettings({ overlayOpacity: val[0] })}
                      className="py-4"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                      <span>Transparent (0%)</span>
                      <span className="text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{settings.overlayOpacity}% Opacity</span>
                      <span>Pitch Black (100%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="lg:col-span-5 bg-background/30 rounded-3xl p-6 border border-border/50 space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/30 mb-2">Global Toggles</h4>
                
                {[
                  { key: 'isVisible', label: 'Enabled (Global Toggle)', icon: Power, color: 'emerald' },
                  { key: 'autoPlay', label: 'Autoplay Carousel', icon: Play, color: 'blue' },
                  { key: 'loop', label: 'Loop Infinitely', icon: Repeat, color: 'purple' },
                  { key: 'pauseOnHover', label: 'Pause on Hover', icon: MousePointer2, color: 'amber' },
                  { key: 'showControls', label: 'Show Controls & Dots', icon: Eye, color: 'indigo' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl hover:bg-foreground/5 transition-colors group/item">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-${item.color}-500/10 flex items-center justify-center transition-transform group-hover/item:scale-110`}>
                        <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70 group-hover/item:text-foreground transition-colors">{item.label}</span>
                    </div>
                    <Switch 
                      checked={(settings as any)[item.key]} 
                      onCheckedChange={(val) => updateSettings({ [item.key]: val })}
                    />
                  </div>
                ))}
              </div>
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
