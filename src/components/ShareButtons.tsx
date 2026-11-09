import { useState } from "react";
import { Link2, Check, Twitter, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  url: string;
  title: string;
  text?: string;
}

const ShareButtons = ({ url, title, text }: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const enc = encodeURIComponent;
  const targets = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, Icon: Twitter },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: Linkedin },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: MessageCircle },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  // Use the device share sheet when available (phones, macOS Safari); otherwise open the menu.
  const handleClick = async (e: React.MouseEvent) => {
    const canNative = typeof navigator !== "undefined" && "share" in navigator && window.matchMedia("(pointer: coarse)").matches;
    if (canNative) {
      e.preventDefault();
      try {
        await navigator.share({ title, text: text || title, url });
      } catch {
        /* dismissed */
      }
    }
  };

  const item =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground hover:border-secondary/50 hover:text-secondary transition-colors"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1.5">
        {targets.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            <Icon className="h-4 w-4 text-muted-foreground" /> {label}
          </a>
        ))}
        <button type="button" onClick={copy} className={item}>
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4 text-muted-foreground" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButtons;
