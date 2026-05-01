import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export const defaultAds = [
  {
    id: 1,
    title: "Premium Student Tools",
    imageUrl: "/videos/Taskademy_202605010145.mp4",
    videoUrl: "/videos/Taskademy_202605010145.mp4",
    mediaType: "video" as const,
    link: "/register",
    ctaText: "Get Started",
    isActive: true
  },
  {
    id: 2,
    title: "Boost Your Freelance Career",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    mediaType: "image" as const,
    link: "/about",
    ctaText: "Learn More",
    isActive: true
  }
];

export default function AdvertisementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ads, setAds] = useState(defaultAds);
  const [settings, setSettings] = useState({
    autoPlaySpeed: 6,
    pauseOnHover: true,
    transitionEffect: 'slide',
    showControls: true,
    isVisible: true,
    autoPlay: true,
    overlayOpacity: 80,
    loop: true
  });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("taskademy_ads");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAds(parsed);
        }
      } catch (e) {}
    }

    const storedSettings = localStorage.getItem("taskademy_carousel_settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {}
    }

    const handleStorageChange = () => {
      const updatedAds = localStorage.getItem("taskademy_ads");
      if (updatedAds) {
        try {
          const parsed = JSON.parse(updatedAds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAds(parsed);
          }
        } catch (e) {}
      }
      const updatedSettings = localStorage.getItem("taskademy_carousel_settings");
      if (updatedSettings) {
        try {
          setSettings(JSON.parse(updatedSettings));
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const activeAds = ads.filter(ad => ad.isActive !== false);

  const next = () => {
    setCurrentIndex((prev) => {
      if (prev === activeAds.length - 1) return settings.loop ? 0 : prev;
      return prev + 1;
    });
  };

  const prev = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return settings.loop ? activeAds.length - 1 : 0;
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!settings.autoPlay) return;
    if (isPaused && settings.pauseOnHover) return;
    // Don't auto-advance if we're on the last slide and loop is off
    if (!settings.loop && currentIndex === activeAds.length - 1) return;
    
    const timer = setInterval(() => {
      next();
    }, settings.autoPlaySpeed * 1000);
    return () => clearInterval(timer);
  }, [activeAds.length, settings.autoPlaySpeed, isPaused, settings.pauseOnHover, settings.autoPlay, settings.loop, currentIndex]);

  if (activeAds.length === 0 || !settings.isVisible) return null;

  const animationVariants = {
    slide: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    },
    fade: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0 }
    }
  };

  const currentVariant = animationVariants[settings.transitionEffect as keyof typeof animationVariants] || animationVariants.slide;

  return (
    <div className="w-full py-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 relative">
        <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-6 text-center">Featured Partners</h3>
        
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-2xl aspect-[21/9] md:aspect-[32/9] group"
        >
          <AnimatePresence mode="wait">
            <motion.a
              key={currentIndex}
              href={activeAds[currentIndex].link || undefined}
              target={activeAds[currentIndex].link?.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              initial={currentVariant.initial}
              animate={currentVariant.animate}
              exit={currentVariant.exit}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`absolute inset-0 block w-full h-full ${!activeAds[currentIndex].link ? 'cursor-default' : ''}`}
            >
              <div 
                className="absolute inset-0 z-10" 
                style={{ 
                  background: `linear-gradient(to top, rgba(0,0,0,${settings.overlayOpacity / 100}) 0%, rgba(0,0,0,${(settings.overlayOpacity / 100) * 0.25}) 50%, transparent 100%)` 
                }} 
              />
              {activeAds[currentIndex].mediaType === 'video' ? (
                <video
                  src={activeAds[currentIndex].videoUrl || activeAds[currentIndex].imageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={activeAds[currentIndex].imageUrl} 
                  alt={activeAds[currentIndex].title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex flex-col items-start gap-4">
                {activeAds[currentIndex].title && (
                  <h4 className="text-white text-2xl md:text-4xl font-bold flex items-center gap-3">
                    {activeAds[currentIndex].title}
                  </h4>
                )}
                {(activeAds[currentIndex].ctaText || activeAds[currentIndex].link) && (
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg">
                    {activeAds[currentIndex].ctaText || "Learn More"}
                    <ExternalLink className="w-4 h-4" />
                  </span>
                )}
              </div>
            </motion.a>
          </AnimatePresence>

          {/* Controls */}
          {activeAds.length > 1 && settings.showControls && (
            <>
              {(!settings.loop && currentIndex === 0) ? null : (
                <button 
                  onClick={(e) => { e.preventDefault(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-black/50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {(!settings.loop && currentIndex === activeAds.length - 1) ? null : (
                <button 
                  onClick={(e) => { e.preventDefault(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-black/50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              
              <div className="absolute bottom-4 right-6 md:bottom-6 md:right-10 z-30 flex gap-2">
                {activeAds.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
