import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { admin, json } from "../_shared/db.ts";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
});

// Public contact form: stores the message, notifies the owner, acknowledges the visitor.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Please check the form fields." }, 400, corsHeaders);
    const d = parsed.data;
    const db = admin();

    // Simple rate limit: max 3 messages per email per 10 minutes.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await db.from("contact_submissions").select("id", { count: "exact", head: true })
      .eq("email", d.email).gte("created_at", since);
    if ((count ?? 0) >= 3) return json({ error: "Too many messages. Please try again later." }, 429, corsHeaders);

    const { data: row, error } = await db.from("contact_submissions")
      .insert({ name: d.name, email: d.email, subject: d.subject || null, message: d.message })
      .select("id").single();
    if (error || !row) return json({ error: "Could not save your message." }, 500, corsHeaders);

    // Emails are best-effort: the message is already saved.
    const results = await Promise.allSettled([
      sendTemplateEmail("contact-notification", "contact@ombachienock.me.ke", {
        templateData: d, replyTo: d.email, idempotencyKey: `contact-notify-${row.id}`,
      }),
      sendTemplateEmail("contact-acknowledgment", d.email, {
        templateData: { name: d.name, subject: d.subject }, idempotencyKey: `contact-ack-${row.id}`,
      }),
    ]);
    results.forEach((r) => r.status === "rejected" && console.error("contact email failed", r.reason));

    return json({ ok: true }, 200, corsHeaders);
  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected error" }, 500, corsHeaders);
  }
});
