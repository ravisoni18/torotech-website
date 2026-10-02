import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished, listPublished } from "@/lib/content";
import { Container, CtaBand, ServiceIcon, Tag } from "@/components/marketing/ui";
import { Markdown } from "@/components/marketing/Markdown";
import { SystemDiagram } from "@/components/marketing/SystemDiagram";
import { SapApprovalDemo } from "@/components/marketing/SapApprovalDemo";
import { N8nGame } from "@/components/marketing/N8nGame";
import { PlaywrightGame } from "@/components/marketing/PlaywrightGame";
import { MobileProcess } from "@/components/marketing/MobileProcess";
import { MobileStackGame } from "@/components/marketing/MobileStackGame";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

const sapOfferings = [
  {
    title: "SAP Build",
    body: "We turn process owners' ideas into working apps and automations on SAP Build, then add the guardrails IT needs: transports, roles and a clean path to production. You get the low-code speed without the shadow-IT mess.",
    image: "/images/sap/sap-build.jpg",
  },
  {
    title: "SAP Integration Suite",
    body: "We design and build iFlows, API proxies and event meshes that connect S/4HANA to Salesforce, banks, carriers and everything else in your landscape. Every interface ships with monitoring, alerting and retry logic, so failures surface before your users notice them.",
    image: "/images/sap/sap-integration-suite.jpg",
  },
  {
    title: "SAP Fiori / UI5 / CAPM",
    body: "We build Fiori apps your users actually want to open: SAPUI5 and Fiori elements front ends on top of CAP services on BTP. The result is clean-core extensions that survive upgrades and look native in the Launchpad.",
    image: "/images/sap/sap-fiori-ui5.png",
  },
  {
    title: "SAP ABAP, CDS and RAP",
    body: "We write modern ABAP: CDS views, RAP business objects and released APIs that keep your S/4HANA core clean and cloud-ready. We also refactor legacy Z-code, so custom logic stops being the thing that blocks your next upgrade.",
    image: "/images/sap/sap-abap.png",
  },
  {
    title: "SAP Business Process Automation",
    body: "We map your approval chains, document intake and repetitive back-office steps, then automate them with SAP Build Process Automation and AI agents. Every automated decision keeps a human sign-off and a full audit trail.",
    image: "/images/sap/sap-process-automation.png",
  },
  {
    title: "SAP Basis",
    body: "We handle system administration, BTP subaccount setup, transports, performance tuning and upgrade planning, so your SAP estate stays fast, patched and secure. It's senior Basis expertise on call, without adding headcount.",
    image: "/images/sap/sap-basis.webp",
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublished("service", slug);
  return item ? { title: item.title, description: item.excerpt ?? undefined } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublished("service", slug);
  if (!item) notFound();
  const others = (await listPublished("service")).filter((s) => s.id !== item.id);
  const outcomes = Array.isArray(item.data.outcomes) ? (item.data.outcomes as string[]) : [];

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container className="grid gap-12 md:grid-cols-[1fr_300px]">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-tint text-ink">
              <ServiceIcon name={item.data.icon} className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink md:text-5xl">{item.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{item.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            {slug === "sap-btp-development" && (
              <div className="mt-16">
                <h2 className="text-3xl font-extrabold text-ink">What we build on SAP</h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  One senior team across the whole SAP stack, from the ABAP core to BTP, integration and Basis.
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                  {sapOfferings.map((o, i) => (
                    <div
                      key={o.title}
                      className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-mist transition-colors hover:border-teal"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={o.image}
                          alt={o.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-7">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-tint text-sm font-bold text-teal-deep">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="mt-6">
                          <h3 className="text-xl font-bold text-ink">{o.title}</h3>
                          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{o.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {slug === "sap-btp-development" && (
              <div className="mt-10">
                <div className="relative">
                  <div className="absolute -inset-6 -z-10 rounded-[28px] bg-mist" />
                  <SystemDiagram className="h-auto w-full" />
                </div>
                <dl className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                  <div>
                    <dt className="text-sm text-muted">SAP experience</dt>
                    <dd className="mt-1 text-2xl font-extrabold text-ink">12+ yrs</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">First agent live</dt>
                    <dd className="mt-1 text-2xl font-extrabold text-ink">1–2 days</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Unapproved postings</dt>
                    <dd className="mt-1 text-2xl font-extrabold text-ink">0</dd>
                  </div>
                </dl>
                <div className="mt-10">
                  <SapApprovalDemo />
                </div>
              </div>
            )}
            {slug === "mobile-app-development" && (
              <div className="mt-10">
                <div className="overflow-hidden rounded-[28px] border border-line bg-[#0f172a]">
                  <iframe
                    src="/demos/mobile-swipe-demo.html"
                    title="Enterprise product discovery app — swipe demo"
                    className="h-[700px] w-full md:h-[780px]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  A working demo, not a mockup — swipe a card or tap the buttons. Same pattern (gesture-driven,
                  stateful, offline-friendly) we build in React Native for a real app.{" "}
                  <a
                    href="/demos/mobile-swipe-demo.html"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-teal-deep hover:underline"
                  >
                    Open full-screen ↗
                  </a>
                </p>
                <div className="mt-16">
                  <MobileProcess />
                </div>
                <div id="stack-game" className="mt-16 scroll-mt-24">
                  <h2 className="text-3xl font-extrabold text-ink">Find your stack in 60 seconds</h2>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
                    Answer seven questions about your users, devices and data. The fit meter re-ranks native,
                    cross-platform and HTML5 as you go, then you get a full frontend, backend, hosting, security and
                    testing recommendation.
                  </p>
                  <div className="mt-8">
                    <MobileStackGame />
                  </div>
                </div>
              </div>
            )}
            {slug === "business-intelligence-ai" && (
              <div className="mt-10">
                <div className="overflow-hidden rounded-[28px] border border-line bg-[#f3f4f6]">
                  <iframe
                    src="/demos/bi-desktop-dashboard.html"
                    title="Enterprise BI dashboard — drill-down demo"
                    className="h-[720px] w-full md:h-[820px]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  A live dashboard, not a screenshot — click a region bar or a category slice to drill down;
                  every KPI, chart and table updates together. That's the semantic-layer pattern we build:
                  one data model, no duplicate logic.{" "}
                  <a
                    href="/demos/bi-desktop-dashboard.html"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-teal-deep hover:underline"
                  >
                    Open full-screen ↗
                  </a>
                </p>
              </div>
            )}
            {slug === "web-development" && (
              <div className="mt-10">
                <div className="overflow-hidden rounded-[28px] border border-line bg-[#090612]">
                  <iframe
                    src="/demos/toro-ai-workspace.html"
                    title="Toro AI enterprise workspace — chat, analytics and knowledge base demo"
                    className="h-[720px] w-full md:h-[820px]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  Toro AI, the chat layer we build into apps like this one — enterprise chat, usage analytics and
                  a RAG knowledge base in one workspace. Switch tabs on the left to try each view.{" "}
                  <a
                    href="/demos/toro-ai-workspace.html"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-teal-deep hover:underline"
                  >
                    Open full-screen ↗
                  </a>
                </p>
              </div>
            )}
            {slug === "workflow-automation-n8n" && (
              <div id="workflow-game" className="mt-10 scroll-mt-24">
                <N8nGame />
                <p className="mt-3 text-sm text-ink-soft">
                  Build the pipeline yourself — tap a node, then tap another to join them, and hit "Execute."
                  Same node-and-connection model as a real n8n canvas, three missions, works on a phone.
                </p>
              </div>
            )}
            {slug === "automation-testing-playwright" && (
              <div id="bug-hunt" className="mt-10 scroll-mt-24">
                <PlaywrightGame />
                <p className="mt-3 text-sm text-ink-soft">
                  Six real defect patterns hidden in a mock checkout page — tap each one before the clock
                  runs out. The report on the right fills in with the assertion that would have caught it in CI.
                </p>
              </div>
            )}
            <div className="mt-12">
              <Markdown source={item.body ?? ""} />
            </div>
          </div>
          <aside className="md:pt-24">
            <div className="sticky top-24 space-y-6">
              {outcomes.length > 0 && (
                <div className="rounded-[var(--radius-card)] bg-mist p-6">
                  <h2 className="text-sm font-bold text-ink">What you get</h2>
                  <ul className="mt-3 space-y-2.5 text-[15px] text-ink-soft">
                    {outcomes.map((o) => (
                      <li key={o} className="flex gap-2.5">
                        <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link
                href={`/contact?interest=${encodeURIComponent(item.title)}`}
                className="block rounded-full bg-ink px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-teal-deep"
              >
                Talk about this
              </Link>
              <div>
                <h2 className="text-sm font-bold text-ink">Other services</h2>
                <ul className="mt-3 space-y-2">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link href={`/services/${o.slug}`} className="text-[15px] text-teal-deep hover:underline">
                        {o.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}