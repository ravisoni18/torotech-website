import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { classifyDevice, recordEvent, visitorId } from "@/lib/analytics";

export const runtime = "nodejs";

const schema = z.object({
  kind: z.enum(["pageview", "cta"]).default("pageview"),
  path: z.string().max(500),
  referrer: z.string().max(1000).optional().nullable(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const ua = req.headers.get("user-agent") ?? "";
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "0.0.0.0";
  const country = req.headers.get("cf-ipcountry") ?? req.headers.get("x-vercel-ip-country") ?? null;

  // Ignore admin traffic and prefetches.
  if (parsed.data.path.startsWith("/admin") || req.headers.get("purpose") === "prefetch") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  await recordEvent({
    kind: parsed.data.kind,
    path: parsed.data.path,
    referrer: parsed.data.referrer ?? null,
    visitor: visitorId(ip, ua),
    device: classifyDevice(ua),
    ua,
    country,
    data: parsed.data.data,
  });
  return NextResponse.json({ ok: true });
}
