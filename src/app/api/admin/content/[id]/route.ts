import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-api";
import { deleteContent, getById, updateContent } from "@/lib/content";
import { normaliseInput } from "@/lib/content-input";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export const GET = adminRoute<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const item = await getById(id);
  if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
});

export const PUT = adminRoute<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const input = await normaliseInput(await req.json());
  await updateContent(id, input);
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  await deleteContent(id);
  return NextResponse.json({ ok: true });
});
