import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Linkedin, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (error) throw error;
      setForm({ name: "", email: "", message: "" });
      navigate("/thank-you");
    } catch (err) {
      console.error("Contact form error:", err);
      setErrorMessage("Your message could not be sent. Please try again or contact me by email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Let's Connect
        </h2>
        <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
          For collaborations, speaking, consulting, teaching, and project opportunities
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
                <p className="text-muted-foreground text-xs">linkedin.com/in/ombachi-enock/</p>
              </div>
            </a>
            <a
              href="https://x.com/ombachi_enock"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors"
            >
              <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <div>
                <p className="font-medium text-foreground text-sm">X (Twitter)</p>
                <p className="text-muted-foreground text-xs">@ombachi_enock</p>
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
          </div>

          <div className="animate-on-scroll relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <p id="contact-error" role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </p>
              )}
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground mb-1 block">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? "contact-error" : undefined}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? "contact-error" : undefined}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground mb-1 block">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? "contact-error" : undefined}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={16} /> {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
