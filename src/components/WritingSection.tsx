import { useState, useEffect } from "react";
import { ArrowUpRight, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const articles = [
  {
    slug: "climate-diagnostics",
    title: "Why Climate Change Is a Diagnostics Problem",
    excerpt: "Shifting disease patterns demand that laboratories adapt faster than ever. Here's how climate data can drive diagnostic preparedness.",
    tag: "Climate & Health",
    date: "2025",
    mediumUrl: "https://medium.com/@litusoja",
  },
  {
    slug: "decentralising-labs",
    title: "Decentralising Lab Services: Lessons from the Field",
    excerpt: "Quality diagnostics shouldn't require a four-hour bus ride. Reflections on building accessible laboratory infrastructure.",
    tag: "Health Systems",
    date: "2025",
    mediumUrl: "https://medium.com/@litusoja",
  },
  {
    slug: "mentorship-lab",
    title: "Mentorship in the Lab: What I Wish I'd Known Earlier",
    excerpt: "The most important skills in laboratory science aren't taught in textbooks. On building competence, confidence, and culture.",
    tag: "Leadership",
    date: "2024",
    mediumUrl: "https://medium.com/@litusoja",
  },
  {
    slug: "ai-diagnostics",
    title: "AI in Diagnostics: Promise, Pitfalls, and Pragmatism",
    excerpt: "Artificial intelligence can transform healthcare delivery — but only if we implement it with context, equity, and rigour.",
    tag: "Technology",
    date: "2024",
    mediumUrl: "https://medium.com/@litusoja",
  },
];

const getSessionId = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session_id", id);
  }
  return id;
};

const WritingSection = () => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, { commenter_name: string; comment_text: string; created_at: string }[]>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sessionId = getSessionId();

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, []);

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
        <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Writing & Insights</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Thinking Out Loud
        </h2>
        <p className="text-muted-foreground mb-4 max-w-xl animate-on-scroll">
          Short reflections on diagnostics, climate-health, leadership, and the systems that shape healthcare.
        </p>
        <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll text-sm">
          Author of <a href="https://medium.com/@litusoja" target="_blank" rel="noopener noreferrer" className="font-medium text-secondary hover:underline">Litu Musings</a> — a space for deeper thinking on health, science, and systems.
          <a href="https://medium.com/@litusoja" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-2 text-secondary hover:underline">
            <ExternalLink size={12} /> Read more on Medium
          </a>
        </p>

        <div className="space-y-4 animate-on-scroll">
          {articles.map((a) => (
            <article key={a.slug} className="bg-card rounded-xl border border-border hover:border-secondary/40 transition-colors overflow-hidden">
              <a
                href={a.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{a.tag}</span>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-secondary transition-colors mb-1">
                      {a.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{a.excerpt}</p>
                  </div>
                  <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-secondary transition-colors mt-1 shrink-0" />
                </div>
              </a>

              {/* Like & Comment bar */}
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
              </div>

              {/* Comments panel */}
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
