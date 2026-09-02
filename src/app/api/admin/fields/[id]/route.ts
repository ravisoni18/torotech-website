import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute } from "@/lib/admin-api";
import { deleteField, updateField } from "@/lib/fields";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

const fieldSchema = z.object({
  entity: z.enum(["service", "case_study", "post", "page", "lead"]),
  key: z.string().trim().regex(/^[a-z][a-z0-9_]{0,40}$/),
  label: z.string().trim().min(1).max(80),
  type: z.enum(["text", "textarea", "number", "boolean", "select", "url", "date", "list"]),
  options: z.array(z.string().trim().max(80)).default([]),
  required: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export const PUT = adminRoute<Ctx>(async (req, { params }) => {
  const { id } = await params;
  await updateField(id, fieldSchema.parse(await req.json()));
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  await deleteField(id);
  return NextResponse.json({ ok: true });
});
