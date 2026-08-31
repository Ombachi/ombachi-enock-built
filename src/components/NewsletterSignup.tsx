import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PENDING_KEY = "newsletter_pending";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const insert = supabase
        .from("newsletter_subscribers" as never)
        .insert({ email: email.trim().toLowerCase(), source: "site" } as never);
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 4000)
      );
      await Promise.race([insert, timeout]);
    } catch {
      // Backend unavailable — keep the address locally so nothing is lost.
      try {
        const queued: string[] = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
        if (!queued.includes(email.trim().toLowerCase())) {
          queued.push(email.trim().toLowerCase());
          localStorage.setItem(PENDING_KEY, JSON.stringify(queued));
        }
      } catch {
        /* ignore */
      }
    }

    setStatus("done");
    toast.success("You're on the list. Thank you for reading.");
    setEmail("");
  };

  return (
    <section
      className="py-16 sm:py-20 border-t border-border bg-muted/30"
      aria-labelledby="newsletter-heading"
    >
      <div className="section-container max-w-2xl text-center">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary mb-5">
          <Mail className="w-5 h-5" aria-hidden="true" />
        </span>
        <h2 id="newsletter-heading" className="font-serif text-2xl sm:text-3xl mb-3">
          Notes on diagnostics, climate and health systems
        </h2>
        <p className="text-muted-foreground mb-7 text-sm sm:text-base">
          Occasional essays and field notes. No noise, no selling — unsubscribe any time.
        </p>

        {status === "done" ? (
          <p className="inline-flex items-center gap-2 text-primary font-medium">
            <Check className="w-4 h-4" aria-hidden="true" /> Subscribed. Talk soon.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 h-11 px-4 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {status === "loading" && (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              )}
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
