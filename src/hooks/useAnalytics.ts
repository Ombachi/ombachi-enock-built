import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session_id", id);
  }
  return id;
};

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageview = async () => {
      try {
        await supabase.from("page_views").insert({
          path: location.pathname + location.search,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: getSessionId(),
          event_type: "pageview",
        });
      } catch (err) {
        // Silently fail — analytics shouldn't break the app
        console.debug("Analytics error:", err);
      }
    };

    trackPageview();
  }, [location.pathname, location.search]);
};

export const trackEvent = async (eventName: string, data?: Record<string, unknown>) => {
  try {
    await supabase.from("page_views").insert({
      path: window.location.pathname,
      session_id: getSessionId(),
      event_type: eventName,
      event_data: data ? (data as never) : null,
      user_agent: navigator.userAgent,
    });
  } catch (err) {
    console.debug("Event tracking error:", err);
  }
};
