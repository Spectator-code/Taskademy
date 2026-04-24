import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-foreground/60 mb-12 italic">Last Updated: April 24, 2026</p>

          <div className="space-y-12 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">1. Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                Taskademy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">2. Information We Collect</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">3. Use of Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
                <li>Create and manage your account.</li>
                <li>Process payments and refunds.</li>
                <li>Email you regarding your account or order.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                <li>Increase the efficiency and operation of the Site.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">4. Disclosure of Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">5. Security of Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">6. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-2xl border border-border">
                <p className="font-bold text-foreground">Taskademy Inc.</p>
                <p className="text-foreground/60">Privacy Department</p>
                <p className="text-foreground/60">privacy@taskademy.com</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
