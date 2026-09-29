import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/consent";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getAnalyticsConsent() === null);
    const reopen = () => setOpen(true);
    window.addEventListener("ombachi:open-cookie-preferences", reopen);
    return () => window.removeEventListener("ombachi:open-cookie-preferences", reopen);
  }, []);

  const choose = (choice: AnalyticsConsent) => {
    setAnalyticsConsent(choice);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl border border-border bg-card p-5 shadow-xl sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 id="cookie-consent-title" className="font-serif text-lg font-semibold text-card-foreground">
            Your privacy choices
          </h2>
          <p id="cookie-consent-description" className="mt-1 text-sm leading-relaxed text-muted-foreground">
            This site uses optional first-party measurement to understand which pages people find useful. Essential site features work either way.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" onClick={() => choose("declined")}>Decline</Button>
          <Button type="button" onClick={() => choose("accepted")}>Accept</Button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;