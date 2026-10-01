import { listPublished } from "@/lib/content";
import { TechMarquee } from "@/components/marketing/TechMarquee";
import { HeroArc } from "@/components/marketing/HeroArc";
import { Reveal } from "@/components/marketing/Reveal";
import { ApprovalGame } from "@/components/marketing/ApprovalGame";
import {
  CaseStudyCard,
  Container,
  CtaBand,
  PostCard,
  ProductCard,
  SectionHeading,
  ServiceCard,
} from "@/components/marketing/ui";

export const dynamic = "force-dynamic";

const PROCESS = [
  {
    title: "Walk the process",
    body: "One week with the people who do the work. We map the exceptions, the workarounds and the spreadsheet nobody admits to.",
  },
  {
    title: "Read-only agent",
    body: "The agent or dashboard explains what it would do against your real data. Your team grades every proposal before anything goes live.",
  },
  {
    title: "Approved actions",
    body: "Write-backs and automations go behind an approval inbox — Fiori, Teams, Slack, whatever you already use. Auto-approval widens only as the precision numbers earn it.",
  },
  {
    title: "Hand-over",
    body: "Runbooks, dashboards, prompt and eval suites — all in your repo, on your own infrastructure. No lock-in to us.",
  },
];

export default async function HomePage() {
  const [services, work, posts, products] = await Promise.all([
    listPublished("service", 6),
    listPublished("case_study", 3),
    listPublished("post", 3),
    listPublished("product", 3),
  ]);

  return (
    <>
      <HeroArc />

      <TechMarquee />

      {/* Services */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <SectionHeading
              title="Six things we do well."
              lede="Each engagement is scoped to one process and one number you can check. Pick the entry point that matches where you are."
              action={{ href: "/services", label: "All services" }}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i, 5) * 0.07}>
                <ServiceCard item={s} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="mt-24 bg-mist py-20">
        <Container>
          <Reveal>
            <SectionHeading
              title="How an engagement runs."
              lede="Trust is earned in the order below. Skipping a step is how AI projects end up as demos."
            />
          </Reveal>
          <ol className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} as="li" delay={i * 0.08}>
                <div className="relative h-full rounded-[var(--radius-card)] bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Play the approver */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <SectionHeading
              title="Think you'd call it right?"
              lede="This is the exact decision our agents hand to a human — twenty seconds, real scenarios, no do-overs."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ApprovalGame />
          </Reveal>
        </Container>
      </section>

      {/* Work */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <SectionHeading
              title="Work that shipped."
              lede="Anonymised where clients ask; the numbers are theirs."
              action={{ href: "/work", label: "All case studies" }}
            />
          </Reveal>
          <div className="grid gap-5">
            {work.map((w, i) => (
              <Reveal key={w.id} delay={i * 0.08}>
                <CaseStudyCard item={w} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="pt-24">
          <Container>
            <Reveal>
              <SectionHeading
                title="Things we've built."
                lede="Tools and products, shown in motion — not slideware."
                action={{ href: "/products", label: "All products" }}
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProductCard item={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Insights */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <SectionHeading
              title="Notes from the build."
              lede="Short, practical writing on agents, CDS, BTP and the odd architecture decision."
              action={{ href: "/blog", label: "All insights" }}
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <PostCard item={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
