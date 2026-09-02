import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute } from "@/lib/admin-api";
import { createField, listFields, type FieldEntity } from "@/lib/fields";

export const runtime = "nodejs";

const fieldSchema = z.object({
  entity: z.enum(["service", "case_study", "post", "page", "lead"]),
  key: z.string().trim().regex(/^[a-z][a-z0-9_]{0,40}$/, "Key must be snake_case, starting with a letter"),
  label: z.string().trim().min(1).max(80),
  type: z.enum(["text", "textarea", "number", "boolean", "select", "url", "date", "list"]),
  options: z.array(z.string().trim().max(80)).default([]),
  required: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export const GET = adminRoute(async (req) => {
  const entity = new URL(req.url).searchParams.get("entity") as FieldEntity | null;
  const items = await listFields(entity ?? undefined);
  return NextResponse.json({ ok: true, items });
});

export const POST = adminRoute(async (req) => {
  const input = fieldSchema.parse(await req.json());
  const id = await createField(input);
  return NextResponse.json({ ok: true, id }, { status: 201 });
});
