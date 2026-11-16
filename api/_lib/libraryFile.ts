import { db, env, json, verify } from "./shared.js";

/** Only serve catalogue-owned files, never a caller-provided storage path or URL. */
export async function serveLibraryFile(req: Request, mode: "download" | "view") {
  try {
    const params = new URL(req.url).searchParams;
    const slug = params.get("slug");
    if (!slug) return json({ error: "Publication is required." }, 400);
    const sb = db();
    const { data: product, error } = await sb.from("products")
      .select("id,title,status,price_kes,file_path,html_file_path,html_url")
      .eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    if (!product) return json({ error: "Publication not found." }, 404);

    if (Number(product.price_kes) > 0) {
      const orderId = params.get("orderId");
      if (!orderId || !verify("access", orderId, params.get("token"))) {
        return json({ error: "Unlock this publication before opening its file." }, 403);
      }
      const [{ data: order }, { data: item }] = await Promise.all([
        sb.from("orders").select("status").eq("id", orderId).maybeSingle(),
        sb.from("order_items").select("id").eq("order_id", orderId).eq("product_id", product.id).limit(1).maybeSingle(),
      ]);
      if (order?.status !== "paid" || !item) return json({ error: "Payment for this publication has not been confirmed." }, 403);
    }

    const pdfPath = [product.file_path, product.html_file_path]
      .find((value) => typeof value === "string" && /\.pdf$/i.test(value));
    let path = mode === "view" ? pdfPath : (product.file_path || pdfPath);
    // PDFs entered in the interactive URL field must still come from our own library bucket.
    if (!path && product.html_url) {
      const storageOrigin = new URL(env("SUPABASE_URL") || env("VITE_SUPABASE_URL")).origin;
      const source = new URL(product.html_url, req.url);
      const match = source.pathname.match(/^\/storage\/v1\/object\/(?:public|sign|authenticated)\/library-files\/(.+)$/);
      if (source.origin === storageOrigin && match) path = decodeURIComponent(match[1]);
    }
    if (!path) return json({ error: "No file is attached to this publication yet." }, 404);
    const { data: file, error: fileError } = await sb.storage.from("library-files").download(path);
    if (fileError || !file) return json({ error: "The attached file could not be loaded. Please contact the author." }, 404);
    const bytes = await file.arrayBuffer();
    const pdf = new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
    if (mode === "view" && !pdf) return json({ error: "This file is not a PDF. Use Download to open it." }, 415);
    const extension = pdf ? "pdf" : path.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
    const filename = `${product.title.replace(/[^a-z0-9 _-]/gi, "").slice(0, 100) || "publication"}.${extension}`;
    return new Response(bytes, {
      headers: {
        "Content-Type": pdf ? "application/pdf" : "application/octet-stream",
        "Content-Disposition": `${mode === "view" ? "inline" : "attachment"}; filename="${filename}"`,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return json({ error: "File service unavailable. Please try again later." }, 500);
  }
}