import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { listPublished } from "@/lib/content";
import { Container, CtaBand, ServiceCard } from "@/components/marketing/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMeta({
  title: "Services — SAP BTP, Fiori, web, mobile, BI & automation",
  description:
    "Software development services from Kitchener, Ontario: websites and mobile apps with AI, BI dashboards, SAP BTP and Fiori development, Playwright test automation and n8n workflow automation.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await listPublished("service");
  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Services</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              From websites to SAP BTP to the automation holding it all together. Every service below is
              scoped to one process and one number, and hands over as code in your repository.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
