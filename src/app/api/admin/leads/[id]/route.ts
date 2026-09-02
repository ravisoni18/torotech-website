import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute } from "@/lib/admin-api";
import { deleteLead, updateLeadStatus } from "@/lib/leads";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export const PATCH = adminRoute<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const { status } = z.object({ status: z.enum(["new", "contacted", "qualified", "won", "lost"]) }).parse(await req.json());
  await updateLeadStatus(id, status);
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  await deleteLead(id);
  return NextResponse.json({ ok: true });
});
