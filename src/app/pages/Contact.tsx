import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Mail, MapPin, Phone, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { toast } from "sonner";

export default function Contact() {
  const { theme } = useApp();
  const logoSrc = theme === "modern" ? "/logo light.png" : "/logo dark.png";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        topic: "",
        message: ""
      });
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card rounded-[2.5rem] p-8 md:p-16 border border-border">
          <div className="text-center mb-16 flex flex-col items-center">
            <Link to="/">
              <img src={logoSrc} alt="Taskademy" className="h-20 w-auto mb-8 hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Whether you have a question about a task, need help with billing, or just want to share feedback, our dedicated team is here to help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email Support</h4>
                      <p className="text-foreground/60 mb-1">General: hello@taskademy.com</p>
                      <p className="text-foreground/60">Support: support@taskademy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Phone</h4>
                      <p className="text-foreground/60 mb-1">+1 (800) 555-0199</p>
                      <p className="text-foreground/60 text-sm">Mon-Fri from 9am to 6pm PST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Headquarters</h4>
                      <p className="text-foreground/60">123 Innovation Drive<br/>Suite 400<br/>San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/40 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h4 className="font-bold">Response Times</h4>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  We aim to respond to all inquiries within 24 hours. For urgent matters regarding active tasks or payments, please select "Urgent Support" in the contact form to be prioritized.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-muted rounded-3xl p-8 border border-border">
                <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        placeholder="Jane" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Doe" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="jane@university.edu" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Topic</label>
                    <select 
                      required
                      value={formData.topic}
                      onChange={e => setFormData({...formData, topic: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none text-foreground"
                    >
                      <option value="">Select a topic...</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="dispute">Task Dispute</option>
                      <option value="feedback">Product Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="How can we help you?" 
                      rows={6} 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
