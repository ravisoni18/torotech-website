import "server-only";
import { z } from "zod";
import { slugify, type ContentType } from "./content";
import { listFields, coerceFieldValue } from "./fields";

export const contentSchema = z.object({
  type: z.enum(["service", "case_study", "post", "page", "product", "cv_project"]),
  slug: z.string().trim().max(80).optional(),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().max(1000).optional().nullable(),
  body: z.string().max(200_000).optional().nullable(),
  cover: z.string().max(500).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  data: z.record(z.string(), z.unknown()).default({}),
  sort_order: z.coerce.number().int().default(0),
});

/** Validate an editor payload and coerce custom-field values by their definitions. */
export async function normaliseInput(raw: unknown) {
  const parsed = contentSchema.parse(raw);
  const defs = await listFields(parsed.type as ContentType);
  const data: Record<string, unknown> = {};
  for (const def of defs) {
    const v = coerceFieldValue(def, parsed.data[def.key]);
    if (v !== null && v !== undefined) data[def.key] = v;
  }
  // Keep unknown keys too — schema-flexible by design.
  for (const [k, v] of Object.entries(parsed.data)) if (!(k in data) && v !== "" && v != null) data[k] = v;
  return { ...parsed, slug: parsed.slug ? slugify(parsed.slug) : slugify(parsed.title), data };
}
