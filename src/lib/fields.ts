import "server-only";
import { db, newId } from "./db";
import { safeJson } from "./content";

export type { FieldType, FieldEntity, FieldDef } from "./field-types";
export { FIELD_TYPES } from "./field-types";
import type { FieldEntity, FieldDef } from "./field-types";

type Row = Omit<FieldDef, "options"> & { options: string };

export async function listFields(entity?: FieldEntity): Promise<FieldDef[]> {
  const rows = entity
    ? await db.query<Row>(`SELECT * FROM field_defs WHERE entity = ? ORDER BY sort_order, created_at`, [entity])
    : await db.query<Row>(`SELECT * FROM field_defs ORDER BY entity, sort_order, created_at`);
  return rows.map((r) => ({ ...r, options: safeJson<string[]>(r.options, []) }));
}

export async function createField(f: Omit<FieldDef, "id">): Promise<string> {
  const id = newId();
  await db.exec(
    `INSERT INTO field_defs (id, entity, key, label, type, options, required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, f.entity, f.key, f.label, f.type, JSON.stringify(f.options ?? []), f.required, f.sort_order ?? 0],
  );
  return id;
}

export async function updateField(id: string, f: Omit<FieldDef, "id">): Promise<void> {
  await db.exec(
    `UPDATE field_defs SET entity = ?, key = ?, label = ?, type = ?, options = ?, required = ?, sort_order = ? WHERE id = ?`,
    [f.entity, f.key, f.label, f.type, JSON.stringify(f.options ?? []), f.required, f.sort_order ?? 0, id],
  );
}

export async function deleteField(id: string): Promise<void> {
  await db.exec(`DELETE FROM field_defs WHERE id = ?`, [id]);
}

/** Coerce a raw form value into the type declared by the field definition. */
export function coerceFieldValue(def: FieldDef, raw: unknown): unknown {
  if (raw === undefined || raw === null || raw === "") return def.type === "boolean" ? false : null;
  switch (def.type) {
    case "number": {
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    }
    case "boolean":
      return raw === true || raw === "true" || raw === "on" || raw === "1";
    case "list":
      if (Array.isArray(raw)) return raw.map(String);
      return String(raw)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    default:
      return String(raw);
  }
}
