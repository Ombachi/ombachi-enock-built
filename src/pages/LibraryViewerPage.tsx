import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Runs a publication's interactive HTML experience in a sandboxed frame. */
const LibraryViewerPage = () => {
  const { slug } = useParams();
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("Interactive publication");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: fnError } = await supabase.functions.invoke("publication-html", {
        body: { slug },
      });
      if (!active) return;
      if (fnError || !data?.url) {
        setError("This publication has no interactive content yet.");
        return;
      }
      setUrl(data.url as string);
      if (data.title) setTitle(data.title as string);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

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
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline"
          >
            <Maximize2 size={14} /> Open full screen
          </a>
        )}
      </header>

      {error ? (
        <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">{error}</div>
      ) : url ? (
        <iframe
          src={url}
          title={title}
          className="flex-1 w-full border-0"
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
