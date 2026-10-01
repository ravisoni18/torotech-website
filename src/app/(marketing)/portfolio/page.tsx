import type { Metadata } from "next";
import { listPublished } from "@/lib/content";
import type { Content } from "@/lib/content-types";
import { Container, CtaBand } from "@/components/marketing/ui";
import { PortfolioTabs, type PortfolioGroup } from "@/components/marketing/PortfolioTabs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work: AI assistants on live SAP data, Fiori and SAPUI5 apps, BI dashboards, warehouse mobile apps and an AI-enabled consulting site.",
};

const GROUPS: PortfolioGroup[] = [
  { id: "all", label: "All" },
  { id: "website", label: "Website" },
  { id: "mobile-apps", label: "Mobile Apps" },
  { id: "sap", label: "SAP BTP/Fiori Apps" },
  {
    id: "n8n",
    label: "N8N workflows",
    empty: {
      text: "Workflow write-ups are on their way. Meanwhile, build one yourself in the interactive n8n-style demo.",
      href: "/services/workflow-automation-n8n",
      cta: "Try the workflow demo",
    },
  },
  { id: "analytics", label: "Business Analytics" },
];

type Piece = {
  slug: string;
  /** Tab ids from GROUPS this piece appears under ("all" is implied). */
  groups: string[];
  title: string;
  /** Who it was for — by industry only, never the client's name. */
  sector: string;
  tags: string[];
  excerpt: string;
  body: string;
  duration?: string;
  link?: string;
  /** CV project whose uploaded screenshots and video this piece shows. */
  cvSlug?: string;
  /** Fallback cover when the CV project has no media. */
  cover?: string;
};

