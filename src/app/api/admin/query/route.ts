import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute } from "@/lib/admin-api";
import { readOnlyQuery } from "@/lib/analytics";

export const runtime = "nodejs";

export const POST = adminRoute(async (req) => {
  const { sql } = z.object({ sql: z.string().min(1).max(10_000) }).parse(await req.json());
  const started = performance.now();
  const rows = await readOnlyQuery(sql);
  return NextResponse.json({ ok: true, rows, ms: Math.round(performance.now() - started) });
});
