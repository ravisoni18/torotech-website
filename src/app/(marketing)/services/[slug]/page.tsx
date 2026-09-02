import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished, listPublished } from "@/lib/content";
import { Container, CtaBand, ServiceIcon, Tag } from "@/components/marketing/ui";
import { Markdown } from "@/components/marketing/Markdown";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublished("service", slug);
  return item ? { title: item.title, description: item.excerpt ?? undefined } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublished("service", slug);
  if (!item) notFound();
  const others = (await listPublished("service")).filter((s) => s.id !== item.id);
  const outcomes = Array.isArray(item.data.outcomes) ? (item.data.outcomes as string[]) : [];

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container className="grid gap-12 md:grid-cols-[1fr_300px]">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-tint text-ink">
              <ServiceIcon name={item.data.icon} className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink md:text-5xl">{item.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{item.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <div className="mt-12">
              <Markdown source={item.body ?? ""} />
            </div>
          </div>
          <aside className="md:pt-24">
            <div className="sticky top-24 space-y-6">
              {outcomes.length > 0 && (
                <div className="rounded-[var(--radius-card)] bg-mist p-6">
                  <h2 className="text-sm font-bold text-ink">What you get</h2>
                  <ul className="mt-3 space-y-2.5 text-[15px] text-ink-soft">
                    {outcomes.map((o) => (
                      <li key={o} className="flex gap-2.5">
                        <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link
                href={`/contact?interest=${encodeURIComponent(item.title)}`}
                className="block rounded-full bg-ink px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-teal-deep"
              >
                Talk about this
              </Link>
              <div>
                <h2 className="text-sm font-bold text-ink">Other services</h2>
                <ul className="mt-3 space-y-2">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link href={`/services/${o.slug}`} className="text-[15px] text-teal-deep hover:underline">
                        {o.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
