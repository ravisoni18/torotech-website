import "server-only";
import { db, newId } from "./db";

export type { ContentType, ContentRow, Content } from "./content-types";
export { CONTENT_TYPES, slugify, contentHref } from "./content-types";
import type { ContentType, ContentRow, Content } from "./content-types";

function parse(row: ContentRow): Content {
  return {
    ...row,
    tags: safeJson<string[]>(row.tags, []),
    data: safeJson<Record<string, unknown>>(row.data, {}),
  };
}

export function safeJson<T>(s: unknown, fallback: T): T {
  if (typeof s !== "string") return (s as T) ?? fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export async function listPublished(type: ContentType, limit = 50): Promise<Content[]> {
  const rows = await db.query<ContentRow>(
    `SELECT * FROM content WHERE type = ? AND status = 'published'
     ORDER BY sort_order ASC, published_at DESC LIMIT ?`,
    [type, limit],
  );
  return rows.map(parse);
}

export async function getPublished(type: ContentType, slug: string): Promise<Content | null> {
  const rows = await db.query<ContentRow>(
    `SELECT * FROM content WHERE type = ? AND slug = ? AND status = 'published' LIMIT 1`,
    [type, slug],
  );
  return rows[0] ? parse(rows[0]) : null;
}

export async function listAll(type?: ContentType): Promise<Content[]> {
  const rows = type
    ? await db.query<ContentRow>(`SELECT * FROM content WHERE type = ? ORDER BY updated_at DESC`, [type])
    : await db.query<ContentRow>(`SELECT * FROM content ORDER BY updated_at DESC`);
  return rows.map(parse);
}

export async function getById(id: string): Promise<Content | null> {
  const rows = await db.query<ContentRow>(`SELECT * FROM content WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? parse(rows[0]) : null;
}

export type ContentInput = {
  type: ContentType;
  slug: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  cover?: string | null;
  status: "draft" | "published";
  tags?: string[];
  data?: Record<string, unknown>;
  sort_order?: number;
};

export async function createContent(input: ContentInput): Promise<string> {
  const id = newId();
  await db.exec(
    `INSERT INTO content (id, type, slug, title, excerpt, body, cover, status, tags, data, sort_order, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'published' THEN now() ELSE NULL END)`,
    [
      id,
      input.type,
      input.slug,
      input.title,
      input.excerpt ?? null,
      input.body ?? null,
      input.cover ?? null,
      input.status,
      JSON.stringify(input.tags ?? []),
      JSON.stringify(input.data ?? {}),
      input.sort_order ?? 0,
      input.status,
    ],
  );
  return id;
}

export async function updateContent(id: string, input: ContentInput): Promise<void> {
  await db.exec(
    `UPDATE content SET type = ?, slug = ?, title = ?, excerpt = ?, body = ?, cover = ?, status = ?,
       tags = ?, data = ?, sort_order = ?, updated_at = now(),
       published_at = CASE WHEN ? = 'published' THEN coalesce(published_at, now()) ELSE published_at END
     WHERE id = ?`,
    [
      input.type,
      input.slug,
      input.title,
      input.excerpt ?? null,
      input.body ?? null,
      input.cover ?? null,
      input.status,
      JSON.stringify(input.tags ?? []),
      JSON.stringify(input.data ?? {}),
      input.sort_order ?? 0,
      input.status,
      id,
    ],
  );
}

export async function deleteContent(id: string): Promise<void> {
  await db.exec(`DELETE FROM content WHERE id = ?`, [id]);
}

