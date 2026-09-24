/** Client-safe content types and helpers (no database imports). */

export type ContentType = "service" | "case_study" | "post" | "page" | "product" | "cv_project";
export const CONTENT_TYPES: { value: ContentType; label: string; plural: string }[] = [
  { value: "service", label: "Service", plural: "Services" },
  { value: "case_study", label: "Case study", plural: "Case studies" },
  { value: "post", label: "Insight", plural: "Insights" },
  { value: "product", label: "Product", plural: "Products" },
  { value: "page", label: "Page", plural: "Pages" },
  { value: "cv_project", label: "CV project", plural: "CV projects" },
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

/** One item in a product showcase gallery — an image, an animated GIF, or a short video. */
export type MediaItem = {
  url: string;
  type: "image" | "video";
  caption?: string;
};

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

export function mediaKind(url: string): "image" | "video" {
  return VIDEO_EXT.test(url) ? "video" : "image";
}

/** Safely read a product's gallery out of its `data` JSON. */
export function productGallery(data: Record<string, unknown>): MediaItem[] {
  const raw = data.gallery;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m): m is Record<string, unknown> => Boolean(m) && typeof m === "object")
    .map((m) => {
      const url = String(m.url ?? "");
      return {
        url,
        type: m.type === "video" || m.type === "image" ? m.type : mediaKind(url),
        caption: m.caption ? String(m.caption) : undefined,
      };
    })
    .filter((m) => m.url);
}

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
    case "product":
      return `/products/${c.slug}`;
    case "cv_project":
      return `/ravisoni`;
    default:
      return `/${c.slug}`;
  }
}
