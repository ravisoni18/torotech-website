import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPublished } from "@/lib/content";
import { TechMarquee } from "@/components/marketing/TechMarquee";
import { HeroBackdrop } from "@/components/marketing/HeroBackdrop";
import { Reveal } from "@/components/marketing/Reveal";
import { Counter } from "@/components/marketing/Counter";
import {
  CaseStudyCard,
  Container,
  CtaBand,
  PostCard,
  ProductCard,
  SectionHeading,
  ServiceCard,
  ServiceIcon,
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <Container className="grid items-center gap-12 pb-16 pt-14 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-20">
          <Reveal>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] text-ink md:text-[3.6rem]">
              Software that ships — from your website to SAP.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Torotech builds and ships six things well: websites and mobile apps with AI built in, BI
              dashboards you can trust, SAP BTP development and integration, automated testing, and
              workflow automation — each scoped to one process and one number you can check.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-deep hover:shadow-lg"
              >
                Book a call <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-line px-6 py-3 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
              >
                See all services
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              <div>
                <dt className="text-sm text-muted">Practice areas</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">
                  <Counter value="6" />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">First app live</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">1–2 days</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Years building software</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">
                  <Counter value="12+" />
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.15} direction="left">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[28px] bg-mist" />
              <div className="grid grid-cols-2 gap-3.5">
                {services.map((s, i) => (
                  <Reveal key={s.id} delay={0.2 + i * 0.06}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-line bg-paper p-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-md"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-tint text-ink transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <ServiceIcon name={s.data.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-ink">{s.title}</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

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
