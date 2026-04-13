import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";
import heroMic from "@/assets/hero-mic.jpg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <img
        src={heroMic}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
      <div className="relative z-10 text-center px-6 max-w-md">
        <Compass size={64} className="mx-auto text-secondary mb-6 animate-spin" style={{ animationDuration: "8s" }} />
        <h1 className="mb-2 text-6xl font-serif font-bold text-foreground">404</h1>
        <p className="mb-2 text-xl font-serif text-foreground">Page not found</p>
        <p className="mb-8 text-muted-foreground leading-relaxed">
          Looks like you've wandered off the beaten path. Even the best diagnosticians sometimes need to recalibrate.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Take me home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
