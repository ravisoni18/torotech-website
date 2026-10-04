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
  const demoUrl = typeof item.data.demo_url === "string" ? item.data.demo_url : "";
  const phone = item.data.demo_device === "phone";
  const highlights = Array.isArray(item.data.highlights) ? item.data.highlights.map(String).filter(Boolean) : [];
  const walkthrough = `/contact?message=${encodeURIComponent(`I'd like a walkthrough of ${item.title}.`)}`;
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
            {demoUrl && (
              <a href="#demo" className="rounded-full bg-teal-deep px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink">
                Try it live ↓
              </a>
            )}
            <Link href={walkthrough} className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink">
              Book a walkthrough
            </Link>
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

          {demoUrl ? (
            <div id="demo" className="mt-10 scroll-mt-24">
              {phone ? (
                // Phone demos draw their own device, so the frame is just a sized window onto them.
                <div className="mx-auto max-w-[430px] overflow-hidden rounded-[28px] border border-line bg-[#0f172a] shadow-[0_40px_80px_-40px_rgba(11,31,58,0.55)]">
                  <iframe src={demoUrl} title={`${item.title} — live demo`} className="h-[780px] w-full" loading="lazy" />
                </div>
              ) : (
                <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper shadow-[0_40px_80px_-40px_rgba(11,31,58,0.45)]">
                  <div className="flex items-center gap-2 border-b border-line bg-mist px-4 py-2.5">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    <span className="ml-3 truncate rounded-md bg-paper px-3 py-1 text-xs text-muted">{item.title.toLowerCase().replace(/\s+/g, "-")}.demo</span>
                  </div>
                  <iframe src={demoUrl} title={`${item.title} — live demo`} className="h-[640px] w-full md:h-[760px]" loading="lazy" />
                </div>
              )}
              <p className="mt-3 text-center text-sm text-ink-soft">
                A working demo on sample data — click around, nothing is saved or sent.{" "}
                <a href={demoUrl} target="_blank" rel="noreferrer" className="font-semibold text-teal-deep hover:underline">
                  Open full-screen ↗
                </a>
              </p>
            </div>
          ) : hero && (
            <div className="mt-10 overflow-hidden rounded-[var(--radius-card)] border border-line bg-mist">
              <MediaFrame item={hero} priority className="h-auto w-full" />
            </div>
          )}

          {highlights.length > 0 && (
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((h, i) => (
                <div key={h} className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-tint text-sm font-bold text-teal-deep">{i + 1}</span>
                  <p className="mt-3 text-[15px] font-semibold leading-snug text-ink">{h}</p>
                </div>
              ))}
            </div>
          )}

          {item.body && (
            <div className="mt-12 max-w-2xl">
              <Markdown source={item.body} />
            </div>
          )}

          {demoUrl && (
            <div className="mt-12 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] bg-mist p-6">
              <p className="flex-1 text-[15px] text-ink-soft">
                Want {item.title} on your own data? We&apos;ll show you how it connects to your systems in a 30-minute call.
              </p>
              <Link href={walkthrough} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-deep">
                Book a walkthrough
              </Link>
            </div>
          )}

          {(demoUrl ? gallery : rest).length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {(demoUrl ? gallery : rest).map((m, i) => (
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
