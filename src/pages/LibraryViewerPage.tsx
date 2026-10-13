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
      const { data, error: fnError } = await supabase.functions.invoke("publication-html", {
        body: { slug },
      });
      if (!active) return;
      if (fnError || (!data?.url && !data?.html)) {
        setError("This publication has no interactive content yet.");
        return;
      }
      if (data.html) setHtml(data.html as string);
      else setUrl(data.url as string);
      if (data.title) setTitle(data.title as string);
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
