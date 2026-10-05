import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { listPublished } from "@/lib/content";
import { CaseStudyCard, Container, CtaBand } from "@/components/marketing/ui";
import { Reveal } from "@/components/marketing/Reveal";
import { Counter } from "@/components/marketing/Counter";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMeta({
  title: "Case studies — SAP, Fiori and AI projects",
  description:
    "Case studies from Torotech engagements: SAP Fiori and BTP apps, AI assistants on live SAP data and the numbers clients measured.",
  path: "/work",
});

export default async function WorkPage() {
  const items = await listPublished("case_study");
  const highlights = items
    .map((c) => ({ value: String(c.data.metric_value ?? ""), label: String(c.data.metric_label ?? "") }))
    .filter((h) => h.value);

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Work.</h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                A few engagements, with the number that mattered to the client. Names are withheld where we were
                asked; the figures are theirs.
              </p>
            </div>
          </Reveal>

          {highlights.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-6 border-y border-line py-8 sm:grid-cols-3">
              {highlights.map((h, i) => (
                <Reveal key={h.label} delay={i * 0.08}>
                  <div className="text-2xl font-extrabold text-ink md:text-3xl">
                    <Counter value={h.value} />
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">{h.label}</div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-12 grid gap-5">
            {items.map((c, i) => (
              <Reveal key={c.id} delay={Math.min(i, 4) * 0.08}>
                <CaseStudyCard item={c} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
