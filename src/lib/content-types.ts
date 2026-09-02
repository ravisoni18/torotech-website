/** Client-safe content types and helpers (no database imports). */

export type ContentType = "service" | "case_study" | "post" | "page";
export const CONTENT_TYPES: { value: ContentType; label: string; plural: string }[] = [
  { value: "service", label: "Service", plural: "Services" },
  { value: "case_study", label: "Case study", plural: "Case studies" },
  { value: "post", label: "Insight", plural: "Insights" },
  { value: "page", label: "Page", plural: "Pages" },
];

export type ContentRow = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover: string | null;
  status: "draft" | "published";
  tags: string;
  data: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type Content = Omit<ContentRow, "tags" | "data"> & {
  tags: string[];
  data: Record<string, unknown>;
};

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function contentHref(c: Pick<Content, "type" | "slug">) {
  switch (c.type) {
    case "service":
      return `/services/${c.slug}`;
    case "case_study":
      return `/work/${c.slug}`;
    case "post":
      return `/blog/${c.slug}`;
    default:
      return `/${c.slug}`;
  }
}
