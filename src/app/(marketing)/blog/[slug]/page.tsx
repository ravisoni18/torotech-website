import type { Metadata } from "next";
import { pageMeta, breadcrumbLd, articleLd } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished, listPublished } from "@/lib/content";
import { Container, CtaBand, Tag, formatDate } from "@/components/marketing/ui";
import { Markdown } from "@/components/marketing/Markdown";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublished("post", slug);
  if (!item) return {};
  const image = item.cover || (Array.isArray(item.data.gallery) ? (item.data.gallery as { url?: string }[])[0]?.url : undefined);
  return pageMeta({ title: item.title, description: item.excerpt, path: `/blog/${item.slug}`, image, type: "article" });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublished("post", slug);
  if (!item) notFound();
  const d = item.data as Record<string, string | number | undefined>;
  const more = (await listPublished("post", 4)).filter((p) => p.id !== item.id).slice(0, 3);

  return (
    <>
      <JsonLd data={[breadcrumbLd([["Home", "/"], ["Insights", "/blog"], [item.title, `/blog/${item.slug}`]]), articleLd({ title: item.title, excerpt: item.excerpt, slug: item.slug, published: item.published_at, updated: item.updated_at, image: item.cover })]} />
      <article className="pt-16 md:pt-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-sm text-muted">
              {formatDate(item.published_at)}
              {d.author ? ` · ${d.author}` : ""}
              {d.reading_time ? ` · ${d.reading_time} min read` : ""}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">{item.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{item.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <div className="mt-12">
              <Markdown source={item.body ?? ""} />
            </div>
          </div>
          {more.length > 0 && (
            <div className="mx-auto mt-16 max-w-3xl border-t border-line pt-8">
              <h2 className="text-sm font-bold text-ink">More insights</h2>
              <ul className="mt-3 space-y-2">
                {more.map((p) => (
                  <li key={p.id}>
                    <Link href={`/blog/${p.slug}`} className="text-teal-deep hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </article>
      <CtaBand />
    </>
  );
}
