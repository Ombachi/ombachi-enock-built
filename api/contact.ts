import { env, json } from "./_lib/shared";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(req: Request): Promise<Response> {
  const key = env("RESEND_API_KEY");
  if (!key) return json({ error: "Email is not configured on the server (RESEND_API_KEY missing)." }, 500);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 255);
  const subject = String(body.subject ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Name, valid email and message are required." }, 400);

  const from = env("RESEND_FROM") || "Ombachi Enock <noreply@ombachienock.me.ke>";
  const to = env("CONTACT_TO") || "ombachienock5@outlook.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], reply_to: email,
      subject: `New message: ${subject || "Website contact"} — ${name}`,
      html: `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p><strong>Subject:</strong> ${esc(subject || "—")}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  });
  if (!res.ok) {
    const details = await res.text();
    console.error(`Resend failed [${res.status}]: ${details}`);
    return json({ error: "Email provider rejected the request", status: res.status, details }, res.status);
  }
  return json({ ok: true });
}
