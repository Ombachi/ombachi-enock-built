import { useState } from "react";
import { Link2, Check, Twitter, Linkedin, MessageCircle, Share2 } from "lucide-react";

interface Props {
  url: string;
  title: string;
  text?: string;
}

const ShareButtons = ({ url, title, text }: Props) => {
  const [copied, setCopied] = useState(false);

  const enc = encodeURIComponent;
  const targets = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, Icon: Twitter },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: Linkedin },
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: MessageCircle },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text || title, url });
      } catch {
        /* dismissed */
      }
    } else {
      copy();
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground mr-1">Share</span>
      {targets.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-secondary hover:border-secondary/40 transition-colors"
        >
          <Icon size={14} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-secondary hover:border-secondary/40 transition-colors"
      >
        {copied ? <Check size={14} className="text-emerald-500" /> : <Link2 size={14} />}
      </button>
      <button
        onClick={nativeShare}
        aria-label="Share post"
        title="Share"
        className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-secondary transition-colors"
      >
        <Share2 size={14} />
      </button>
    </div>
  );
};

export default ShareButtons;