import type { Metadata } from "next";
import { listPublished } from "@/lib/content";
import { CaseStudyCard, Container, CtaBand } from "@/components/marketing/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Work", description: "Case studies from Torotech engagements in SAP, BTP, Fiori and AI." };

export default async function WorkPage() {
  const items = await listPublished("case_study");
  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Work</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              A few engagements, with the number that mattered to the client. Names are withheld where we were
              asked; the figures are theirs.
            </p>
          </div>
          <div className="mt-12 grid gap-5">
            {items.map((c) => (
              <CaseStudyCard key={c.id} item={c} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
