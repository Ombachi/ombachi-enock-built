import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { hasPdf, publicationFileUrl } from "@/lib/library/documentAccess";
import { getUnlock, isOrderPaid } from "@/lib/library/mpesaCheckout";

/** HTML stays sandboxed; PDFs open top-level in the browser's native reader. */
const LibraryViewerPage = () => {
  const { slug } = useParams();
  const [url, setUrl] = useState<string | null>(null);
  const [pdf, setPdf] = useState(false);
  const [title, setTitle] = useState("Interactive publication");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    setPdf(false);
    setError(null);
    (async () => {
      try {
      // The manifesto is bundled as a static asset — no backend call needed.
      if (slug === "personal-manifesto") {
        if (!active) return;
        setUrl("/manifesto/index.html");
        setTitle("A Declaration of Purpose and Principle");
        return;
      }
      // Other publications: read the direct URL straight from the database.
      const { data, error: loadError } = await supabase
        .from("products")
        .select("id, slug, title, price_kes, file_path, html_url, html_file_path")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!active) return;
      if (loadError) throw loadError;
      const row = data;
      if (!row) throw new Error("Publication not found.");
      setTitle(row.title);
      if (Number(row.price_kes) > 0) {
        const unlock = getUnlock(row.id);
        if (!unlock || !await isOrderPaid(unlock.orderId, unlock.token)) {
          throw new Error("Unlock this publication on its publication page before opening it.");
        }
        if (!active) return;
      }
      if (hasPdf(row)) {
        const fileUrl = publicationFileUrl(row, "view");
        setPdf(true);
        setUrl(fileUrl);
        // Top-level navigation avoids both storage X-Frame-Options and iframe PDF limitations on iOS.
        window.location.replace(fileUrl);
        return;
      }
      if (row?.html_url) {
        setUrl(row.html_url);
        if (row.title) setTitle(row.title);
        return;
      }
      if (row?.html_file_path) {
        const { data: pub } = supabase.storage.from("library-files").getPublicUrl(row.html_file_path);
        if (pub?.publicUrl) {
          setUrl(pub.publicUrl);
          if (row.title) setTitle(row.title);
          return;
        }
      }
      setError("This publication has no interactive content yet.");
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "This publication could not be loaded.");
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const openFullScreen = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
  };

  const ready = Boolean(url);

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>{`${title} — Publications`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <Link
          to={`/library/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} /> Back to {title}
        </Link>
        {ready && (
          <Button
            type="button"
            variant="link"
            onClick={openFullScreen}
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline"
          >
            <Maximize2 size={14} /> Open full screen
          </Button>
        )}
      </header>

      {error ? (
        <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">{error}</div>
      ) : pdf && url ? (
        <div className="flex flex-1 items-center justify-center">
          <Button asChild><a href={url} referrerPolicy="no-referrer">Open PDF</a></Button>
        </div>
      ) : url ? (
        <iframe
          src={url}
          title={title}
          className="flex-1 w-full border-0 min-h-[calc(100vh-53px)]"
          sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading the experience…
        </div>
      )}
    </div>
  );
};

export default LibraryViewerPage;
