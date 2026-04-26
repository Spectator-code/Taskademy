import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export const defaultTestimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Computer Science Student",
    content: "Taskademy helped me land my first real-world development gig. The client was amazing, and I built a portfolio piece that got me hired right after graduation.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    role: "Startup Founder",
    content: "I needed a quick landing page built for my new venture. The student I hired on Taskademy delivered professional quality work at a fraction of agency costs.",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Graphic Design Major",
    content: "Building my freelance design business was daunting until I found Taskademy. The escrow system makes me feel safe, and the clients actually value student work.",
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

export default function Testimonials({ isHero = false }: { isHero?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    // Read from localStorage to allow admin edits
    const stored = localStorage.getItem("taskademy_testimonials");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials(parsed);
        }
      } catch (e) {
        console.error("Failed to parse testimonials", e);
      }
    }

    // Listen for storage changes from other tabs/admin panel
    const handleStorageChange = () => {
      const updated = localStorage.getItem("taskademy_testimonials");
      if (updated) {
        try {
          const parsed = JSON.parse(updated);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTestimonials(parsed);
          }
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className={`${isHero ? 'p-0 bg-transparent' : 'py-24 bg-card/30'} relative overflow-hidden`}>
      <div className={`${isHero ? 'w-full' : 'max-w-6xl'} mx-auto px-6 relative z-10`}>
        {!isHero && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Hear from students building their careers and clients finding amazing talent.
            </p>
          </div>
        )}

        {isHero && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
            <p className="text-sm text-foreground/60">
              Real results from our community.
            </p>
          </div>
        )}

        <div className="relative w-full mx-auto">
          {/* Controls - smaller for hero */}
          <button 
            onClick={prev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 ${isHero ? '-translate-x-2 w-8 h-8' : '-translate-x-4 md:-translate-x-12 w-12 h-12'} rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-20 shadow-lg`}
          >
            <ChevronLeft className={`${isHero ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </button>
          
          <button 
            onClick={next}
            className={`absolute right-0 top-1/2 -translate-y-1/2 ${isHero ? 'translate-x-2 w-8 h-8' : 'translate-x-4 md:translate-x-12 w-12 h-12'} rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-20 shadow-lg`}
          >
            <ChevronRight className={`${isHero ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </button>

          {/* Carousel */}
          <div className={`overflow-hidden rounded-3xl bg-card/50 backdrop-blur-sm border border-border shadow-xl`}>
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className={`w-full shrink-0 ${isHero ? 'p-6' : 'p-8 md:p-16'} flex flex-col items-center text-center`}>
                  <Quote className={`${isHero ? 'w-8 h-8 mb-4' : 'w-12 h-12 mb-6'} text-primary/20`} />
                  <p className={`${isHero ? 'text-base mb-6' : 'text-xl md:text-2xl mb-8'} font-medium leading-relaxed text-foreground/80`}>
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.avatar || `https://i.pravatar.cc/150?u=${testimonial.name}`} alt={testimonial.name} className={`${isHero ? 'w-10 h-10' : 'w-14 h-14'} rounded-full border-2 border-primary/20`} />
                    <div className="text-left">
                      <div className={`font-bold ${isHero ? 'text-sm' : 'text-lg'}`}>{testimonial.name}</div>
                      <div className="text-primary text-xs font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary scale-125" : "bg-primary/20 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
