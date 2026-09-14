import { supabase } from "@/integrations/supabase/client";

export const LIBRARY_BUCKET = "library-files";

export const DOCUMENT_ACCEPT =
  ".pdf,.epub,.doc,.docx,.odt,.rtf,.txt,.md,.ppt,.pptx,.xls,.xlsx,.csv,.zip";

/** Uploads a publication file to the private library bucket and returns its path. */
export async function uploadLibraryFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(LIBRARY_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw error;
  return path;
}

/** Short-lived signed link so an admin can check the stored file. */
export async function signedLibraryUrl(path: string, download = true): Promise<string> {
  const { data, error } = await supabase.storage
    .from(LIBRARY_BUCKET)
    .createSignedUrl(path, 300, { download });
  if (error || !data) throw error ?? new Error("Could not create a link for this file.");
  return data.signedUrl;
}

export async function deleteLibraryFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(LIBRARY_BUCKET).remove([path]);
  if (error) throw error;
}

export const fileNameFromPath = (path: string) => path.split("/").pop() ?? path;
