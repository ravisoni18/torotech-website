import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { SIMPLE_AUTH_ENABLED } from "@/lib/auth-config";
import { createSessionToken, verifyCredentials, SESSION_COOKIE } from "@/lib/simple-session";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(200),
});

// Very small in-memory rate limit per IP (resets on restart; fine behind one container).
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 5;
}

export async function POST(req: NextRequest) {
  if (!SIMPLE_AUTH_ENABLED) return NextResponse.json({ ok: false, error: "Not configured." }, { status: 404 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "0.0.0.0";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a minute." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Enter an email and password." }, { status: 400 });

  if (!verifyCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }

  // NODE_ENV is "production" in the container regardless of whether the connection is HTTP or
  // HTTPS, so the Secure flag has to follow the actual request — otherwise the browser silently
  // drops the cookie when this runs over plain HTTP (e.g. before Caddy/TLS is in front of it).
  const proto = req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
  const { token, maxAge } = await createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}
