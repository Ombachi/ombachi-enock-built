import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { POST_CATEGORIES, categoryGradient, categorySlug } from "@/lib/postCategories";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
}

const getSessionId = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session_id", id);
  }
  return id;
};

const WritingSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<
    Record<string, { commenter_name: string; comment_text: string; created_at: string }[]>
  >({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sessionId = getSessionId();

  useEffect(() => {
    fetchArticles();
    fetchLikes();
    fetchComments();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("posts")
      .select("slug, title, excerpt, tag, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);

    setArticles(
      (data || []).map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt || "",
        tag: a.tag || "General",
        date: a.published_at ? new Date(a.published_at).getFullYear().toString() : "",
      })),
    );
    setLoaded(true);
  };

  const fetchLikes = async () => {
    const { data } = await supabase.from("article_likes").select("article_slug");
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((l) => (counts[l.article_slug] = (counts[l.article_slug] || 0) + 1));
      setLikes(counts);
    }
    const { data: userLikeData } = await supabase
      .from("article_likes")
      .select("article_slug")
      .eq("session_id", sessionId);
    if (userLikeData) {
      setUserLikes(new Set(userLikeData.map((l) => l.article_slug)));
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("article_comments")
      .select("article_slug, commenter_name, comment_text, created_at")
      .order("created_at", { ascending: true });
    if (data) {
      const grouped: Record<string, typeof data> = {};
      data.forEach((c) => {
        if (!grouped[c.article_slug]) grouped[c.article_slug] = [];
        grouped[c.article_slug].push(c);
      });
      setComments(grouped);
    }
  };

  const toggleLike = async (slug: string) => {
    if (userLikes.has(slug)) return;
    await supabase.from("article_likes").insert({ article_slug: slug, session_id: sessionId });
    setUserLikes((prev) => new Set([...prev, slug]));
    setLikes((prev) => ({ ...prev, [slug]: (prev[slug] || 0) + 1 }));
  };

  const submitComment = async (slug: string) => {
    if (!commentName.trim() || !commentText.trim()) return;
    setSubmitting(true);
    await supabase.from("article_comments").insert({
      article_slug: slug,
      commenter_name: commentName.trim(),
      comment_text: commentText.trim(),
    });
    setCommentName("");
    setCommentText("");
    setSubmitting(false);
    fetchComments();
  };

  return (
    <section id="writing" className="section-padding bg-muted">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Writing & Insights
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl animate-on-scroll">
          Reflections on diagnostics, climate-health, leadership, and life .
        </p>
        <div className="mb-10 animate-on-scroll">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
          >
            Browse books, papers and briefs in Publications <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 animate-on-scroll">
          {POST_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/writing/category/${c.slug}`}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-secondary/40 hover:text-secondary transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="space-y-4 animate-on-scroll">
          {loaded && articles.length === 0 && (
            <p className="text-muted-foreground text-sm">New writing is on the way.</p>
          )}

          {articles.map((a) => (
            <article
              key={a.slug}
              className="bg-card rounded-xl border border-border hover:border-secondary/40 transition-colors overflow-hidden"
            >
              <Link to={`/writing/${a.slug}`} className="group block">
                <div className={`h-2 bg-gradient-to-r ${categoryGradient(a.tag)}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                          {a.tag}
                        </span>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-secondary transition-colors mb-1">
                        {a.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{a.excerpt}</p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="text-muted-foreground group-hover:text-secondary transition-colors mt-1 shrink-0"
                    />
                  </div>
                </div>
              </Link>

              <div className="px-6 pb-4 flex items-center gap-4">
                <button
                  onClick={() => toggleLike(a.slug)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                    userLikes.has(a.slug) ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
                  }`}
                >
                  <Heart size={14} fill={userLikes.has(a.slug) ? "currentColor" : "none"} />
                  {likes[a.slug] || 0}
                </button>
                <button
                  onClick={() => setOpenComments(openComments === a.slug ? null : a.slug)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors"
                >
                  <MessageCircle size={14} />
                  {(comments[a.slug] || []).length}
                </button>
                <Link
                  to={`/writing/category/${categorySlug(a.tag)}`}
                  className="ml-auto text-xs text-muted-foreground hover:text-secondary transition-colors"
                >
                  More in {a.tag} →
                </Link>
              </div>

              {openComments === a.slug && (
                <div className="px-6 pb-6 border-t border-border pt-4 space-y-3">
                  {(comments[a.slug] || []).map((c, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium text-foreground">{c.commenter_name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                      <p className="text-muted-foreground mt-0.5">{c.comment_text}</p>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      maxLength={100}
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={500}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                        onKeyDown={(e) => e.key === "Enter" && submitComment(a.slug)}
                      />
                      <button
                        onClick={() => submitComment(a.slug)}
                        disabled={submitting}
                        className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WritingSection;
