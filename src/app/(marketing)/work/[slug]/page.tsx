import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublished } from "@/lib/content";
import { Container, CtaBand, Tag } from "@/components/marketing/ui";
import { Markdown } from "@/components/marketing/Markdown";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublished("case_study", slug);
  return item ? { title: item.title, description: item.excerpt ?? undefined } : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublished("case_study", slug);
  if (!item) notFound();
  const d = item.data as Record<string, string | undefined>;
  const facts = [
    ["Client", d.client],
    ["Industry", d.industry],
    ["Length", d.duration],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container className="grid gap-12 md:grid-cols-[1fr_280px]">
          <div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">{item.title}</h1>
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
          <aside>
            <div className="sticky top-24 rounded-[var(--radius-card)] bg-ink p-6 text-white">
              <div className="text-5xl font-extrabold tracking-tight">{d.metric_value}</div>
              <div className="mt-1 text-[#c9d6e3]">{d.metric_label}</div>
              <dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-[#9fb1c4]">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </Container>
      </section>
      <CtaBand title="Have a process like this one?" />
    </>
  );
}
