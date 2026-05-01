import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, Star, UploadCloud, Power, User, Quote } from "lucide-react";
import { toast } from "sonner";
import { defaultTestimonials } from "../Testimonials";
import { Badge } from "../ui/badge";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar: string;
  rating?: number;
  isActive?: boolean;
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("taskademy_testimonials");
    if (stored) {
      try {
        setTestimonials(JSON.parse(stored));
      } catch (e) {
        setTestimonials(defaultTestimonials);
      }
    } else {
      setTestimonials(defaultTestimonials);
    }
  }, []);

  const saveToStorage = (data: Testimonial[]) => {
    localStorage.setItem("taskademy_testimonials", JSON.stringify(data));
    // Dispatch storage event to update other tabs/components
    window.dispatchEvent(new Event("storage"));
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.content || !editForm.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let updatedList: Testimonial[];
    
    if (isAdding) {
      const newTestimonial: Testimonial = {
        id: Date.now(),
        name: editForm.name,
        role: editForm.role,
        company: editForm.company,
        content: editForm.content,
        avatar: editForm.avatar || `https://i.pravatar.cc/150?u=${editForm.name}`,
        rating: editForm.rating || 5,
        isActive: editForm.isActive !== false
      };
      updatedList = [...testimonials, newTestimonial];
      toast.success("Testimonial added successfully!");
    } else {
      updatedList = testimonials.map(t => 
        t.id === editingId ? { ...t, ...editForm } as Testimonial : t
      );
      toast.success("Testimonial updated successfully!");
    }

    setTestimonials(updatedList);
    saveToStorage(updatedList);
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  const toggleActive = (id: number) => {
    const updatedList = testimonials.map(t => 
      t.id === id ? { ...t, isActive: t.isActive === false ? true : false } as Testimonial : t
    );
    setTestimonials(updatedList);
    saveToStorage(updatedList);
    toast.success("Testimonial status updated.");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      const updatedList = testimonials.filter(t => t.id !== id);
      setTestimonials(updatedList);
      saveToStorage(updatedList);
      toast.success("Testimonial deleted.");
    }
  };

  const startEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setEditForm(testimonial);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ name: "", role: "", company: "", content: "", avatar: "", rating: 5, isActive: true });
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
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setEditForm({ ...editForm, avatar: e.target?.result as string });
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload an image file.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-card rounded-2xl p-6 border border-border mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Manage Testimonials</h2>
          <p className="text-sm text-foreground/60">Update the success stories shown on the landing page.</p>
        </div>
        <button
          onClick={startAdd}
          disabled={isAdding || editingId !== null}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Testimonial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Full Name</label>
                  <input 
                    placeholder="Name *" 
                    value={editForm.name || ""} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:border-primary/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Role / Position</label>
                  <input 
                    placeholder="Role *" 
                    value={editForm.role || ""} 
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:border-primary/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Company / University</label>
                  <input 
                    placeholder="Company / University" 
                    value={editForm.company || ""} 
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                    className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:border-primary/50 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Star Rating</label>
                  <div className="px-4 py-2 bg-background/50 border border-border rounded-xl flex items-center justify-between h-[42px]">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 cursor-pointer transition-all hover:scale-110 ${(editForm.rating || 5) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-border hover:text-yellow-400/50'}`}
                          onClick={() => setEditForm({...editForm, rating: star})}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-primary">{editForm.rating || 5}.0</span>
                  </div>
                </div>

                <div 
                  className={`md:col-span-2 border-2 border-dashed ${editForm.avatar ? 'border-primary/50 bg-primary/5' : 'border-border/50 hover:border-primary/30 bg-background/30'} rounded-[1.5rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group/upload`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('new-testimonial-avatar')?.click()}
                >
                  {editForm.avatar ? (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={editForm.avatar} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-xl" />
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-primary">Change Avatar</p>
                        <p className="text-xs text-foreground/40">Drag or click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 group-hover/upload:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-bold">Upload Avatar</p>
                      <p className="text-xs text-foreground/40 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input 
                    id="new-testimonial-avatar" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Testimonial Quote</label>
                  <textarea 
                    placeholder="Content *" 
                    value={editForm.content || ""} 
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl text-sm focus:border-primary/50 outline-none transition-all h-32 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={cancelEdit} className="px-6 py-2.5 rounded-xl hover:bg-muted font-bold text-sm transition-all">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0">
                  <Save className="w-4 h-4" /> Save Testimonial
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((testimonial) => (
            <motion.div 
              layout
              key={testimonial.id} 
              className={`group relative p-6 rounded-[2rem] border transition-all hover:shadow-2xl hover:shadow-primary/5 ${
                testimonial.isActive === false 
                  ? 'bg-red-500/[0.02] border-red-500/10 grayscale-[0.5] opacity-80' 
                  : 'bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/30'
              }`}
            >
              {editingId === testimonial.id ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Edit2 className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-bold">Editing Testimonial</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Full Name</label>
                      <input 
                        placeholder="Name *" 
                        value={editForm.name || ""} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:border-primary/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Role / Position</label>
                      <input 
                        placeholder="Role *" 
                        value={editForm.role || ""} 
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                        className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:border-primary/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Company / University</label>
                      <input 
                        placeholder="Company / University" 
                        value={editForm.company || ""} 
                        onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                        className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:border-primary/50 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Star Rating</label>
                      <div className="px-4 py-2 bg-background/50 border border-border rounded-xl flex items-center justify-between h-[42px]">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 cursor-pointer transition-all hover:scale-110 ${(editForm.rating || 5) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-border hover:text-yellow-400/50'}`}
                              onClick={() => setEditForm({...editForm, rating: star})}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-primary">{editForm.rating || 5}.0</span>
                      </div>
                    </div>

                    <div 
                      className={`md:col-span-2 border-2 border-dashed ${editForm.avatar ? 'border-primary/50 bg-primary/5' : 'border-border/50 hover:border-primary/30 bg-background/30'} rounded-[1.5rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group/upload`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById(`testimonial-avatar-upload-${testimonial.id}`)?.click()}
                    >
                      {editForm.avatar ? (
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={editForm.avatar} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-xl" />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                              <Plus className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-primary">Change Avatar</p>
                            <p className="text-xs text-foreground/40">Drag or click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 group-hover/upload:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-bold">Upload Avatar</p>
                          <p className="text-xs text-foreground/40 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input 
                        id={`testimonial-avatar-upload-${testimonial.id}`} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 ml-1">Testimonial Quote</label>
                      <textarea 
                        placeholder="Content *" 
                        value={editForm.content || ""} 
                        onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl text-sm focus:border-primary/50 outline-none transition-all h-32 resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={cancelEdit} className="px-6 py-2.5 rounded-xl hover:bg-muted font-bold text-sm transition-all">Cancel</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-border/50 group-hover:border-primary/30 transition-all p-1 bg-background">
                      <img 
                        src={testimonial.avatar || `https://i.pravatar.cc/150?u=${testimonial.name}`} 
                        className="w-full h-full rounded-[1.75rem] object-cover" 
                        alt={testimonial.name} 
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-background flex items-center justify-center ${testimonial.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      <Power className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{testimonial.name}</h4>
                          {testimonial.isActive === false && (
                            <Badge variant="destructive" className="text-[10px] uppercase tracking-widest px-2 h-5">Inactive</Badge>
                          )}
                          {testimonial.isActive !== false && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] uppercase tracking-widest px-2 h-5">Active</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-primary">
                          {testimonial.role} 
                          {testimonial.company && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-foreground/20" />
                              <span className="text-foreground/40">{testimonial.company}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 p-1.5 bg-background/30 rounded-2xl border border-border/50">
                        <button 
                          onClick={() => toggleActive(testimonial.id)} 
                          className={`p-2 rounded-xl transition-all ${testimonial.isActive !== false ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-foreground/20 hover:text-red-500 hover:bg-red-500/10'}`} 
                          title="Toggle Active"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-border/50" />
                        <button 
                          onClick={() => startEdit(testimonial)} 
                          className="p-2 text-foreground/20 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(testimonial.id)} 
                          className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/5 -z-10 group-hover:scale-125 group-hover:text-primary/10 transition-all" />
                      <p className="text-foreground/70 leading-relaxed italic pr-6 pl-2 border-l-2 border-primary/10 group-hover:border-primary/30 transition-all">
                        {testimonial.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-6 p-2 bg-background/20 rounded-xl w-fit">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-foreground/10 fill-foreground/5'}`} 
                        />
                      ))}
                      <span className="ml-2 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Rating Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
