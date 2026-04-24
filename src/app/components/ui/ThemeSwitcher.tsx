import { Palette, Sun, Moon, Feather } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../contexts/AppContext";
import { useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: "modern", name: "Modern", icon: Moon, color: "bg-primary" },
    { id: "minimalist", name: "Minimalist", icon: Sun, color: "bg-zinc-200" },
    { id: "classic", name: "Classic", icon: Feather, color: "bg-[#b58900]" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/60 hover:bg-card hover:text-foreground transition-all border border-border/50"
        title="Switch Theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl p-2 shadow-2xl z-[100]"
          >
            <div className="space-y-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    theme === t.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.name}</span>
                  {theme === t.id && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
