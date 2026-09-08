import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, AlertTriangle, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PRODUCT_FORMATS, DIGITAL_FORMATS, formatKES } from "@/lib/library/types";
import { COLLECTIONS } from "@/lib/library/catalogue";

type Row = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  format: string;
  category: string;
  price_kes: number;
  compare_at_kes: number | null;
  is_digital: boolean;
  is_free: boolean;
  stock: number | null;
  pages: number | null;
  published_year: number | null;
  cover_image_url: string | null;
  collections: string[];
  featured: boolean;
  status: "draft" | "published";
};

const blank = (): Partial<Row> => ({
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  format: "eBook",
  category: "General",
  price_kes: 0,
  compare_at_kes: null,
  is_digital: true,
  is_free: false,
  stock: null,
  pages: null,
  published_year: new Date().getFullYear(),
  cover_image_url: "",
  collections: [],
  featured: false,
  status: "draft",
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ProductsPanel = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Row>>(blank());
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Could not load products", description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof Row>(k: K, v: Row[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const openNew = () => {
    setDraft(blank());
    setOpen(true);
  };

  const openEdit = (r: Row) => {
    setDraft({ ...r });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.title?.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug?.trim() || slugify(draft.title),
      title: draft.title.trim(),
      subtitle: draft.subtitle || null,
      description: draft.description ?? "",
      format: draft.format ?? "eBook",
      category: draft.category ?? "General",
      price_kes: Number(draft.price_kes) || 0,
      compare_at_kes: draft.compare_at_kes ? Number(draft.compare_at_kes) : null,
      is_digital: !!draft.is_digital,
      is_free: !!draft.is_free || Number(draft.price_kes) === 0,
      stock: draft.is_digital ? null : draft.stock == null ? 0 : Number(draft.stock),
      pages: draft.pages ? Number(draft.pages) : null,
      published_year: draft.published_year ? Number(draft.published_year) : null,
      cover_image_url: draft.cover_image_url || null,
      collections: draft.collections ?? [],
      featured: !!draft.featured,
      status: (draft.status ?? "draft") as "draft" | "published",
    };

    const { error } = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: draft.id ? "Product updated" : "Product created" });
    setOpen(false);
    load();
  };

  const remove = async (r: Row) => {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", r.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    load();
  };

  const togglePublish = async (r: Row) => {
    const next = r.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("products").update({ status: next }).eq("id", r.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: next } : x)));
  };

  const saveStock = async (r: Row) => {
    const raw = stockEdits[r.id];
    if (raw === undefined) return;
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value) || value < 0) {
      toast({ title: "Enter a valid quantity", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("products").update({ stock: value }).eq("id", r.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, stock: value } : x)));
    setStockEdits((s) => {
      const n = { ...s };
      delete n[r.id];
      return n;
    });
    toast({ title: "Stock updated", description: `${r.title}: ${value} in stock` });
  };

  const physical = rows.filter((r) => !r.is_digital);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                {rows.length} item{rows.length === 1 ? "" : "s"} in The Library ·{" "}
                {rows.filter((r) => r.status === "published").length} published
              </CardDescription>
            </div>
            <Button size="sm" onClick={openNew}>
              <Plus className="h-4 w-4 mr-1.5" /> New product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products yet. Create your first title to open The Library.
            </p>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 flex-wrap border border-border rounded-lg p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{r.title}</span>
                      <Badge variant={r.status === "published" ? "default" : "secondary"}>{r.status}</Badge>
                      <Badge variant="outline">{r.format}</Badge>
                      {r.featured && <Badge variant="outline">featured</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatKES(r.price_kes)} · {r.is_digital ? "digital" : `${r.stock ?? 0} in stock`} · /library/{r.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-1">
                      <Switch
                        checked={r.status === "published"}
                        onCheckedChange={() => togglePublish(r)}
                        aria-label={`Publish ${r.title}`}
                      />
                      <span className="text-xs text-muted-foreground hidden sm:inline">Live</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(r)} aria-label={`Edit ${r.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(r)} aria-label={`Delete ${r.title}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Stock levels for physical items. Digital titles never run out.</CardDescription>
        </CardHeader>
        <CardContent>
          {physical.length === 0 ? (
            <p className="text-sm text-muted-foreground">No physical stock to track yet.</p>
          ) : (
            <div className="space-y-2">
              {physical.map((r) => {
                const low = (r.stock ?? 0) <= 3;
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-4 flex-wrap border-b border-border last:border-0 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {low && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
                      <span className="text-sm truncate">{r.title}</span>
                      {low && <span className="text-xs text-destructive">low stock</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        className="w-24 h-8"
                        value={stockEdits[r.id] ?? String(r.stock ?? 0)}
                        onChange={(e) => setStockEdits((s) => ({ ...s, [r.id]: e.target.value }))}
                        aria-label={`Stock for ${r.title}`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={stockEdits[r.id] === undefined}
                        onClick={() => saveStock(r)}
                      >
                        <Save className="h-3.5 w-3.5 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit product" : "New product"}</DialogTitle>
            <DialogDescription>Details shown on the product page in The Library.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="p-title">Title</Label>
              <Input
                id="p-title"
                value={draft.title ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => ({ ...d, title: v, slug: d.id ? d.slug : slugify(v) }));
                }}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-sub">Subtitle</Label>
              <Input id="p-sub" value={draft.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-slug">Web address</Label>
              <Input id="p-slug" value={draft.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                rows={5}
                value={draft.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p-format">Format</Label>
              <select
                id="p-format"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={draft.format ?? "eBook"}
                onChange={(e) => {
                  const f = e.target.value;
                  setDraft((d) => ({ ...d, format: f, is_digital: DIGITAL_FORMATS.includes(f as never) }));
                }}
              >
                {PRODUCT_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="p-cat">Category</Label>
              <Input id="p-cat" value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="p-price">Price (KES)</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                value={draft.price_kes ?? 0}
                onChange={(e) => set("price_kes", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="p-compare">Compare-at price (KES)</Label>
              <Input
                id="p-compare"
                type="number"
                min={0}
                value={draft.compare_at_kes ?? ""}
                onChange={(e) => set("compare_at_kes", e.target.value === "" ? null : Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="p-pages">Pages</Label>
              <Input
                id="p-pages"
                type="number"
                min={0}
                value={draft.pages ?? ""}
                onChange={(e) => set("pages", e.target.value === "" ? null : Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="p-year">Published year</Label>
              <Input
                id="p-year"
                type="number"
                value={draft.published_year ?? ""}
                onChange={(e) => set("published_year", e.target.value === "" ? null : Number(e.target.value))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-cover">Cover image URL</Label>
              <Input
                id="p-cover"
                value={draft.cover_image_url ?? ""}
                onChange={(e) => set("cover_image_url", e.target.value)}
              />
            </div>
            {!draft.is_digital && (
              <div>
                <Label htmlFor="p-stock">Stock</Label>
                <Input
                  id="p-stock"
                  type="number"
                  min={0}
                  value={draft.stock ?? 0}
                  onChange={(e) => set("stock", Number(e.target.value))}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <Label>Collections</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLLECTIONS.map((c) => {
                  const active = (draft.collections ?? []).includes(c.slug);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() =>
                        set(
                          "collections",
                          active
                            ? (draft.collections ?? []).filter((s) => s !== c.slug)
                            : [...(draft.collections ?? []), c.slug]
                        )
                      }
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "border-border text-muted-foreground hover:border-secondary/50"
                      }`}
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="p-featured"
                checked={!!draft.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
              <Label htmlFor="p-featured">Featured</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="p-status"
                checked={draft.status === "published"}
                onCheckedChange={(v) => set("status", v ? "published" : "draft")}
              />
              <Label htmlFor="p-status">Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPanel;
