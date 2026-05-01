import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Shield, Lock, AlertTriangle, CheckCircle, UserCheck, Flag, Download, Info, Zap, AlertOctagon } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import SparkleButton from "../components/ui/SparkleButton";

const TABS = ["students", "clients", "admins"] as const;
type Tab = typeof TABS[number];

const SEVERITY_LABELS: Record<string, string> = {
  "🔴": "Zero-tolerance",
  "🟡": "Warning",
  "🟢": "Best practice",
};

export default function Safety() {
  const { t } = useTranslation();
  const { theme } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<Tab>("students");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isModern = theme === "modern";
  const logoSrc = isModern ? "/logo light.png" : "/logo dark.png";

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % TABS.length;
      tabRefs.current[next]?.focus();
      setActiveTab(TABS[next]);
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + TABS.length) % TABS.length;
      tabRefs.current[prev]?.focus();
      setActiveTab(TABS[prev]);
    }
  }, []);

  const studentRules = [
    { severity: "🟢", rule: "Deliver original, plagiarism-free work that meets all task requirements", desc: "Academic integrity is core to a student brand" },
    { severity: "🟡", rule: "Maintain professional communication — no harassment, no hate speech", desc: "Platform reputation" },
    { severity: "🟢", rule: "Meet agreed-upon deadlines or communicate delays at least 24 hours in advance", desc: "Sets clear expectations" },
    { severity: "🔴", rule: "Do not request off-platform payments (PayPal, GCash direct, etc.)", desc: "Protects the escrow model" },
    { severity: "🔴", rule: "Do not misrepresent your skills or qualifications on your profile", desc: "Trust & quality assurance" },
    { severity: "🟡", rule: "Disclose AI-generated content — never submit AI work as fully original", desc: "Highly relevant for student work" },
    { severity: "🟡", rule: "Keep all client information confidential — NDAs are implicit", desc: "Builds client confidence" },
    { severity: "🔴", rule: "You must be a currently enrolled student to maintain eligibility", desc: "Platform identity requirement" },
    { severity: "🟡", rule: "Do not work on multiple tasks beyond your declared availability", desc: "Prevents burnout and missed deadlines" },
    { severity: "🔴", rule: "Do not create multiple accounts to bypass suspensions", desc: "Platform integrity" },
    { severity: "🟢", rule: "Upload a portfolio sample for each skill listed on your profile", desc: "Helps clients make informed decisions" },
    { severity: "🟡", rule: "Accept only tasks within your verified skill set", desc: "Reduces disputes and client losses" },
    { severity: "🟢", rule: "Proactively send progress updates for tasks longer than 3 days", desc: "Keeps clients informed" },
    { severity: "🔴", rule: "Do not ghost clients — abandoning funded tasks triggers suspension", desc: "Protects client time and money" }
  ];

  const clientRules = [
    { severity: "🟢", rule: "Provide clear, detailed task descriptions with scope and deadline", desc: "Reduces disputes" },
    { severity: "🔴", rule: "Fund escrow before work begins — never ask students to start without payment", desc: "Core trust promise" },
    { severity: "🟡", rule: "Review and release payment within 5 business days of submission", desc: "Protects student earners" },
    { severity: "🔴", rule: "Do not request academic dishonesty — no exam cheating or ghostwriting", desc: "Legal & ethical line" },
    { severity: "🟡", rule: "Respond to student messages within 48 hours", desc: "Enables quality delivery" },
    { severity: "🔴", rule: "Do not post tasks that are illegal, harmful, or explicitly sexual", desc: "Content moderation" },
    { severity: "🟡", rule: "Do not run spec work schemes — pay for all work completed", desc: "Marketplace fairness" },
    { severity: "🟢", rule: "Treat students as young professionals — no demeaning language", desc: "Brand value alignment" },
    { severity: "🟡", rule: "Do not retroactively change task requirements without agreement", desc: "Prevents scope creep" },
    { severity: "🟢", rule: "Set realistic budgets — rate proposals must be fair", desc: "Protects student welfare" },
    { severity: "🔴", rule: "Do not recruit students away for off-platform unpaid engagements", desc: "Protects ecosystem" },
    { severity: "🟡", rule: "Provide written feedback when rejecting submitted work", desc: "Enables students to improve" },
    { severity: "🔴", rule: "Do not create multiple accounts to evade negative reviews", desc: "Platform integrity" },
    { severity: "🟢", rule: "Leave an honest review after every task completion", desc: "Sustains the rating ecosystem" }
  ];

  const adminRules = [
    { rule: "Admins never ask for your password, OTP, or payment credentials", desc: "Security awareness" },
    { rule: "All account suspensions are issued with a written reason and appeal window", desc: "Fairness & transparency" },
    { rule: "Admin access to private chat logs is only for active dispute resolution", desc: "Privacy protection" },
    { rule: "Escrow funds are never held beyond 30 days — unclaimed funds are refunded", desc: "Financial trust" },
    { rule: "Admins will never manually transfer funds outside dispute workflow", desc: "Anti-corruption" },
    { rule: "All platform policy changes are announced at least 7 days in advance", desc: "User rights" },
    { rule: "Verified badges are issued based on objective criteria only", desc: "Meritocracy signal" },
    { rule: "Data collected from users is never sold to third parties", desc: "Data privacy" },
    { rule: "Admins are prohibited from accepting gifts or favors from users", desc: "Anti-bribery" },
    { rule: "All dispute decisions are documented and shared with both parties", desc: "Transparency" },
    { rule: "Moderation actions are logged and auditable internally", desc: "Internal accountability" },
    { rule: "Platform outages are communicated at least 2 hours in advance", desc: "Operational respect" },
    { rule: "Users may submit formal complaints against admins anonymously", desc: "Meta-accountability" }
  ];

  const motionProps = shouldReduceMotion
    ? { initial: false, animate: {}, exit: {} }
    : {};

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500 pb-24">
      {/* Skip to content — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Decorative Background — aria-hidden */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b ${isModern ? 'from-primary/10 via-background to-background' : 'from-zinc-100 via-background to-background'}`} />
        {!shouldReduceMotion && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          />
        )}
      </div>

      <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <Link
          to="/"
          aria-label="Back to Taskademy home page"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary mb-12 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span className="font-medium">Back to home</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="bg-card/50 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 border border-border/50 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-16 text-center">
            <Link to="/" aria-label="Go to Taskademy home page" className="mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
              <motion.img
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                src={logoSrc}
                alt="Taskademy logo"
                className="h-16 w-auto"
              />
            </Link>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20">
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">Trust & Safety</h1>
            <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
              Taskademy is built on a foundation of mutual respect and absolute security. These rules ensure a fair marketplace for everyone.
            </p>
          </div>

          {/* Zero-Tolerance Box — role="alert" so screen readers announce it */}
          <div role="alert" className="mb-16 p-8 rounded-3xl bg-destructive/10 border border-destructive/20 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center shrink-0" aria-hidden="true">
              <AlertOctagon className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-destructive mb-2">Zero-Tolerance Policy</h2>
              <p className="text-foreground/70">Immediate permanent bans are issued for: Off-platform payments, account impersonation, facilitating academic dishonesty, doxxing, or threats.</p>
            </div>
          </div>

          <div className="grid gap-8 mb-24">
            <h2 className="text-3xl font-bold mb-4">Core Protections</h2>
            {[
              { icon: Lock, title: "Secure Escrow", content: "Funds are held safely by Taskademy until work is approved. No payment escapes our secure ecosystem without validation." },
              { icon: UserCheck, title: "Verified Identity", content: "Mandatory credential checks for students and payment validation for clients to ensure a high-trust environment." },
              { icon: AlertTriangle, title: "Fraud Monitoring", content: "24/7 automated and human moderation to detect phishing, suspicious requests, and platform bypass attempts." }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-6 p-8 rounded-3xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                <feature.icon className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-foreground/60 leading-relaxed">{feature.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rules Tabs Section */}
          <div className="mt-24 pt-16 border-t border-border/50">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Platform Rules</h2>
              <p className="text-foreground/50">Detailed guidelines for all platform participants</p>
            </div>

            {/* Tablist — WCAG 4.1.2, keyboard nav WCAG 2.1.1 */}
            <div
              role="tablist"
              aria-label="Platform rules by role"
              className="flex flex-wrap justify-center gap-4 mb-12 p-2 bg-muted/30 rounded-2xl w-fit mx-auto border border-border/50"
            >
              {TABS.map((tab, idx) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`panel-${tab}`}
                  tabIndex={activeTab === tab ? 0 : -1}
                  ref={(el) => { tabRefs.current[idx] = el; }}
                  onClick={() => setActiveTab(tab)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`px-8 py-3 rounded-xl font-bold text-lg transition-all capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeTab === tab ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg shadow-primary/30 scale-105" : "text-foreground/40 hover:text-foreground hover:bg-muted/50"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* aria-live so screen readers announce content change — WCAG 4.1.3 */}
            <div aria-live="polite" aria-atomic="false" className="min-h-[500px]">
              {TABS.map((tab) => (
                <div
                  key={tab}
                  id={`panel-${tab}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab}`}
                  hidden={activeTab !== tab}
                >
                  <AnimatePresence mode="wait">
                    {activeTab === tab && (
                      <motion.ul
                        key={tab}
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                        className="space-y-4 list-none"
                        aria-label={`Rules for ${tab}`}
                      >
                        {(tab === "students" ? studentRules : tab === "clients" ? clientRules : adminRules).map((r: any, i) => (
                          <li key={i} className="p-6 rounded-2xl bg-card border border-border/50 flex gap-4 items-start hover:border-primary/30 transition-colors">
                            {r.severity && (
                              <span aria-label={SEVERITY_LABELS[r.severity]} title={SEVERITY_LABELS[r.severity]} className="text-2xl pt-1 shrink-0" role="img">
                                {r.severity}
                              </span>
                            )}
                            <div>
                              <p className="font-bold text-lg leading-snug">{r.rule}</p>
                              <p className="text-sm text-foreground/40 mt-1">{r.desc}</p>
                            </div>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* General Users & Wellbeing */}
          <div className="grid md:grid-cols-2 gap-12 mt-24 pt-16 border-t border-border/50">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Zap className="text-primary w-6 h-6" /> General Rules
              </h3>
              <div className="space-y-4">
                {[
                  "One account per person", "No doxxing or sharing personal info", "No threats or coercion", "Real photos only"
                ].map((rule, i) => (
                  <div key={i} className="flex gap-3 text-foreground/70 text-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <CheckCircle className="text-primary w-6 h-6" /> Wellbeing
              </h3>
              <div className="space-y-4">
                {[
                  "Respect 'off-hours' communication", "Academic emergency task pauses permitted", "Zero exploitation tolerance", "Access to mental health resources"
                ].map((rule, i) => (
                  <div key={i} className="flex gap-3 text-foreground/70 text-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enforcement Tiers */}
          <div className="mt-24 p-8 rounded-3xl bg-muted/20 border border-border/30">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Info className="text-primary" /> Enforcement Strike System</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-background/50 border border-border/30">
                <div className="text-3xl mb-2">🟢</div>
                <div className="font-bold">1st Violation</div>
                <div className="text-sm text-foreground/40">Warning + Review</div>
              </div>
              <div className="p-4 rounded-2xl bg-background/50 border border-border/30">
                <div className="text-3xl mb-2">🟡</div>
                <div className="font-bold">2nd Violation</div>
                <div className="text-sm text-foreground/40">7-Day Suspension</div>
              </div>
              <div className="p-4 rounded-2xl bg-background/50 border border-border/30">
                <div className="text-3xl mb-2">🔴</div>
                <div className="font-bold">3rd Violation</div>
                <div className="text-sm text-foreground/40">Permanent Ban</div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/30 pt-12">
            <div className="flex gap-4">
              <SparkleButton
                aria-label="Download platform rules as a PDF document"
              >
                Download PDF Rules
              </SparkleButton>
            </div>
            {/* Last updated — WCAG 3.1 language / legal credibility */}
            <p className="text-foreground/30 text-sm italic font-medium">
              <time dateTime="2026-05-01">Rules last updated: May 1, 2026</time>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Floating Report Button — WCAG 2.4.6 descriptive label */}
      <div className="fixed bottom-8 right-8 z-50">
        <SparkleButton
          variant="destructive"
          aria-label="Report a platform rule violation"
          onClick={() => alert("Reporting system coming soon!")}
        >
          Report a Violation
        </SparkleButton>
      </div>
    </div>
  );
}
