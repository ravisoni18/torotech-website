import type { MetadataRoute } from "next";
import { listPublished, contentHref } from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, posts] = await Promise.all([
    listPublished("service", 100),
    listPublished("case_study", 100),
    listPublished("post", 500),
  ]);
  const statics = ["", "/services", "/work", "/blog", "/about", "/contact"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
  }));
  const items = [...services, ...work, ...posts].map((c) => ({
    url: `${SITE.url}${contentHref(c)}`,
    lastModified: new Date(c.updated_at),
  }));
  return [...statics, ...items];
}
