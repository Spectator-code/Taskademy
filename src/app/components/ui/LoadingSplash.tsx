import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function LoadingSplash({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-primary/5 -skew-y-12 origin-left transform -translate-y-1/4" />
          
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-primary/10 blur-[80px]"
              animate={{
                x: [-50, 50, -50],
                y: [-50, 50, -50],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                left: `${10 + i * 30}%`,
                top: `${20 + i * 20}%`
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative flex flex-col items-center z-10"
          >
            <div className="relative mb-6">
              {/* Glowing halo behind logo */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 bg-primary/30 rounded-full blur-2xl"
              />
              
              {/* Floating logo */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className="w-56 h-auto flex items-center justify-center relative z-10"
              >
                <img src="/logo light.png" alt="Taskademy Logo" className="w-full h-full object-contain" />
              </motion.div>
            </div>
            
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-primary font-bold mt-1 tracking-[0.3em] uppercase text-sm flex items-center justify-center gap-3"
              >
                <span>Learn</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span>Work</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span>Earn</span>
              </motion.p>
            </div>

            {/* Loading Progress Bar */}
            <div className="w-64 h-1.5 bg-foreground/10 rounded-full mt-10 overflow-hidden relative shadow-inner">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 via-primary to-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
