import { Palette, Sun, Moon, Feather } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../contexts/AppContext";
import { useState, useRef, useEffect } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Feature 1: Click-outside and Escape key to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const themes = [
    { id: "modern", name: "Modern", icon: Moon, hoverBg: "hover:bg-primary/20", activeText: "text-primary" },
    { id: "minimalist", name: "Minimalist", icon: Sun, hoverBg: "hover:bg-zinc-500/20", activeText: "text-zinc-500" },
    { id: "classic", name: "Classic", icon: Feather, hoverBg: "hover:bg-[#b58900]/20", activeText: "text-[#b58900]" },
  ];

  // Feature 2: Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative">
      {/* Feature 5: Interactive Palette Icon with dynamic glow */}
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
          isOpen ? 'bg-primary/10 text-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'text-foreground/60 hover:bg-card hover:text-foreground border-border/50'
        }`}
        title="Switch Theme"
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <Palette className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full mt-3 w-56 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl z-[100] overflow-hidden"
          >
            <div className="space-y-1 relative">
              {themes.map((t) => {
                const isActive = theme === t.id;
                
                return (
                  <motion.button
                    variants={itemVariants}
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setTimeout(() => setIsOpen(false), 150); // Slight delay to see the fluid animation
                    }}
                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-300 z-10 ${
                      isActive ? t.activeText : `text-foreground/60 ${t.hoverBg} hover:text-foreground`
                    }`}
                  >
                    {/* Feature 3: Sliding Active Indicator (LayoutId) */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTheme"
                        className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Feature 4: Theme-Specific Icon Colors */}
                    <t.icon className={`w-4 h-4 ${isActive ? 'scale-110 transition-transform' : ''}`} />
                    <span className={`text-sm font-bold ${isActive ? '' : 'font-medium'}`}>{t.name}</span>
                    
                    {isActive && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-current" 
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
