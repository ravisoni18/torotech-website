import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Rocket, ShieldCheck, Target } from "lucide-react";
import { Container, CtaBand } from "@/components/marketing/ui";
import { Reveal } from "@/components/marketing/Reveal";
import { Counter } from "@/components/marketing/Counter";
import { AboutFaq } from "@/components/marketing/AboutFaq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Torotech is an SAP and AI consultancy in Kitchener–Waterloo, Ontario, led by Ravi Soni.",
};

const STATS = [
  { value: "12+", label: "Years in SAP & software delivery" },
  { value: "6", label: "Practice areas, one team" },
  { value: "1–2 days", label: "To a first working agent or app" },
  { value: "0", label: "Unapproved postings, ever" },
];

const TIMELINE = [
  {
    year: "2010",
    title: "Started in mobile",
    body: "Shipped Blackberry and Android apps as a sole developer, then led mobile delivery — the first taste of owning a product end to end.",
  },
  {
    year: "2014",
    title: "Enterprise delivery at KPMG",
    body: "Founded KPMG India's mobile technology team; ran SAP and non-SAP enterprise projects across the Middle East.",
  },
  {
    year: "2017",
    title: "Fiori at global scale, Philips",
    body: "Founded Philips Healthcare's global Fiori team — architecture, DevOps and mobile Personas flavours used by teams worldwide.",
  },
  {
    year: "2020",
    title: "Leading a 30-person delivery team",
    body: "Ran the S/4HANA Fiori migration and 40+ custom apps for a large Australian conglomerate — an estimated $5–10M in customer value.",
  },
  {
    year: "2023",
    title: "SAP BTP / Fiori architect, present day",
    body: "Building agent-driven S/4HANA apps and BTP extensions at Mindfore Inc., alongside Torotech's own client work.",
  },
  {
    year: "Now",
    title: "Torotech",
    body: "Everything above, generalized: the same discipline applied to websites, mobile apps, BI, SAP BTP, test automation and workflow automation.",
  },
];

const VISION_MISSION = [
  {
    icon: Target,
    label: "Vision",
    title: "Software your team trusts enough to stop double-checking.",
    body: "AI and automation only earn their place when the person who owns the process can see exactly why the system did what it did.",
  },
  {
    icon: Rocket,
    label: "Mission",
    title: "Ship the first real result in days, not a discovery deck.",
    body: "Every engagement is scoped to one process and one number you can check within the first month — or we don't start.",
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "The core stays clean",
    body: "Extensions live on BTP. Agents talk to SAP through released APIs and CDS views. Upgrades stay boring — that's the point.",
  },
  {
    icon: Compass,
    title: "A person holds the pen",
    body: "Every write-back is proposed first and approved by someone with the authorisation to do it by hand. Auto-approval is earned with numbers.",
  },
  {
    icon: Target,
    title: "One process, one number",
    body: "We scope to a process you can name and a metric you can check. If we can't measure it in the first month, we don't start.",
  },
  {
    icon: Rocket,
    title: "Your repo, your infrastructure",
    body: "Everything we build is handed over as code in your repository, deployed to infrastructure you own. No platform fee, no hostage.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden pt-16 md:pt-24">
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-deep">About Torotech</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              A small practice that ships AI you can audit.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Torotech is led by <strong className="text-ink">Ravi Soni</strong>, an SAP BTP and Fiori solutions
              architect with more than twelve years across food distribution, healthcare, consulting and event
              management — including time at KPMG and Philips. The AI and automation work grew out of the same
              discipline: propose before you post, and measure what changed.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Stats */}
      <section className="pt-14">
        <Container>
          <div className="grid grid-cols-2 gap-6 border-y border-line py-10 md:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="text-3xl font-extrabold text-ink md:text-4xl">
                  <Counter value={s.value} />
                </div>
                <div className="mt-1 text-sm text-ink-soft">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-extrabold text-ink md:text-[2.5rem]">How we got here.</h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Torotech is the generalisation of a career spent shipping software people actually use.
            </p>
          </Reveal>
          <ol className="mt-12 space-y-10 border-l border-line pl-8 md:space-y-12">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} as="li" delay={Math.min(i, 4) * 0.06} className="relative">
                <span className="absolute -left-[41px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal ring-4 ring-paper" />
                <div className="text-sm font-bold text-teal-deep">{t.year}</div>
                <h3 className="mt-1 text-lg font-bold text-ink">{t.title}</h3>
                <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{t.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="mt-24 bg-mist py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {VISION_MISSION.map((v, i) => (
              <Reveal key={v.label} delay={i * 0.1}>
                <div className="h-full rounded-[var(--radius-card)] bg-paper p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-tint text-ink">
                    <v.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-bold uppercase tracking-[0.1em] text-teal-deep">{v.label}</p>
                  <h3 className="mt-2 text-xl font-bold leading-snug text-ink">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-extrabold text-ink md:text-[2.5rem]">How we work.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={Math.min(i, 3) * 0.06}>
                <div className="h-full rounded-[var(--radius-card)] border border-line p-7 transition-colors hover:border-teal">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mist text-ink">
                    <p.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-bold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-extrabold text-ink md:text-[2.5rem]">Questions we get asked.</h2>
          </Reveal>
          <div className="mt-10 max-w-3xl">
            <AboutFaq />
          </div>
        </Container>
      </section>

      {/* Links */}
      <section className="pt-24">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] bg-mist p-8">
              <p className="mr-auto text-[15px] text-ink-soft">
                Want the detailed career history behind this? The full CV has the roles, the numbers and the
                clients.
              </p>
              <Link href="/ravisoni" className="rounded-full bg-ink px-5 py-2.5 font-semibold text-white hover:bg-teal-deep">
                Full CV
              </Link>
              <Link href={SITE.linkedin} className="rounded-full border border-line px-5 py-2.5 font-semibold text-ink hover:border-ink">
                LinkedIn
              </Link>
              <Link href={SITE.github} className="rounded-full border border-line px-5 py-2.5 font-semibold text-ink hover:border-ink">
                GitHub
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
