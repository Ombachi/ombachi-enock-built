import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Runs a publication's interactive HTML experience in a sandboxed frame. */
const LibraryViewerPage = () => {
  const { slug } = useParams();
  const [url, setUrl] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [title, setTitle] = useState("Interactive publication");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      // The manifesto is bundled as a static asset — no backend call needed.
      if (slug === "personal-manifesto") {
        if (!active) return;
        setUrl("/manifesto/index.html");
        setTitle("A Declaration of Purpose and Principle");
        return;
      }
      // Other publications: read the direct URL straight from the database.
      const { data } = await supabase
        .from("products")
        .select("title, html_url, html_file_path")
        .eq("slug", slug)
        .maybeSingle();
      if (!active) return;
      const row = data as { title?: string; html_url?: string | null; html_file_path?: string | null } | null;
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
    if (html) {
      const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    }
  };

  const ready = Boolean(url || html);

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
          <button
            type="button"
            onClick={openFullScreen}
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline"
          >
            <Maximize2 size={14} /> Open full screen
          </button>
        )}
      </header>

      {error ? (
        <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">{error}</div>
      ) : ready ? (
        <iframe
          {...(html ? { srcDoc: html } : { src: url! })}
          title={title}
          className="flex-1 w-full border-0"
          style={{ minHeight: "calc(100vh - 53px)" }}
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
