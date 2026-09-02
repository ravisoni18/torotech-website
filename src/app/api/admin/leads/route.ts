import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-api";
import { listLeads, type LeadStatus } from "@/lib/leads";

export const runtime = "nodejs";

export const GET = adminRoute(async (req) => {
  const status = new URL(req.url).searchParams.get("status") as LeadStatus | null;
  const items = await listLeads(status ?? undefined);
  return NextResponse.json({ ok: true, items });
});
