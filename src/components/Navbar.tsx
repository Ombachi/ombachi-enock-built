import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "@/components/DarkModeToggle";

const links = ["Home", "About", "Work", "Principles", "Passions", "Writing", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id.toLowerCase()}`);
      return;
    }
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="section-container flex items-center justify-between h-16">
        <button onClick={() => scrollTo("home")} className="font-serif text-lg font-semibold text-foreground tracking-tight">
          Ombachi Enock
        </button>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            {links.map((l) => (
              <li key={l}>
                <button
                  onClick={() => scrollTo(l)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>
          <DarkModeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            className="text-foreground"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border">
          <ul className="section-container py-4 space-y-3">
            {links.map((l) => (
              <li key={l}>
                <button
                  onClick={() => scrollTo(l)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors block w-full text-left"
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
