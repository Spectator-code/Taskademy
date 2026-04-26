import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { defaultTestimonials } from "../Testimonials";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
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
        content: editForm.content,
        avatar: editForm.avatar || `https://i.pravatar.cc/150?u=${editForm.name}`,
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
    setEditForm({ name: "", role: "", content: "", avatar: "" });
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
          <div className="p-4 bg-muted/30 border border-primary/30 rounded-xl space-y-4 relative">
            <h3 className="font-bold text-primary">Add New Testimonial</h3>
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Name *" 
                value={editForm.name || ""} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <input 
                placeholder="Role (e.g., Student) *" 
                value={editForm.role || ""} 
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <input 
                placeholder="Avatar URL (Optional)" 
                value={editForm.avatar || ""} 
                onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm col-span-2"
              />
              <textarea 
                placeholder="Quote Content *" 
                value={editForm.content || ""} 
                onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm col-span-2 h-24 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={cancelEdit} className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        )}

        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-4 bg-background/50 border border-border rounded-xl">
            {editingId === testimonial.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Name *" 
                    value={editForm.name || ""} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input 
                    placeholder="Role *" 
                    value={editForm.role || ""} 
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <input 
                    placeholder="Avatar URL" 
                    value={editForm.avatar || ""} 
                    onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm col-span-2"
                  />
                  <textarea 
                    placeholder="Content *" 
                    value={editForm.content || ""} 
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm col-span-2 h-24 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={cancelEdit} className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <img src={testimonial.avatar || `https://i.pravatar.cc/150?u=${testimonial.name}`} className="w-12 h-12 rounded-full border border-border" alt={testimonial.name} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-primary text-sm font-medium mb-2">{testimonial.role}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(testimonial)} className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(testimonial.id)} className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-foreground/70 text-sm">"{testimonial.content}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
