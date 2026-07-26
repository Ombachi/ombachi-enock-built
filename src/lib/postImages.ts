import { supabase } from "@/integrations/supabase/client";

// Long-lived signed URL (10 years) — used because the workspace blocks public buckets.
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadPostImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("post-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage
    .from("post-images")
    .createSignedUrl(path, TEN_YEARS);
  if (error || !data) throw error || new Error("Failed to create signed URL");
  return data.signedUrl;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}