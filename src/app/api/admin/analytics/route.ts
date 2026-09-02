import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-api";
import { overview } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async (req) => {
  const days = Number(new URL(req.url).searchParams.get("days") ?? 30);
  return NextResponse.json({ ok: true, ...(await overview(days)) });
});
