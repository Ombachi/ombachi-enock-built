// Rewrites old cloud-storage image links to the copies bundled under /articles/.
const LEGACY_URL = /https?:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/(?:sign|public)\/[^/"'\s]+\/([^"'\s?<>]+)(?:\?[^"'\s<>]*)?/gi;

export const fixLegacyUrl = <T extends string | null | undefined>(url: T): T =>
  (url ? url.replace(LEGACY_URL, (_m, file: string) => `/articles/${file.split("/").pop()}`) : url) as T;

export const fixLegacyHtml = (html: string | null | undefined): string =>
  html ? html.replace(LEGACY_URL, (_m, file: string) => `/articles/${file.split("/").pop()}`) : "";
