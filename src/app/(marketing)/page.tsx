import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPublished } from "@/lib/content";
import { SystemDiagram } from "@/components/marketing/SystemDiagram";
import { TechMarquee } from "@/components/marketing/TechMarquee";
import { CaseStudyCard, Container, CtaBand, PostCard, SectionHeading, ServiceCard } from "@/components/marketing/ui";

export const dynamic = "force-dynamic";

const PROCESS = [
  {
    title: "Walk the process",
    body: "One week with the people who do the work. We map the exceptions, the workarounds and the spreadsheet nobody admits to.",
  },
  {
    title: "Read-only agent",
    body: "The agent explains what it would do on live SAP data. Your team grades every proposal; nothing is written back.",
  },
  {
    title: "Approved actions",
    body: "Write-backs go behind a Fiori or Teams approval inbox. Auto-approval widens only as the precision numbers earn it.",
  },
  {
    title: "Hand-over",
    body: "Runbooks, dashboards, prompt and eval suites — all in your repo, on your BTP subaccount. No lock-in to us.",
  },
];

export default async function HomePage() {
  const [services, work, posts] = await Promise.all([
    listPublished("service", 4),
    listPublished("case_study", 3),
    listPublished("post", 3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <Container className="grid items-center gap-12 pb-16 pt-14 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-20">
          <div>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] text-ink md:text-[3.6rem]">
              AI that does real work inside SAP.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Torotech builds agents, BTP extensions and Fiori apps that read your S/4HANA data, propose
              the next action, and post it back — with a person approving the edge cases. We also build
              web applications with AI features that earn their place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-deep"
              >
                Book a call <ArrowRight size={18} />
              </Link>
              <Link
                href="/services/ai-for-sap"
                className="rounded-full border border-line px-6 py-3 font-semibold text-ink transition-colors hover:border-ink"
              >
                How the agents work
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              <div>
                <dt className="text-sm text-muted">SAP experience</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">12+ yrs</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">First agent live</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">6–8 wks</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Unapproved postings</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">0</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[28px] bg-mist" />
            <SystemDiagram className="h-auto w-full" />
          </div>
        </Container>
      </section>

      <TechMarquee />

      {/* Services */}
      <section className="pt-24">
        <Container>
          <SectionHeading
            title="Four things we do well."
            lede="Each engagement is scoped to one process and one number you can check. Pick the entry point that matches where you are."
            action={{ href: "/services", label: "All services" }}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <ServiceCard key={s.id} item={s} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="mt-24 bg-mist py-20">
        <Container>
          <SectionHeading
            title="How an engagement runs."
            lede="Trust is earned in the order below. Skipping a step is how AI projects end up as demos."
          />
          <ol className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="relative rounded-[var(--radius-card)] bg-paper p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Work */}
      <section className="pt-24">
        <Container>
          <SectionHeading
            title="Work that shipped."
            lede="Anonymised where clients ask; the numbers are theirs."
            action={{ href: "/work", label: "All case studies" }}
          />
          <div className="grid gap-5">
            {work.map((w) => (
              <CaseStudyCard key={w.id} item={w} />
            ))}
          </div>
        </Container>
      </section>

      {/* Insights */}
      <section className="pt-24">
        <Container>
          <SectionHeading
            title="Notes from the build."
            lede="Short, practical writing on agents, CDS, BTP and the odd architecture decision."
            action={{ href: "/blog", label: "All insights" }}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} item={p} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
