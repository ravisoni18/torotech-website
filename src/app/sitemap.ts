import type { MetadataRoute } from "next";
import { listPublished, contentHref } from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, posts, products] = await Promise.all([
    listPublished("service", 100),
    listPublished("case_study", 100),
    listPublished("post", 500),
    listPublished("product", 100),
  ]);
  const statics: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"], ["/services", 0.9, "monthly"], ["/products", 0.8, "monthly"], ["/portfolio", 0.8, "weekly"],
    ["/work", 0.7, "monthly"], ["/blog", 0.7, "weekly"], ["/about", 0.6, "yearly"], ["/contact", 0.8, "yearly"], ["/ravisoni", 0.5, "monthly"], ["/legal", 0.2, "yearly"], ["/privacy", 0.2, "yearly"],
  ];
  const priority = { service: 0.9, product: 0.8, case_study: 0.7, post: 0.6 } as Record<string, number>;
  const items = [...services, ...work, ...posts, ...products].map((c) => ({
    url: `${SITE.url}${contentHref(c)}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "monthly" as const,
    priority: priority[c.type] ?? 0.5,
  }));
  const pages = statics.map(([p, pr, freq]) => ({ url: `${SITE.url}${p}`, lastModified: new Date(), changeFrequency: freq, priority: pr }));
  return [...pages, ...items];
}
