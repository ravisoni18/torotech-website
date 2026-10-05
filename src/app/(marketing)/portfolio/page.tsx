import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { listPublished } from "@/lib/content";
import type { Content } from "@/lib/content-types";
import { Container, CtaBand } from "@/components/marketing/ui";
import { PortfolioTabs, type PortfolioGroup } from "@/components/marketing/PortfolioTabs";
import { TAB_LABELS } from "@/lib/portfolio-seed";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMeta({
  title: "Portfolio — SAP Fiori apps, websites, mobile apps and AI",
  description:
    "Portfolio of SAP Fiori and SAPUI5 apps, AI assistants on SAP data, BI dashboards, websites, mobile apps and interactive demos by Torotech in Kitchener, Ontario.",
  path: "/portfolio",
});

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
  { id: "products", label: "In-house Products" },
  { id: "games", label: "Enterprise Games" },
];

/** Products already covered by a curated piece above, so they don't appear twice. */
const PRODUCTS_SHOWN_AS_PIECES = new Set(["torotech-ca"]);

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const [pieces, cvProjects, products] = await Promise.all([
    listPublished("portfolio", 500),
    listPublished("cv_project", 100),
    listPublished("product", 100),
  ]);
  const bySlug = new Map(cvProjects.map((p) => [p.slug, p]));
  // Admins write tab names ("Mobile Apps") or ids ("mobile-apps"); both map to a tab id.
  const tabId = new Map<string, string>();
  for (const [id, label] of Object.entries(TAB_LABELS)) { tabId.set(id, id); tabId.set(label.toLowerCase(), id); }
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

  const items: { groups: string[]; content: Content }[] = pieces.map((piece) => {
    const d = piece.data;
    const tabs = (Array.isArray(d.tabs) ? d.tabs : typeof d.tabs === "string" ? d.tabs.split(/[\n,]/) : [])
      .map((t) => tabId.get(String(t).trim().toLowerCase()))
      .filter((t): t is string => Boolean(t));
    const own = Array.isArray(d.gallery) ? d.gallery : [];
    const source = str(d.cv_slug) ? bySlug.get(str(d.cv_slug)!) : undefined;
    // An item's own uploads win; otherwise borrow the linked CV project's media.
    const gallery = own.length ? own : Array.isArray(source?.data.gallery) ? source.data.gallery : [];
    const label = str(d.link_label) ?? (str(d.link)?.startsWith("/concepts/") ? "Open live mockup" : "Visit");
    return {
      groups: tabs,
      content: {
        ...piece,
        cover: gallery.length && !own.length ? null : piece.cover,
        data: { client: str(d.sector), tech: piece.tags.join(", "), duration: str(d.duration), link: str(d.link), link_label: label, gallery },
      },
    };
  });

  // Every published product joins the In-house Products tab; its own gallery and copy come straight from /admin.
  for (const product of products) {
    if (PRODUCTS_SHOWN_AS_PIECES.has(product.slug)) continue;
    const tagline = typeof product.data.tagline === "string" && product.data.tagline ? product.data.tagline : product.excerpt;
    const status = typeof product.data.status_label === "string" ? product.data.status_label : "";
    items.push({
      groups: ["products"],
      content: {
        ...product,
        id: `portfolio-product-${product.slug}`,
        excerpt: tagline,
        data: {
          ...product.data,
          client: status ? `In-house product · ${status}` : "In-house product",
          tech: product.tags.join(", "),
          link: `/products/${product.slug}`,
          link_label: "View product",
        },
      },
    });
  }

  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Portfolio, <span className="font-serif font-normal italic text-teal-deep">in screenshots</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              AI assistants on live SAP data, Fiori and SAPUI5 apps, BI dashboards, mobile apps and the games on this
              site. Open any piece for the full story and every screenshot. Client work is confidential, so it&apos;s
              described by industry rather than name; pieces marked <b className="font-semibold text-ink">Concept</b>{" "}
              are design explorations for fictional brands.
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
