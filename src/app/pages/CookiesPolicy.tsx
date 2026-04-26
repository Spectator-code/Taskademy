import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Cookie, ShieldCheck, Settings } from "lucide-react";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
            <Cookie className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Cookies Policy</h1>
          <p className="text-foreground/60 mb-12 italic text-lg">Last Updated: April 24, 2026</p>
          
          <div className="space-y-12 max-w-none">
            <section>
              <h2 className="text-3xl font-bold mb-4">1. What are cookies?</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">2. Types of cookies we use</h2>
              <div className="grid gap-6">
                <div className="p-6 bg-muted rounded-2xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-bold">Essential Cookies</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. 
                  </p>
                </div>
                
                <div className="p-6 bg-muted rounded-2xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-bold">Performance & Analytics</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">3. Third-party cookies</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. We do not control the setting of these cookies, so we suggest you check the third-party websites for more information about their cookies.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">4. What are your choices regarding cookies</h2>
              <p className="text-foreground/80 leading-relaxed text-lg mb-6">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
              </p>
              
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
                <h4 className="font-bold mb-3">Browser Guides:</h4>
                <ul className="list-disc pl-5 space-y-2 text-primary">
                  <li><a href="#" className="hover:underline">Chrome Cookie Settings</a></li>
                  <li><a href="#" className="hover:underline">Safari Cookie Settings</a></li>
                  <li><a href="#" className="hover:underline">Firefox Cookie Settings</a></li>
                  <li><a href="#" className="hover:underline">Edge Cookie Settings</a></li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
