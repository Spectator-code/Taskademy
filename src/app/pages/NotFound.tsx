import { Link, useRouteError } from "react-router";
import { motion } from "motion/react";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export default function NotFound() {
  const error: any = useRouteError();
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="mb-12">
            <Link to="/">
              <img src={logoSrc} alt="Taskademy" className="h-16 w-auto mx-auto mb-8" />
            </Link>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
            <AlertTriangle className="w-24 h-24 text-red-500 relative z-10 mx-auto" />
          </div>
        </div>

        <h1 className="text-6xl font-black mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
        <p className="text-foreground/60 mb-10 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved. 
          {error?.statusText || error?.message ? (
            <span className="block mt-2 italic text-sm opacity-50">"{error.statusText || error.message}"</span>
          ) : null}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-muted text-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </motion.div>

      <div className="fixed bottom-8 text-foreground/20 text-xs font-mono uppercase tracking-[0.2em] pointer-events-none">
        Taskademy Internal Error Handler v1.0
      </div>
    </div>
  );
}
