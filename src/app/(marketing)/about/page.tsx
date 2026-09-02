import type { Metadata } from "next";
import Link from "next/link";
import { Container, CtaBand } from "@/components/marketing/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: "Torotech is an SAP and AI consultancy in Kitchener–Waterloo, Ontario." };

const PRINCIPLES = [
  {
    title: "The core stays clean",
    body: "Extensions live on BTP. Agents talk to SAP through released APIs and CDS views. Upgrades stay boring — that's the point.",
  },
  {
    title: "A person holds the pen",
    body: "Every write-back is proposed first and approved by someone with the authorisation to do it by hand. Auto-approval is earned with numbers.",
  },
  {
    title: "One process, one number",
    body: "We scope to a process you can name and a metric you can check. If we can't measure it in the first month, we don't start.",
  },
  {
    title: "Your repo, your subaccount",
    body: "Everything we build is handed over as code in your repository, deployed to infrastructure you own. No platform fee, no hostage.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              A small SAP practice that ships AI you can audit.
            </h1>
            <div className="prose-tt mt-8">
              <p>
                Torotech is led by <strong>Ravi Soni</strong>, an SAP BTP and Fiori solutions architect with more
                than twelve years across food distribution, healthcare, consulting and event management — including
                time at KPMG and Philips. Most of that work has been in the seam between S/4HANA and everything
                around it: CAP services, RAP behaviour definitions, OData V2/V4, ABAP CDS, Integration Suite and
                a great many Fiori apps.
              </p>
              <p>
                The AI work grew out of a simple observation: the people running SAP processes spend most of their
                day on exceptions, and exceptions are exactly where a well-scoped model helps — as long as it
                proposes rather than posts. That constraint shapes everything we build.
              </p>
              <p>
                We&apos;re based in {SITE.location}, and work with clients across Canada and the US, remotely and
                on site when it matters.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={SITE.linkedin} className="rounded-full border border-line px-5 py-2.5 font-semibold text-ink hover:border-ink">
                LinkedIn
              </Link>
              <Link href={SITE.github} className="rounded-full border border-line px-5 py-2.5 font-semibold text-ink hover:border-ink">
                GitHub
              </Link>
            </div>
          </div>
          <div className="rounded-[var(--radius-card)] bg-mist p-8">
            <h2 className="text-lg font-bold text-ink">How we work</h2>
            <ul className="mt-6 space-y-6">
              {PRINCIPLES.map((p) => (
                <li key={p.title}>
                  <h3 className="font-bold text-ink">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