// Curated from the CV projects. Client names stay off this page — confidential engagements are described by industry.
const PIECES: Piece[] = [
  {
    slug: "torotech-site",
    groups: ["website"],
    title: "AI-enabled consulting site with live interactive demos",
    sector: "Torotech",
    tags: ["Next.js", "TypeScript", "React", "Node.js", "DuckDB", "Docker", "CI/CD"],
    excerpt: "This site — built end to end, with a working demo on every service page.",
    body: "Built and shipped end to end: a Next.js/TypeScript frontend, an embedded DuckDB content store instead of a heavier CMS, custom auth, and an admin panel non-developers publish from.\n\nEach service page carries a working interactive demo coded from scratch — a Fiori-style approval inbox, a BI dashboard with live drill-down charts, an n8n-style workflow builder and a Playwright bug-hunt game — so visitors experience the pattern instead of reading about it. Deployed on our own VPS with CI/CD through GitHub Actions.",
    link: "/services/sap-btp-development",
    cover: "/images/portfolio/torotech-site.jpg",
  },
  {
    slug: "shipment-ai-assistant",
    groups: ["sap", "analytics"],
    title: "AI shipment visibility & chat assistant",
    sector: "Food distributor",
    tags: ["SAP Fiori Elements", "RAP", "OData V4", "SAPUI5", "AI integration"],
    excerpt: "One screen for every shipment, plus an assistant that answers questions from live SAP data.",
    body: "A Fiori Elements app on SAP RAP with an OData V4 service, giving dispatchers one screen for every shipment: route, driver, vehicle, trailer and stops, with traffic-light flags for late or out-of-sequence deliveries.\n\nA built-in AI assistant answers plain-language questions straight from live SAP data — day summaries, driver rankings, filterable tables — with no exports or pivot tables.",
    cvSlug: "shipment-blotter-with-ai-assistant",
  },
  {
    slug: "field-visit-chat",
    groups: ["mobile-apps", "sap"],
    title: "Conversational field-visit logging app",
    sector: "Food distributor",
    tags: ["SAPUI5", "LLM integration", "Conversational UI", "SAP master data"],
    excerpt: "A chat-driven visit log that replaces a form for field sales reps. Delivered in 2 weeks.",
    body: "A chat-driven visit-logging flow for field sales reps that replaces a traditional form. The app steps reps through each required field, resolves SAP master data as they go, and uses an LLM (Claude Haiku 4.5 via OpenRouter) to interpret free text and clean up notes.\n\nDelivered in 2 weeks.",
    duration: "2 weeks",
    cvSlug: "field-app-ai-chat-bot",
  },
  {
    slug: "edi-fulfillment-tracker",
    groups: ["sap"],
    title: "EDI fulfillment tracker",
    sector: "Food distributor",
    tags: ["SAP Fiori", "SAPUI5", "EDI / iDoc", "Document flow"],
    excerpt: "Trace a shipment's paperwork end to end without digging through transaction codes.",
    body: "A custom SAPUI5 app that tracks incoming EDI iDocs and documents end to end, with a JSON/XML/PDF viewer and a document-flow tree so ops teams can trace a shipment's paperwork without digging through transaction codes.",
    duration: "6 months",
    cvSlug: "edi-fulfillment-tracker",
  },
  {
    slug: "customer-sales-360",
    groups: ["analytics"],
    title: "Customer sales 360° dashboard",
    sector: "Food distributor",
    tags: ["SAP Fiori", "SAPUI5", "Business intelligence", "Dashboard design"],
    excerpt: "Master data, AR, profitability, voids and recent orders for one customer — on one page.",
    body: "A single-customer 360° dashboard covering master data, AR and profitability history, product voids, sales averages, account blocks and recent orders — one page, no spreadsheet reconciliation. Built for the sales team.",
    cvSlug: "customer-sales-dashboard",
  },
  {
    slug: "sales-lead-dashboard",
    groups: ["analytics"],
    title: "Sales lead comparative dashboard",
    sector: "Food distributor",
    tags: ["SAP Fiori", "SAPUI5", "Business intelligence", "Sales analytics"],
    excerpt: "Current period against prior period, across products, customers, ship-tos and materials.",
    body: "A comparative sales analytics app measuring current-period performance against the prior period across products, customers, ship-tos and materials — the single view a sales lead checks each morning instead of pulling five separate reports.",
    cvSlug: "sales-lead-dashboard",
  },
  {
    slug: "ewm-barcode-scanner",
    groups: ["mobile-apps"],
    title: "EWM warehouse barcode scanner",
    sector: "Furniture retailer",
    tags: ["SAPUI5", "Cordova", "Mobile", "SAP EWM"],
    excerpt: "Inventory and bin-to-bin transfers from a phone, with stock graphs and reorder triggers.",
    body: "A mobile barcode-scanning app for warehouse inventory and bin-to-bin transfers, with live stock graphs, complaint logging and reorder triggers — built with SAPUI5 and Cordova for native camera and scanner access.",
    cvSlug: "ewm-barcode-scanner",
    cover: "/images/portfolio/ewm-cover.jpg",
  },
  {
    slug: "b2c-rewards-app",
    groups: ["mobile-apps"],
    title: "B2C rewards app",
    sector: "Furniture retailer",
    tags: ["Android", "iOS", "PHP", "OData"],
    excerpt: "Customers check their reward points on their phone, read straight from SAP.",
    body: "Native Android and iOS apps that fetch and show each customer's reward points from SAP, through a PHP middle layer over OData — so the loyalty balance a customer sees is the one in the ERP.",
    cvSlug: "b2c-rewards-app",
    cover: "/images/portfolio/rewards-cover.jpg",
  },
  {
    slug: "fiori-rollout",
    groups: ["sap"],
    title: "Enterprise-scale Fiori rollout (400+ apps)",
    sector: "Mining company",
    tags: ["SAP Fiori", "S/4HANA", "Program delivery", "Change management"],
    excerpt: "400+ standard Fiori apps across Plant Maintenance, Materials Management and Quality Management.",
    body: "Led the rapid deployment of 400+ standard Fiori apps across Plant Maintenance, Materials Management and Quality Management, plus custom adaptations of 6 standard PM apps and deep extensions to My Inbox, My Timesheet and Find Maintenance Notification.",
    cvSlug: "rapid-fiori-deployment",
    cover: "/images/portfolio/rollout-cover.jpg",
  },
];

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const cvProjects = await listPublished("cv_project", 100);
  const bySlug = new Map(cvProjects.map((p) => [p.slug, p]));

  const items = PIECES.map((piece, i) => {
    const source = piece.cvSlug ? bySlug.get(piece.cvSlug) : undefined;
    const gallery = Array.isArray(source?.data.gallery) ? source.data.gallery : [];
    const content: Content = {
      id: `portfolio-${piece.slug}`,
      type: "cv_project",
      slug: piece.slug,
      title: piece.title,
      excerpt: piece.excerpt,
      body: piece.body,
      // Uploaded screenshots win; the generated cover only fills in when there are none.
      cover: gallery.length ? null : (piece.cover ?? null),
      status: "published",
      tags: piece.tags,
      data: {
        client: piece.sector,
        tech: piece.tags.join(", "),
        duration: piece.duration,
        link: piece.link,
        gallery,
      },
      sort_order: i,
      created_at: source?.created_at ?? "",
      updated_at: source?.updated_at ?? "",
      published_at: source?.published_at ?? null,
    };
    return { groups: piece.groups, content };
  });

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Portfolio, <span className="font-serif font-normal italic text-teal-deep">in screenshots</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              AI assistants on live SAP data, Fiori and SAPUI5 apps, BI dashboards and warehouse mobile apps. Open any
              piece for the full story and every screenshot. Client work is confidential, so it&apos;s described by
              industry rather than name.
            </p>
          </div>
          <div className="mt-12">
            <PortfolioTabs groups={GROUPS} items={items} initial={tab ?? "all"} />
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
