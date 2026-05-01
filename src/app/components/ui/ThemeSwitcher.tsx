import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../contexts/AppContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useApp();
  const isDark = theme === "modern";

  const toggleTheme = () => {
    setTheme(isDark ? "minimalist" : "modern");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center w-[72px] h-9 rounded-full p-1 cursor-pointer transition-colors duration-500 ${
        isDark ? "bg-primary/20 border border-primary/30" : "bg-zinc-200 border border-zinc-300"
      }`}
      aria-label="Toggle Theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track background icons */}
      <div className="absolute inset-0 px-2.5 flex justify-between items-center pointer-events-none">
        <Sun className={`w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-50 text-primary' : 'opacity-0'}`} />
        <Moon className={`w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-50 text-zinc-500'}`} />
      </div>

      {/* Sliding Handle */}
      <div className={`flex w-full h-full items-center ${isDark ? "justify-end" : "justify-start"}`}>
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className={`z-10 flex items-center justify-center w-7 h-7 rounded-full shadow-md ${
            isDark ? "bg-primary text-primary-foreground shadow-primary/40" : "bg-white text-zinc-700 shadow-black/10"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -180, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.button>
  );
}
