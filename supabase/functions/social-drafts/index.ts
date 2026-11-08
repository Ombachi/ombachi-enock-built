import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";
import { generateResponse, GatewayError } from "npm:@lovable.dev/ai-gateway";
import { admin, json } from "../_shared/db.ts";

const SITE = "https://www.ombachienock.me.ke";
const Body = z.object({ postId: z.string().uuid() });

// Admin-only: drafts a LinkedIn post and an X post for one publication.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u.user) return json({ error: "Sign in required." }, 401, corsHeaders);
    const db = admin();
    const { data: isAdmin } = await db.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Admins only." }, 403, corsHeaders);

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid post." }, 400, corsHeaders);
    const { data: post } = await db.from("posts").select("title, slug, excerpt, content").eq("id", parsed.data.postId).single();
    if (!post) return json({ error: "Post not found." }, 404, corsHeaders);

    const url = `${SITE}/writing/${post.slug}`;
    const text = String(post.content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 6000);
    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      instructions:
        "You write social posts for Ombachi Enock, a laboratory manager, founder of Litu Diagnostics, policy scholar and essayist. Tone: confident, reflective, practical; no hype, no corporate jargon, no hashtag spam (max 2). Return ONLY JSON: {\"linkedin\": string, \"x\": string}. LinkedIn: 80-180 words, first person, a strong opening line, ends with the link. X: max 260 characters including the link.",
      input: `Title: ${post.title}\nSummary: ${post.excerpt ?? ""}\nLink: ${url}\n\nText:\n${text}`,
    });
    const out = (res as { output_text?: string }).output_text ??
      JSON.stringify((res as { output?: unknown }).output ?? "");
    const match = out.match(/\{[\s\S]*\}/);
    const drafts = match ? JSON.parse(match[0]) : { linkedin: out, x: "" };
    return json({ linkedin: drafts.linkedin ?? "", x: drafts.x ?? "", url }, 200, corsHeaders);
  } catch (e) {
    if (e instanceof GatewayError) return json({ error: "AI drafting is unavailable right now. Please try again later." }, 502, corsHeaders);
    console.error(e);
    return json({ error: "Could not draft posts." }, 500, corsHeaders);
  }
});
