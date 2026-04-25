
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-8">Terms of Service</h1>
          <p className="text-foreground/60 mb-12 italic">Last Updated: April 24, 2026</p>

          <div className="space-y-12 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">1. Agreement to Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Taskademy ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">2. Intellectual Property Rights</h2>
              <p className="text-foreground/80 leading-relaxed">
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">3. User Representations</h2>
              <p className="text-foreground/80 leading-relaxed">
                By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">4. User Registration</h2>
              <p className="text-foreground/80 leading-relaxed">
                You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">5. Prohibited Activities</h2>
              <p className="text-foreground/80 leading-relaxed">
                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">6. Platform Specific Rules</h2>
              <p className="text-foreground/80 leading-relaxed">
                <strong>For Students:</strong> You agree to provide high-quality work and fulfill task requirements as specified by Clients. Failure to do so may result in non-payment or account suspension.
                <br /><br />
                <strong>For Clients:</strong> You agree to provide clear task descriptions and timely payment for work that meets your requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">7. Governing Law</h2>
              <p className="text-foreground/80 leading-relaxed">
                These Terms of Service and your use of the Site are governed by and construed in accordance with the laws of the State/Country in which Taskademy operates, without regard to its conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">8. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-2xl border border-border">
                <p className="font-bold text-foreground">Taskademy Inc.</p>
                <p className="text-foreground/60">Legal Department</p>
                <p className="text-foreground/60">legal@taskademy.com</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
