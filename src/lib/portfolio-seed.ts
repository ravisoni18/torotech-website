// Starting content for the Portfolio admin. On first boot these are copied into the database
// (see runOnceMigrations in seed.ts); after that, everything is edited in /admin and this file is not read.
import { CONCEPTS } from "./portfolio-concepts";

export type Piece = {
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
export const PIECES: Piece[] = [
  {
    slug: "torotech-site",
    groups: ["website", "products"],
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


// Interactive games that live on this site — each card links to where it can be played.
export const GAMES = [
  {
    slug: "approval-game",
    title: "You're the approver — AI decision game",
    excerpt: "Twenty seconds to approve or flag what an AI agent wants to do.",
    body: "An AI agent proposes real-world actions — deployments, refunds, schema changes — and you have twenty seconds to approve or flag each one. Swipe the card or use the buttons. It's the exact human-in-the-loop decision our agents hand to people, turned into a game.",
    tags: ["React", "Motion", "AI agents", "Human in the loop"],
    link: "/#approval-game",
  },
  {
    slug: "bug-hunt",
    title: "Playwright QA Challenge — bug hunt",
    excerpt: "Find six real defect patterns in a mock checkout before the clock runs out.",
    body: "Six real defect patterns are hidden in a mock checkout page. Tap each one before the 35-second clock runs out, and the test report fills in with the Playwright assertion that would have caught it in CI.",
    tags: ["Playwright", "QA", "React"],
    link: "/services/automation-testing-playwright#bug-hunt",
  },
  {
    slug: "workflow-game",
    title: "Toro Automator — n8n workflow game",
    excerpt: "Build a webhook → AI agent → Slack pipeline across three missions.",
    body: "Build the pipeline yourself: add nodes, tap one and then another to join them, and hit Execute. It uses the same node-and-connection model as a real n8n canvas, with three missions and an execution console — and it works on a phone.",
    tags: ["n8n", "Automation", "AI agents"],
    link: "/services/workflow-automation-n8n#workflow-game",
  },
  {
    slug: "stack-game",
    title: "Mobile Stack Builder — find your stack in 60 seconds",
    excerpt: "Seven questions, a live fit meter, and a full mobile stack recommendation.",
    body: "Answer seven questions about your users, devices and data. The live fit meter re-ranks native, cross-platform and HTML5 as you go, then you get a full frontend, backend, hosting, security and testing recommendation.",
    tags: ["Mobile", "React Native", "Flutter", "Decision tool"],
    link: "/services/mobile-app-development#stack-game",
  },
];


/** Map tab ids to the labels shown in admin — admins type labels, the page accepts either. */
export const TAB_LABELS: Record<string, string> = {
  website: "Website",
  "mobile-apps": "Mobile Apps",
  sap: "SAP BTP/Fiori Apps",
  n8n: "N8N workflows",
  analytics: "Business Analytics",
  products: "In-house Products",
  games: "Enterprise Games",
};

export type PortfolioSeed = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string | null;
  tags: string[];
  sort_order: number;
  data: Record<string, unknown>;
};

/** Every current piece, game and concept as a portfolio content row. */
export function portfolioSeed(): PortfolioSeed[] {
  const out: PortfolioSeed[] = [];
  PIECES.forEach((p, i) =>
    out.push({
      slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, cover: p.cover ?? null, tags: p.tags, sort_order: 10 + i,
      data: { tabs: p.groups.map((g) => TAB_LABELS[g] ?? g), sector: p.sector, duration: p.duration, link: p.link, cv_slug: p.cvSlug },
    }),
  );
  GAMES.forEach((g, i) =>
    out.push({
      slug: g.slug, title: g.title, excerpt: g.excerpt, body: g.body, cover: `/images/portfolio/games/${g.slug}.webp`, tags: g.tags, sort_order: 50 + i,
      data: { tabs: [TAB_LABELS.games], sector: "Interactive · playable on this site", link: g.link, link_label: "Play it" },
    }),
  );
  CONCEPTS.forEach((c, i) =>
    out.push({
      slug: c.slug, title: c.title, excerpt: c.excerpt, body: `${c.body}\n\n*Concept design for a fictional brand — not client work.*`, cover: null, tags: c.tags, sort_order: 100 + i,
      data: { tabs: [TAB_LABELS[c.group]], sector: `Concept · ${c.sector}`, link: c.link, link_label: c.linkLabel, gallery: c.gallery.map((url) => ({ url, type: "image" })) },
    }),
  );
  return out;
}
