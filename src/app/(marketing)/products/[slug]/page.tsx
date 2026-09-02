import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished, listPublished } from "@/lib/content";
import { productGallery } from "@/lib/content-types";
import { Container, CtaBand, MediaFrame, Tag } from "@/components/marketing/ui";
import { Markdown } from "@/components/marketing/Markdown";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublished("product", slug);
  return item ? { title: item.title, description: item.excerpt ?? undefined } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublished("product", slug);
  if (!item) notFound();

  const gallery = productGallery(item.data);
  const hero = item.cover ? { url: item.cover } : gallery[0];
  const rest = item.cover ? gallery : gallery.slice(1);
  const tagline = typeof item.data.tagline === "string" ? item.data.tagline : "";
  const link = typeof item.data.link === "string" ? item.data.link : "";
  const statusLabel = typeof item.data.status_label === "string" ? item.data.status_label : "";
  const others = (await listPublished("product")).filter((p) => p.id !== item.id).slice(0, 3);

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <Link href="/products" className="text-sm font-medium text-teal-deep hover:underline">
            ← All products
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">{item.title}</h1>
            {statusLabel && (
              <span className="rounded-full bg-teal-tint px-3 py-1 text-sm font-semibold text-teal-deep">{statusLabel}</span>
            )}
          </div>
          {(tagline || item.excerpt) && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{tagline || item.excerpt}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            {link && (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-deep"
              >
                Visit product ↗
              </Link>
            )}
          </div>

          {hero && (
            <div className="mt-10 overflow-hidden rounded-[var(--radius-card)] border border-line bg-mist">
              <MediaFrame item={hero} priority className="h-auto w-full" />
            </div>
          )}

          {item.body && (
            <div className="mt-12 max-w-2xl">
              <Markdown source={item.body} />
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {rest.map((m, i) => (
                <figure key={`${m.url}-${i}`} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-mist">
                  <MediaFrame item={m} className="h-auto w-full" />
                  {m.caption && <figcaption className="px-4 py-3 text-sm text-ink-soft">{m.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </Container>
      </section>

      {others.length > 0 && (
        <section className="mt-20">
          <Container>
            <h2 className="text-sm font-bold text-ink">More products</h2>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={`/products/${o.slug}`} className="text-[15px] text-teal-deep hover:underline">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
