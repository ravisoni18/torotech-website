import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/leads";
import { listFields, coerceFieldValue } from "@/lib/fields";
import { classifyDevice, recordEvent, visitorId } from "@/lib/analytics";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
  interest: z.string().trim().max(120).optional().nullable(),
  source: z.string().trim().max(120).optional().nullable(),
  page: z.string().trim().max(500).optional().nullable(),
  website: z.string().max(0).optional(), // honeypot — must stay empty
  fields: z.record(z.string(), z.unknown()).optional(),
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "0.0.0.0";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Try again in a minute." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the name and email fields." }, { status: 400 });
  }
  const input = parsed.data;
  if (input.website) return NextResponse.json({ ok: true }); // bot filled the honeypot

  // Custom (no-code) lead fields defined in the admin.
  const defs = await listFields("lead");
  const data: Record<string, unknown> = {};
  for (const def of defs) {
    const v = coerceFieldValue(def, input.fields?.[def.key]);
    if (v !== null && v !== undefined) data[def.key] = v;
  }

  const id = await createLead({ ...input, data });
  const ua = req.headers.get("user-agent") ?? "";
  await recordEvent({
    kind: "lead",
    path: input.page ?? "/contact",
    visitor: visitorId(ip, ua),
    device: classifyDevice(ua),
    ua,
    data: { lead_id: id, interest: input.interest ?? null },
  });
  return NextResponse.json({ ok: true, id });
}
