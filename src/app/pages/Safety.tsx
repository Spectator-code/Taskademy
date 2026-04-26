import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Shield, Lock, AlertTriangle, CheckCircle, UserCheck, CreditCard } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";

export default function Safety() {
  const { t } = useTranslation();
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo.png" : "/logos.png";
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border">
          <div className="flex flex-col items-center mb-12">
            <Link to="/">
              <img src={logoSrc} alt="Taskademy" className="h-18 w-auto mb-10 hover:scale-105 transition-transform" />
            </Link>
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8">Trust & Safety</h1>
          <p className="text-xl text-foreground/80 mb-16 leading-relaxed">
            Your security is the foundation of Taskademy. We've built a robust ecosystem of protections to ensure that every task, interaction, and payment is completely secure for both students and clients.
          </p>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-6 bg-muted rounded-2xl md:w-1/3 shrink-0">
                <Lock className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Secure Escrow</h3>
                <p className="text-foreground/60">Financial protection built into every single task.</p>
              </div>
              <div className="md:w-2/3 pt-2">
                <p className="text-foreground/80 leading-relaxed mb-4">
                  When a client hires a student, the agreed-upon funds are immediately transferred into our secure escrow system. The funds are held safely by Taskademy until the work is completed and approved. 
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  This guarantees the student will be paid for approved work, and protects the client by ensuring payment is only released when the agreed requirements are met.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-6 bg-muted rounded-2xl md:w-1/3 shrink-0">
                <UserCheck className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Identity Verification</h3>
                <p className="text-foreground/60">Knowing exactly who you're working with.</p>
              </div>
              <div className="md:w-2/3 pt-2">
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We require strict identity and student status verification. Students must provide valid university credentials (.edu email or official enrollment documents) to access tasks on the platform.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Clients undergo payment verification and email validation to prevent fraudulent job postings, ensuring a high-quality environment for everyone.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-6 bg-muted rounded-2xl md:w-1/3 shrink-0">
                <AlertTriangle className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fraud Prevention</h3>
                <p className="text-foreground/60">Proactive monitoring to keep the bad actors out.</p>
              </div>
              <div className="md:w-2/3 pt-2">
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Our automated systems and dedicated human moderation team work 24/7 to detect and prevent suspicious activities, phishing attempts, and off-platform payment requests.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  We review reported messages and profiles immediately. Attempting to bypass the Taskademy payment system results in immediate account suspension to protect our users.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-6 bg-muted rounded-2xl md:w-1/3 shrink-0">
                <CheckCircle className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">{t("disputeResolution") || "Dispute Resolution"}</h3>
                <p className="text-foreground/60">Fair mediation when things don't go as planned.</p>
              </div>
              <div className="md:w-2/3 pt-2">
                <p className="text-foreground/80 leading-relaxed">
                  In the rare event of a disagreement, our dedicated dispute resolution team steps in. We objectively review task requirements, chat history, and submitted files to make a fair, binding decision regarding the release of escrowed funds.
                </p>
              </div>
            </div>

            <div className="pt-12 border-t border-border">
              <h2 className="text-3xl font-bold mb-8">Platform Rules</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-primary">Rules for Students</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Deliver original work that meets all task requirements.
                    </li>
                    <li className="flex gap-3 text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Maintain professional communication with clients.
                    </li>
                    <li className="flex gap-3 text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Meet agreed-upon deadlines or communicate delays early.
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-primary">Rules for Clients</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Provide clear, detailed task descriptions and expectations.
                    </li>
                    <li className="flex gap-3 text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Fund the escrow immediately upon hiring a student.
                    </li>
                    <li className="flex gap-3 text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Review work and release payment promptly after completion.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
