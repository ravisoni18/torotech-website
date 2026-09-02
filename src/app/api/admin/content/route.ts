import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-api";
import { createContent, listAll, type ContentType } from "@/lib/content";
import { normaliseInput } from "@/lib/content-input";

export const runtime = "nodejs";

export const GET = adminRoute(async (req) => {
  const type = new URL(req.url).searchParams.get("type") as ContentType | null;
  const items = await listAll(type ?? undefined);
  return NextResponse.json({ ok: true, items });
});

export const POST = adminRoute(async (req) => {
  const input = await normaliseInput(await req.json());
  const id = await createContent(input);
  return NextResponse.json({ ok: true, id }, { status: 201 });
});
