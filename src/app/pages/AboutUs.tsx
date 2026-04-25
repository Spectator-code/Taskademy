
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Rocket, Shield, Users, Heart } from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: Rocket,
      title: "Empowerment",
      description: "We believe in giving students the tools to take control of their financial and professional futures."
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building a secure bridge between ambitious talent and visionary clients is our top priority."
    },
    {
      icon: Users,
      title: "Community",
      description: "Taskademy isn't just a platform; it's a movement of learners and doers supporting each other."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We are obsessed with creating the world's best transition from classroom to career."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight">
              Bridging the Gap <br />
              <span className="text-primary">Between Learn & Earn</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              Taskademy was born from a simple observation: students have the skills, but they lack the bridge to real-world impact.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold">The Heart Behind the Brand</h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                We've all been thereÃ¢â‚¬â€sitting in a lecture hall, wondering if our theories would ever survive the pressure of a real project. We saw millions of talented students struggling with student debt while companies were starving for fresh, energetic talent.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Taskademy is our answer. It's more than a freelance site; it's a personality. It's bold, it's empathetic, and it's built by people who believe that <strong>experience should be accessible, not just earned after graduation.</strong>
              </p>
              <div className="pt-4 border-t border-border">
                <blockquote className="italic text-xl text-primary font-medium">
                  "Our mission is to turn every student into a professional, one task at a time."
                </blockquote>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden border border-border bg-muted/50 flex items-center justify-center"
            >
               <img src="/logo.png" alt="Taskademy Brand" className="w-48 h-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
               <div className="absolute bottom-12 left-12 right-12">
                  <p className="text-2xl font-bold">Founded in 2026</p>
                  <p className="text-foreground/60">Built for the next generation of workers.</p>
               </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-foreground/60">What drives us every single day.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to be part of the story?</h2>
          <p className="text-xl text-foreground/60 mb-12">
            Whether you're looking to build your portfolio or find your next star hire, Taskademy is your home.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/register" className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Get Started Now
            </Link>
            <Link to="/browse" className="px-10 py-5 bg-muted text-foreground rounded-2xl font-bold text-lg hover:bg-muted/80 transition-all">
              Browse Tasks
            </Link>
          </div>
        </div>
      </section>
      <footer className="py-12 border-t border-border text-center text-foreground/40 text-sm">
        <p>&copy; 2026 Taskademy Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
