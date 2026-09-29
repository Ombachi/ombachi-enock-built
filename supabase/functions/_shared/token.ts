// HMAC tokens tying a payment request to the checkout that created the order,
// and authenticating M-PESA callbacks. Keyed by a server-only secret.
const secret = () =>
  Deno.env.get("MPESA_CALLBACK_SECRET") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export async function sign(purpose: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${purpose}:${value}`));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verify(purpose: string, value: string, token: unknown): Promise<boolean> {
  if (typeof token !== "string" || !token) return false;
  const expected = await sign(purpose, value);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
