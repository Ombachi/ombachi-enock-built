import { Link } from "react-router-dom";
import { Linkedin, Mail, Rss } from "lucide-react";

const Footer = () => (
  <footer className="py-12 border-t border-border bg-background">
    <div className="section-container">
      <div className="grid gap-8 sm:grid-cols-3 mb-10">
        <div>
          <p className="font-serif text-lg mb-2">Ombachi Enock</p>
          <p className="text-sm text-muted-foreground">
            Medical Laboratory Scientist · Health Systems Builder
          </p>
        </div>

        <nav aria-label="Footer navigation" className="text-sm">
          <p className="font-medium mb-3">Explore</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/#about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/#work" className="hover:text-foreground transition-colors">Work</Link></li>
            <li><Link to="/#writing" className="hover:text-foreground transition-colors">Writing</Link></li>
            <li><Link to="/library" className="hover:text-foreground transition-colors">The Library</Link></li>
            <li><Link to="/#contact" className="hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-medium mb-3">Connect</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a
                href="https://www.linkedin.com/in/ombachi-enock"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                aria-label="LinkedIn profile (opens in a new tab)"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:ombachienock5@outlook.com"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" /> Email
              </a>
            </li>
            <li>
              <a
                href="/rss.xml"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                aria-label="RSS feed"
              >
                <Rss className="w-4 h-4" aria-hidden="true" /> RSS
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-sm text-muted-foreground border-t border-border pt-6">
        © {new Date().getFullYear()} Ombachi Enock. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
