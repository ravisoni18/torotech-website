import type { Metadata } from "next";
import { listPublished } from "@/lib/content";
import { Container, CtaBand, ServiceCard } from "@/components/marketing/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Services",
  description: "AI agents for S/4HANA, BTP extensions, Fiori & UI5 apps, and web applications with AI built in.",
};

export default async function ServicesPage() {
  const services = await listPublished("service");
  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Services</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              We work in the seam between SAP and the tools around it. Every service below is scoped to one
              process and one number, and hands over as code in your repository.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <ServiceCard key={s.id} item={s} index={i} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
