import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import ShareButtons from "@/components/ShareButtons";
import ReadingProgress from "@/components/ReadingProgress";
import RelatedPosts from "@/components/RelatedPosts";
import { categorySlug } from "@/lib/postCategories";
import { ArrowLeft, Heart, MessageCircle, Loader2, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tag: string | null;
  content: string;
  published_at: string | null;
  updated_at: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Comment {
  commenter_name: string;
  comment_text: string;
  created_at: string;
}

const getSessionId = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session_id", id);
  }
  return id;
};

const slugifyHeading = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Adds slug id attributes to headings and extracts a TOC.
const processContent = (html: string): { html: string; toc: Heading[] } => {
  if (typeof window === "undefined") return { html, toc: [] };
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const toc: Heading[] = [];
  const used = new Set<string>();
  doc.querySelectorAll("h2, h3").forEach((el) => {
    const text = el.textContent?.trim() || "";
    if (!text) return;
    let id = slugifyHeading(text);
    let i = 2;
    while (used.has(id)) id = `${slugifyHeading(text)}-${i++}`;
    used.add(id);
    el.setAttribute("id", id);
    toc.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
  });
  return { html: doc.body.firstChild ? (doc.body.firstChild as HTMLElement).innerHTML : html, toc };
};

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [processed, setProcessed] = useState<{ html: string; toc: Heading[] }>({ html: "", toc: [] });

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sessionId = getSessionId();

  useEffect(() => {
    if (!slug) return;
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("slug, title, excerpt, cover_image_url, tag, content, published_at, updated_at")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data as Post);
      setProcessed(processContent(data.content));
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const [{ data: allLikes }, { data: mine }, { data: cmts }] = await Promise.all([
        supabase.from("article_likes").select("article_slug").eq("article_slug", slug),
        supabase.from("article_likes").select("article_slug").eq("article_slug", slug).eq("session_id", sessionId),
        supabase
          .from("article_comments")
          .select("commenter_name, comment_text, created_at")
          .eq("article_slug", slug)
          .order("created_at", { ascending: true }),
      ]);
      setLikes(allLikes?.length || 0);
      setLiked((mine?.length || 0) > 0);
      setComments((cmts as Comment[]) || []);
    })();
  }, [slug, sessionId]);

  const toggleLike = async () => {
    if (!slug || liked) return;
    await supabase.from("article_likes").insert({ article_slug: slug, session_id: sessionId });
    setLiked(true);
    setLikes((n) => n + 1);
  };

  const submitComment = async () => {
    if (!slug || !name.trim() || !text.trim()) return;
    setSubmitting(true);
    await supabase.from("article_comments").insert({
      article_slug: slug,
      commenter_name: name.trim(),
      comment_text: text.trim(),
    });
    setComments((c) => [...c, { commenter_name: name.trim(), comment_text: text.trim(), created_at: new Date().toISOString() }]);
    setName("");
    setText("");
    setSubmitting(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Post not found</h1>
          <p className="text-muted-foreground mb-6">This story may have been unpublished or moved.</p>
          <Link to="/#writing" className="text-secondary font-medium hover:underline">← Back to Writing</Link>
        </div>
      </div>
    );
  }

  const dateStr = post.published_at ? format(new Date(post.published_at), "MMMM d, yyyy") : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const postUrl = `${origin}/writing/${post.slug}`;
  const plainText = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const readMinutes = Math.max(1, Math.round(wordCount / 225));
  const metaDescription = (post.excerpt || plainText).slice(0, 155);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: metaDescription,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at,
    articleSection: post.tag || undefined,
    mainEntityOfPage: postUrl,
    author: { "@type": "Person", name: "Ombachi Enock", url: origin || undefined },
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{`${post.title} — Ombachi Enock`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        <meta property="article:modified_time" content={post.updated_at} />
        {post.tag && <meta property="article:section" content={post.tag} />}
        <meta property="article:author" content="Ombachi Enock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        {post.cover_image_url && <meta name="twitter:image" content={post.cover_image_url} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <ReadingProgress />


        <article className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link
              to="/#writing"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Writing
            </Link>

            {post.tag && (
              <Link
                to={`/writing/category/${categorySlug(post.tag)}`}
                className="inline-block text-xs font-medium text-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors px-2.5 py-1 rounded-full mb-4"
              >
                {post.tag}
              </Link>
            )}

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {dateStr}</span>
                <span>·</span>
                <span>By Ombachi Enock</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {readMinutes} min read</span>
              </div>
              <ShareButtons url={postUrl} title={post.title} text={post.excerpt || undefined} />
            </div>

            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-xl border border-border mb-10 aspect-[16/9] object-cover"
              />
            )}
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10">
            {processed.toc.length > 1 ? (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">On this page</p>
                  <nav className="space-y-1.5 border-l border-border pl-4">
                    {processed.toc.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => scrollTo(h.id)}
                        className={`block text-left text-sm text-muted-foreground hover:text-secondary transition-colors w-full ${
                          h.level === 3 ? "pl-3" : ""
                        }`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            ) : (
              <div className="hidden lg:block" />
            )}

            <div className="max-w-2xl mx-auto lg:mx-0 w-full">
              <div
                className="prose prose-neutral dark:prose-invert prose-headings:font-serif prose-a:text-secondary max-w-none"
                dangerouslySetInnerHTML={{ __html: processed.html }}
              />

              {/* Engagement */}
              <div className="mt-12 pt-6 border-t border-border flex items-center gap-6">
                <button
                  onClick={toggleLike}
                  className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
                    liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
                  }`}
                  aria-label="Like post"
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes}
                </button>
                <button
                  onClick={() => setShowComments((s) => !s)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  <MessageCircle size={16} /> {comments.length}
                </button>
                <div className="ml-auto">
                  <ShareButtons url={postUrl} title={post.title} text={post.excerpt || undefined} />
                </div>
              </div>

              {showComments && (
                <div className="mt-6 space-y-4">
                  {comments.map((c, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground text-sm">{c.commenter_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(c.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{c.comment_text}</p>
                    </div>
                  ))}
                  <div className="border border-border rounded-lg p-4 bg-card space-y-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                    <textarea
                      placeholder="Share your thoughts…"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={submitComment}
                        disabled={submitting || !name.trim() || !text.trim()}
                        className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {submitting ? "Posting…" : "Post comment"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default PostPage;