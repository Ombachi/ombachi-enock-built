import { useState } from "react";
import { Mail, Linkedin, MessageCircle, Download, Send } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="section-container">
        <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Contact</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Let's Connect
        </h2>
        <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
          For collaborations, speaking, consulting, teaching, or project opportunities — reach out below.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 animate-on-scroll">
            <a
              href="mailto:ombachienock5@outlook.com"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors"
            >
              <Mail size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-foreground text-sm">Email</p>
                <p className="text-muted-foreground text-xs">ombachienock5@outlook.com</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/ombachi-enock"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors"
            >
              <Linkedin size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-foreground text-sm">LinkedIn</p>
                <p className="text-muted-foreground text-xs">linkedin.com/in/ombachi-enock</p>
              </div>
            </a>
            <a
              href="https://wa.me/254729304337"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors"
            >
              <MessageCircle size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-foreground text-sm">WhatsApp</p>
                <p className="text-muted-foreground text-xs">+254 729 304 337</p>
              </div>
            </a>
            <button className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors w-full text-left">
              <Download size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-foreground text-sm">Download CV</p>
                <p className="text-muted-foreground text-xs">PDF format</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 animate-on-scroll">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-foreground mb-1 block">Name</label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-foreground mb-1 block">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                placeholder="Tell me about your project or opportunity..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Send size={16} /> Send Message
            </button>
            {submitted && (
              <p className="text-secondary text-sm font-medium">Thank you! I'll get back to you soon.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
