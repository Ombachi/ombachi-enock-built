import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, ImagePlus, ArrowLeft, FileCode } from "lucide-react";
import { format } from "date-fns";
import RichEditor from "./RichEditor";
import { slugify, uploadPostImage } from "@/lib/postImages";
import { CATEGORY_NAMES } from "@/lib/postCategories";
import { sanitizeImportedHtml, extractHtmlTitle } from "@/lib/htmlImport";
import { syncPostToLibrary } from "@/lib/library/postSync";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tag: string | null;
  content: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const TAGS = CATEGORY_NAMES;

const emptyPost = (): Post => ({
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  cover_image_url: "",
  tag: TAGS[0],
  content: "",
  status: "draft",
  published_at: null,
  created_at: "",
  updated_at: "",
});

const PostsPanel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [htmlPaste, setHtmlPaste] = useState("");
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load posts", description: error.message, variant: "destructive" });
    } else {
      setPosts((data || []) as Post[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing(emptyPost());
    setSlugTouched(false);
  };

  const startEdit = (p: Post) => {
    setEditing({ ...p, excerpt: p.excerpt || "", cover_image_url: p.cover_image_url || "", tag: p.tag || TAGS[0] });
    setSlugTouched(true);
  };

  const remove = async (p: Post) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", p.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      load();
    }
  };

  const save = async () => {
    if (!editing) return;
    const title = editing.title.trim();
    const slug = (editing.slug || slugify(title)).trim();
    if (!title) return toast({ title: "Title required", variant: "destructive" });
    if (!slug) return toast({ title: "Slug required", variant: "destructive" });
    if (!editing.content || editing.content === "<p></p>") return toast({ title: "Content required", variant: "destructive" });

    setSaving(true);
    const publishedAt =
      editing.status === "published"
        ? editing.published_at || new Date().toISOString()
        : null;

    const payload = {
      slug,
      title,
      excerpt: editing.excerpt?.trim() || null,
      cover_image_url: editing.cover_image_url?.trim() || null,
      tag: editing.tag,
      content: editing.content,
      status: editing.status,
      published_at: publishedAt,
    };

    const isNew = !editing.id;
    const query = isNew
      ? supabase.from("posts").insert(payload).select().single()
      : supabase.from("posts").update(payload).eq("id", editing.id).select().single();

    const { data, error } = await query;
    if (error) {
      setSaving(false);
      return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }

    const saved = data as Post;
    try {
      await syncPostToLibrary({
        id: saved.id,
        slug: saved.slug,
        title: saved.title,
        excerpt: saved.excerpt,
        cover_image_url: saved.cover_image_url,
        tag: saved.tag,
        status: saved.status,
      });
    } catch {
      toast({
        title: "Saved, but not listed in the Library",
        description: "Add it manually from the Products tab.",
        variant: "destructive",
      });
    }

    setSaving(false);
    toast({
      title: isNew ? "Post created" : "Post updated",
      description: "Also available in The Library under Products.",
    });
    setEditing(null);
    load();
  };

  const uploadCover = async (file: File) => {
    if (!editing) return;
    try {
      const url = await uploadPostImage(file);
      setEditing({ ...editing, cover_image_url: url });
    } catch (err) {
      toast({
        title: "Cover upload failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const applyHtml = (raw: string) => {
    if (!editing || !raw.trim()) return;
    const html = sanitizeImportedHtml(raw);
    if (!html) return toast({ title: "Nothing to import", description: "The HTML had no readable content.", variant: "destructive" });
    const title = editing.title || extractHtmlTitle(raw);
    setEditing({
      ...editing,
      title,
      slug: editing.slug || slugify(title),
      content: html,
    });
    setHtmlPaste("");
    setShowImport(false);
    toast({ title: "HTML imported", description: "Review the content in the editor before publishing." });
  };

  const importHtmlFile = async (file: File) => {
    const raw = await file.text();
    applyHtml(raw);
  };

  if (editing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => setEditing(null)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to posts
              </Button>
              <CardTitle>{editing.id ? "Edit post" : "New post"}</CardTitle>
              <CardDescription>Write your story, then toggle Publish when it's ready.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className={editing.status === "published" ? "text-secondary font-medium" : "text-muted-foreground"}>
                  {editing.status === "published" ? "Published" : "Draft"}
                </span>
                <Switch
                  checked={editing.status === "published"}
                  onCheckedChange={(checked) =>
                    setEditing({ ...editing, status: checked ? "published" : "draft" })
                  }
                  aria-label="Toggle publish status"
                />
              </div>
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editing.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditing({
                    ...editing,
                    title,
                    slug: slugTouched ? editing.slug : slugify(title),
                  });
                }}
                placeholder="A meaningful title"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={editing.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setEditing({ ...editing, slug: slugify(e.target.value) });
                }}
                placeholder="my-post-slug"
              />
              <p className="text-xs text-muted-foreground">Public URL: /writing/{editing.slug || "…"}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tag">Category</Label>
              <select
                id="tag"
                value={editing.tag || ""}
                onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Cover image</Label>
              <div className="flex items-center gap-3">
                {editing.cover_image_url ? (
                  <img src={editing.cover_image_url} alt="cover" className="h-12 w-20 object-cover rounded border border-border" />
                ) : (
                  <div className="h-12 w-20 rounded border border-dashed border-border flex items-center justify-center text-muted-foreground">
                    <ImagePlus className="h-4 w-4" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) uploadCover(f);
                    }}
                  />
                  <span className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                    <ImagePlus className="h-3.5 w-3.5" /> Upload
                  </span>
                </label>
                {editing.cover_image_url && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing({ ...editing, cover_image_url: "" })}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={editing.excerpt || ""}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              rows={2}
              placeholder="One or two sentences shown on the card and social previews."
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Label>Content</Label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".html,.htm,text/html"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) importHtmlFile(f);
                    }}
                  />
                  <span className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                    <FileCode className="h-3.5 w-3.5" /> Upload .html
                  </span>
                </label>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowImport((s) => !s)}>
                  Paste HTML
                </Button>
              </div>
            </div>
            {showImport && (
              <div className="space-y-2 border border-border rounded-lg p-3 bg-muted/30">
                <Textarea
                  value={htmlPaste}
                  onChange={(e) => setHtmlPaste(e.target.value)}
                  rows={6}
                  placeholder="<h2>Section</h2><p>Paste a full HTML document or fragment…</p>"
                  className="font-mono text-xs"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Scripts, styles and inline handlers are stripped. This replaces the current content.
                  </p>
                  <Button type="button" size="sm" onClick={() => applyHtml(htmlPaste)} disabled={!htmlPaste.trim()}>
                    Import
                  </Button>
                </div>
              </div>
            )}
            <RichEditor value={editing.content} onChange={(content) => setEditing({ ...editing, content })} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Posts</CardTitle>
            <CardDescription>{posts.length} total · manage your Writing & Insights</CardDescription>
          </div>
          <Button onClick={startNew}>
            <Plus className="h-4 w-4 mr-1" /> New post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet. Click "New post" to write your first one.</p>
        ) : (
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4 border border-border rounded-lg p-3 bg-card hover:border-secondary/40 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={p.status === "published" ? "default" : "secondary"} className="capitalize">{p.status}</Badge>
                    {p.tag && <span className="text-xs text-muted-foreground">{p.tag}</span>}
                    <span className="text-xs text-muted-foreground">
                      · updated {format(new Date(p.updated_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="font-medium text-foreground truncate">{p.title}</p>
                  {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-1">{p.excerpt}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {p.status === "published" && (
                    <a
                      href={`/writing/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center h-8 w-8 justify-center rounded-md hover:bg-muted"
                      aria-label="View post"
                      title="View post"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(p)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => remove(p)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostsPanel;