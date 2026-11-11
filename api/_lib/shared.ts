import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const env = (k: string) => (process.env[k] ?? "").trim();

export const db = () => {
  const url = env("SUPABASE_URL") || env("VITE_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Database keys are missing on the server.");
  return createClient(url, key, { auth: { persistSession: false } });
};

const secret = () => env("MPESA_CALLBACK_SECRET") || env("SUPABASE_SERVICE_ROLE_KEY");

export const sign = (purpose: string, value: string) =>
  createHmac("sha256", secret()).update(`${purpose}:${value}`).digest("hex");

export const verify = (purpose: string, value: string, token: unknown) => {
  if (typeof token !== "string" || !token) return false;
  const a = Buffer.from(sign(purpose, value));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const darajaBase = () =>
  env("MPESA_ENV") === "sandbox" ? "https://sandbox.safaricom.co.ke" : "https://api.safaricom.co.ke";

export const darajaToken = async (): Promise<string | null> => {
  const auth = Buffer.from(`${env("MPESA_CONSUMER_KEY")}:${env("MPESA_CONSUMER_SECRET")}`).toString("base64");
  const r = await fetch(`${darajaBase()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const j = await r.json().catch(() => ({}));
  return j.access_token ?? null;
};

export const stkPassword = () => {
  const ts = new Date(Date.now() + 3 * 3600 * 1000).toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const pw = Buffer.from(`${env("MPESA_SHORTCODE")}${env("MPESA_PASSKEY")}${ts}`).toString("base64");
  return { ts, pw };
};
