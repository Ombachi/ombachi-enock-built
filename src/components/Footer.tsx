import { Link } from "react-router-dom";
import { Linkedin, Mail, Rss } from "lucide-react";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => (
  <footer className="py-12 border-t border-border bg-background">
    <div className="section-container">
      <div className="grid gap-8 sm:grid-cols-3 mb-10">
        <div>
          <p className="font-serif text-lg mb-2">Ombachi Enock</p>
          <p className="text-sm text-muted-foreground">A Renaissance Man</p>
        </div>

        <nav aria-label="Footer navigation" className="text-sm">
          <p className="font-medium mb-3">Explore</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/#work" className="hover:text-foreground transition-colors">
                Work
              </Link>
            </li>
            <li>
              <Link to="/library" className="hover:text-foreground transition-colors">
                Publications
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-medium mb-3">Connect</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a
                href="https://x.com/ombachi_enock"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                aria-label="X profile (opens in a new tab)"
              >
                <XIcon className="w-4 h-4" /> X (@ombachi_enock)
              </a>
            </li>
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Ombachi Enock. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
