import "server-only";

type Seedable = { exec: (sql: string, params?: unknown[]) => Promise<void> };

type SeedItem = {
  type: "service" | "case_study" | "post" | "page" | "product" | "cv_project";
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  tags?: string[];
  data?: Record<string, unknown>;
  sort_order?: number;
};

const services: SeedItem[] = [
  {
    type: "service",
    slug: "ai-for-sap",
    title: "AI agents inside SAP S/4HANA",
    excerpt:
      "Agents that read your CDS views and OData services, and complete real work — order holds, material verification, returns — with a human approving the edge cases.",
    sort_order: 1,
    tags: ["S/4HANA", "OData", "Agents", "Fiori"],
    data: {
      icon: "brain",
      outcomes: [
        "Ship a simple agent-driven app in 1–2 days",
        "Every action traceable to an SAP change document",
        "Works on ECC and S/4HANA, on-prem or cloud",
      ],
    },
    body: `## What we build

Most "AI for SAP" demos stop at a chat window that summarises a screen. We build agents that **do the work** — safely, inside your authorisation concept.

A Torotech agent is a small, auditable service on BTP that:

- reads business context through **ABAP CDS views** and **OData V4** services (no direct table access, ever)
- reasons with a model of your choice (Anthropic Claude, Azure OpenAI, or SAP AI Core)
- summarises data, forms a query, compares records, or proposes an action — entirely through the app's own OData services, with the request shown to an approver before anything writes back
- writes back only after approval rules pass, and logs every step to a change document

## Typical first projects

| Process | What the agent does | Guardrail |
| --- | --- | --- |
| Sales order holds | Reads block reasons, credit exposure and delivery dates; drafts the release or the customer note | Release above a threshold needs a human |
| Material verification | Compares inbound ASN, PO and goods-receipt data; flags mismatches with a suggested resolution | Never posts a GR on its own |
| Returns triage | Classifies return reasons from free text and photos; proposes disposition and credit | Credit memo is always approved |

## How an engagement runs

1. **Map the workflow (same day).** We sit with the people who do the work today and identify which OData services and entities the app already uses — and the exceptions that actually matter.
2. **Build and wire it (1–2 days for a simple app).** Chat shell, orchestrator, narrow LLM, OData calls — wired into the app that already exists. Nothing gets rebuilt underneath it.
3. **Test it with the people who'll use it.** Real phrasing, real edge cases, before anyone else sees it.
4. **Go live.** One integration, live for every user immediately — write-backs sit behind an approval inbox until the numbers earn wider auto-approval. More complex, multi-system workflows take longer, but the pattern itself doesn't change.

## Stack

SAP BTP Cloud Foundry or Kyma · CAP (Node.js/TypeScript) · SAP Cloud Connector · Destination service · Anthropic Claude / SAP AI Core · Fiori Elements approval app.`,
  },
  {
    type: "service",
    slug: "btp-extensions",
    title: "BTP extensions & integration",
    excerpt:
      "Side-by-side extensions on SAP BTP with CAP, Event Mesh and Integration Suite — so the core stays clean and upgrades stay boring.",
    sort_order: 2,
    tags: ["BTP", "CAP", "Integration Suite", "Event Mesh"],
    data: {
      icon: "layers",
      outcomes: [
        "Clean-core extensions with zero custom code in S/4",
        "Event-driven integrations with EDI, cXML and 3PL partners",
        "One BTP subaccount layout you can actually explain",
      ],
    },
    body: `## Keep the core clean without slowing the business

Every customisation you put in S/4HANA is a tax on the next upgrade. We build the things your business needs *next to* SAP on BTP — and connect them with events, not batch jobs.

## What we deliver

- **CAP services** in TypeScript with proper authorisation, draft handling and OData V4 exposure
- **Integration Suite** flows for EDI 850/856/810, cXML punch-out, and 3PL shipment feeds
- **Event Mesh** subscriptions so BTP apps react to SAP business events in seconds
- **Cloud Connector & Destinations** configured once, documented, and reproducible with Terraform
- **CI/CD** with MTA builds, Cloud Transport Management and GitHub Actions

## Reference architecture

\`\`\`
S/4HANA ──(events)──▶ Event Mesh ──▶ CAP service ──▶ HANA Cloud
   ▲                                       │
   └────────(OData / BAPI via Cloud Connector)◀┘
\`\`\`

We've run this pattern in food distribution, healthcare and manufacturing, on both ECC and S/4HANA.`,
  },
  {
    type: "service",
    slug: "fiori-apps",
    title: "Fiori & UI5 applications",
    excerpt:
      "Fiori Elements where it fits, freestyle UI5 where it doesn't. Fast, accessible apps that people open on the warehouse floor and in the boardroom.",
    sort_order: 3,
    tags: ["Fiori", "UI5", "Fiori Elements", "Launchpad"],
    data: {
      icon: "layout",
      outcomes: [
        "Apps built on annotations, so they stay upgrade-safe",
        "Offline-tolerant scanning apps for warehouses",
        "Launchpad content you can govern",
      ],
    },
    body: `## Apps people actually want to open

We build Fiori apps with the same care we'd give a consumer product — clear flows, quick loads, keyboard and scanner friendly.

## Where we're strongest

- **Fiori Elements** (List Report, Object Page, Analytical List Page) driven by CDS annotations and RAP behaviour definitions
- **Freestyle UI5 / TypeScript** for scanning, planning boards, blotters and anything a template can't express
- **Launchpad & Build Work Zone** design: catalogs, spaces and pages that match how teams work
- **AI-assisted UI**: inline explanation, smart defaults and natural-language filters powered by the same agents we build for S/4

## Recent work

- Shipment blotter with live carrier status and exception colouring
- Material verification app with camera scanning and side-by-side PO comparison
- Return-order summary analytical list page with drill-down to credit memos`,
  },
  {
    type: "service",
    slug: "web-development",
    title: "Web apps with AI built in",
    excerpt:
      "Next.js, TypeScript and Node.js products — customer portals, internal tools and marketing sites — with AI features that earn their place.",
    sort_order: 4,
    tags: ["Next.js", "TypeScript", "Node.js", "Docker"],
    data: {
      icon: "globe",
      outcomes: [
        "Production-ready in weeks, deployed on your own servers",
        "Auth, content management and analytics included",
        "AI features scoped to a measurable outcome",
      ],
    },
    body: `## Websites and web apps that do real work

We build on **Next.js**, **TypeScript** and **Node.js**, deploy with **Docker**, and keep the data layer simple — an embedded HTAP store like DuckDB when one server is enough, Postgres when it isn't.

## What comes standard

- Authentication with Clerk or your identity provider
- A content workspace so your team can publish without a developer
- Real-time analytics and a lead pipeline in the same database
- Accessible, fast pages — Lighthouse 95+ is the floor, not the goal
- Container images and a compose file that run on any Linux box

## Where AI fits

Semantic search across documents, assistants that answer from *your* content, form auto-fill from uploads, and summarisation for support teams. We scope each AI feature to a number you can check — deflection rate, time-to-answer, conversion — and measure it in the same dashboard.

This site is built exactly this way. Ask us for the repo tour.`,
  },
];

const caseStudies: SeedItem[] = [
  {
    type: "case_study",
    slug: "material-verification-agent",
    title: "Cutting goods-receipt disputes by 70% with an SAP verification agent",
    excerpt:
      "A food distributor replaced manual PO-vs-ASN checks with a BTP agent that flags mismatches before the truck is unloaded.",
    tags: ["S/4HANA", "BTP", "Agents", "Food distribution"],
    data: {
      client: "National food distributor",
      industry: "Food distribution",
      metric_value: "70%",
      metric_label: "fewer GR disputes",
      duration: "9 weeks",
    },
    body: `## The problem

Receiving clerks compared purchase orders, supplier ASNs and physical counts by hand — across 14 warehouses. Discrepancies surfaced days later as credit disputes.

## What we built

A CAP service on BTP subscribes to inbound delivery events, pulls the PO and ASN through OData, and asks a Claude model to reconcile quantities, units and substitutions. The agent posts a *proposal* into a Fiori approval app; the clerk confirms in one tap.

- Mismatches flagged **before** unloading, with a plain-language reason
- Every proposal stored with the model's reasoning for audit
- No write-back without a human tap — this was non-negotiable

## Result

- **70% fewer** goods-receipt disputes in the first quarter
- Average receiving time down from 22 to 9 minutes per delivery
- Zero unplanned postings — the approval rule held`,
  },
  {
    type: "case_study",
    slug: "shipment-blotter",
    title: "A live shipment blotter for a 3PL-heavy supply chain",
    excerpt:
      "Freestyle UI5 with Event Mesh feeds: every shipment, carrier status and exception on one screen the dispatch team keeps open all day.",
    tags: ["Fiori", "UI5", "Event Mesh", "Logistics"],
    data: {
      client: "Consumer goods importer",
      industry: "Logistics",
      metric_value: "4 hrs",
      metric_label: "saved per dispatcher per day",
      duration: "7 weeks",
    },
    body: `## The problem

Dispatchers juggled four carrier portals and an SAP transaction to answer "where is order 4512?"

## What we built

A single UI5 blotter fed by Event Mesh: deliveries from S/4, tracking from carrier APIs via Integration Suite, and exceptions coloured by an AI classifier that reads carrier free-text notes.

## Result

- Dispatchers reclaimed **about four hours a day**
- Exceptions handled 3× faster
- The blotter became the daily stand-up screen`,
  },
  {
    type: "case_study",
    slug: "returns-alp",
    title: "Return-order analytics that finance and ops finally agree on",
    excerpt:
      "An Analytical List Page over CDS views gave one version of returns truth — with AI-generated commentary for the weekly review.",
    tags: ["Fiori Elements", "CDS", "Analytics", "AI"],
    data: {
      client: "Regional distributor",
      industry: "Distribution",
      metric_value: "1",
      metric_label: "shared source of truth",
      duration: "5 weeks",
    },
    body: `## The problem

Finance and operations each kept their own returns spreadsheet. Weekly reviews were spent reconciling them.

## What we built

Analytical CDS views with proper associations, an Analytical List Page with drill-down to credit memos, and a small BTP service that writes a plain-English summary of week-over-week changes each Monday.

## Result

- One report, both teams
- Weekly review shortened from 90 to 30 minutes
- Summaries caught two pricing errors in the first month`,
  },
];

const posts: SeedItem[] = [
  {
    type: "post",
    slug: "agents-need-approval-inboxes",
    title: "Your SAP agent needs an approval inbox, not a chat window",
    excerpt:
      "The interface that makes AI safe in SAP isn't conversational — it's a queue of proposed postings a human can scan in seconds.",
    tags: ["Agents", "Fiori", "Design"],
    data: { author: "Ravi Soni", reading_time: 5 },
    body: `Chat is a great way to *explore* a system and a terrible way to *operate* one. When an agent proposes changing a delivery date on 40 sales orders, nobody wants to read that as a paragraph.

## What works instead

An approval inbox: a Fiori list of proposed actions, each with the payload, the reason, and the evidence the agent used. Approve, reject, or edit. Bulk-approve the boring ones.

This is also how you earn trust. In the first weeks, every proposal is reviewed. As precision holds, teams widen the auto-approve rules — deliberately, with numbers.

## Implementation notes

- Store proposals in a CAP entity with draft handling; the approval is the activation
- Keep the model's reasoning as a text field — auditors ask for it
- Fire the actual RAP action from the approval, never from the agent

The chat window can stay. Just don't let it hold the pen.`,
  },
  {
    type: "post",
    slug: "cds-views-are-your-ai-context",
    title: "CDS views are the best AI context layer you already own",
    excerpt:
      "Before you build a vector database, look at the semantic layer SAP already gives you.",
    tags: ["CDS", "S/4HANA", "RAG"],
    data: { author: "Ravi Soni", reading_time: 4 },
    body: `Teams reaching for RAG on SAP data usually start by exporting tables. That throws away the most valuable thing SAP has: the semantics.

A well-annotated CDS view carries labels, units, currencies, associations and authorisation. Expose it through OData and an agent can ask precise questions — "open sales orders for customer X with credit block Y" — without ever learning table names.

## Practical guidance

1. Build *consumption* views for the agent, not raw interface views
2. Use \`@ObjectModel.text\` and \`@Semantics\` annotations — the model reads them
3. Return small pages; the agent should filter, not paginate
4. Log every query the agent runs; you'll learn what it actually needs`,
  },
  {
    type: "post",
    slug: "duckdb-for-small-web-apps",
    title: "Why this site runs on DuckDB",
    excerpt:
      "One embedded database for content, leads and analytics — transactional writes and analytical reads without a second system.",
    tags: ["DuckDB", "Next.js", "Architecture"],
    data: { author: "Ravi Soni", reading_time: 3 },
    body: `Small sites still need three things: somewhere to keep content, somewhere to keep leads, and a way to see what's happening. Traditionally that's a CMS, a CRM and an analytics vendor.

Torotech.ca uses one embedded DuckDB file for all three. Page views are appended as rows; the admin dashboard runs columnar aggregations over the same file in milliseconds. Custom fields live in a JSON column, so adding "estimated budget" to the lead form is a settings change, not a migration.

When traffic outgrows one server, the same SQL moves to MotherDuck or Postgres. Until then, the whole thing ships as a single Docker container with one volume.`,
  },
];

const products: SeedItem[] = [
  {
    type: "product",
    slug: "torotech-ca",
    title: "This website",
    excerpt: "The Torotech site itself — a Next.js app with a built-in content workspace, lead pipeline and analytics on one DuckDB file.",
    tags: ["Next.js", "DuckDB", "Docker"],
    sort_order: 1,
    data: {
      tagline: "Marketing site, CMS, CRM and analytics in a single container.",
      status_label: "Live",
      link: "https://torotech.ca",
      gallery: [],
    },
    body: `Everything editable on this site — services, case studies, insights, **and this Products section** — is managed from \`/admin\`: a Markdown editor, drafts and publishing, uploads, no-code custom fields, a lead inbox, live analytics and a SQL workbench.

Add media to a product from the gallery panel in the editor: PNG/JPG/WebP images, animated GIFs, or short MP4/WebM clips. The first item becomes the card preview.`,
  },
];

const cvProjects: SeedItem[] = [
  { type: "cv_project", slug: "field-visit-app", title: "Field Visit App", excerpt: "Field reps capture visits with English/Spanish translation and per-visit comments.", sort_order: 1, tags: [], data: { client: "Porky Products", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "edi-fulfillment-tracker", title: "EDI Fulfillment Tracker", excerpt: "Tracks incoming iDocs and documents; JSON/XML/PDF viewer and a document-flow tree.", sort_order: 2, tags: [], data: { client: "Porky Products", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "order-entry-app", title: "Order Entry App", excerpt: "Three-page shopping-cart layout for placing orders.", sort_order: 3, tags: [], data: { client: "Porky Products", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "one-click-notification-flow", title: "One-Click Notification Flow", excerpt: "Triggers notification and service-order creation in one click with minimal input.", sort_order: 4, tags: [], data: { client: "US water utility", tech: "SAP Screen Personas" } },
  { type: "cv_project", slug: "ewm-barcode-scanner", title: "EWM Barcode Scanner", excerpt: "Warehouse inventory, bin-to-bin transfers, stock graphs, complaints and reorder.", sort_order: 5, tags: [], data: { client: "Kuwait furniture retailer", tech: "SAPUI5 + Cordova" } },
  { type: "cv_project", slug: "create-pr-app", title: "Create PR App (SAP + Hybris)", excerpt: "Three-screen PR create/change with smart table and filter; material and service items.", sort_order: 6, tags: [], data: { client: "Australian mining company", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "supply-tracking-suite", title: "Supply Tracking Suite", excerpt: "Two apps for manifests, GIs/GDs, inbound goods and assignments — complex line items.", sort_order: 7, tags: [], data: { client: "Australian mining company", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "village-notification-app", title: "Village Notification App", excerpt: "Single-screen mobile notification creation with attachments and auto-suggestions.", sort_order: 8, tags: [], data: { client: "Australian mining company", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "vendor-onboarding-apps", title: "Vendor Onboarding Apps", excerpt: "Registration requests, certificate/proof uploads and approval tracking for vendors.", sort_order: 9, tags: [], data: { client: "Australian mining company", tech: "SAPUI5 (custom)" } },
  { type: "cv_project", slug: "pm-fiori-elements-adaptations", title: "PM Fiori Elements Adaptations", excerpt: "Adapted 6 standard PM apps for custom search and actions across notifications and orders.", sort_order: 10, tags: [], data: { client: "Australian mining company", tech: "Fiori Elements" } },
  { type: "cv_project", slug: "standard-fiori-app-extensions", title: "Standard Fiori App Extensions", excerpt: "Heavily extended My Inbox, My Timesheet and Find Maintenance Notification.", sort_order: 11, tags: [], data: { client: "Australian mining company", tech: "Fiori extension framework" } },
  { type: "cv_project", slug: "rapid-fiori-deployment", title: "Rapid Fiori Deployment", excerpt: "400 standard apps deployed across PM, MM and QM.", sort_order: 12, tags: [], data: { client: "Australian mining company", tech: "Standard S/4HANA apps" } },
  { type: "cv_project", slug: "hana-smart-business-kpis", title: "HANA Smart Business KPIs", excerpt: "KPI apps for sales-order fulfillment issues and material availability via the KPI modeler.", sort_order: 13, tags: [], data: { client: "Philips Global", tech: "HANA Smart Business, Fiori" } },
  { type: "cv_project", slug: "finance-reporting-fiori-rollout", title: "Finance Reporting Fiori Rollout", excerpt: "Led 13 standard finance apps to global market, including a new embedded BW system.", sort_order: 14, tags: [], data: { client: "Philips Global", tech: "Embedded BW, Fiori, WebDynpro" } },
  { type: "cv_project", slug: "b2c-rewards-app", title: "B2C Rewards App", excerpt: "Fetches and shows customer reward points from SAP.", sort_order: 15, tags: [], data: { client: "Kuwait furniture vendor", tech: "Android, iOS, PHP, OData" } },
  { type: "cv_project", slug: "burrp", title: "Burrp", excerpt: "End-to-end development of a local restaurant and events search app.", sort_order: 16, tags: [], data: { client: "Network18", tech: "Blackberry (native)" } },
];

/** Field definitions that ship with the product content type — inserted idempotently on every boot. */
const PRODUCT_FIELDS: [string, string, string, string, string[]?][] = [
  ["product", "tagline", "Tagline", "text"],
  ["product", "status_label", "Status label (e.g. Live, Beta)", "text"],
  ["product", "link", "External link", "url"],
];

/** Field definitions for CV projects on /ravisoni — inserted idempotently on every boot. */
const CV_PROJECT_FIELDS: [string, string, string, string, string[]?][] = [
  ["cv_project", "client", "Client", "text"],
  ["cv_project", "tech", "Technology stack", "text"],
  ["cv_project", "duration", "Duration (e.g. 3 months)", "text"],
];

export async function ensureBaselineFields(db: Seedable) {
  let i = 100;
  for (const [entity, key, label, type, options] of [...PRODUCT_FIELDS, ...CV_PROJECT_FIELDS]) {
    await db.exec(
      `INSERT INTO field_defs (id, entity, key, label, type, options, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (entity, key) DO NOTHING`,
      [crypto.randomUUID(), entity, key, label, type, JSON.stringify(options ?? []), i++],
    );
  }
}

export async function seedContent(db: Seedable) {
  const items = [...services, ...caseStudies, ...posts, ...products, ...cvProjects];
  for (const it of items) {
    await db.exec(
      `INSERT INTO content (id, type, slug, title, excerpt, body, status, tags, data, sort_order, published_at)
       VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, now())`,
      [
        crypto.randomUUID(),
        it.type,
        it.slug,
        it.title,
        it.excerpt,
        it.body ?? null,
        JSON.stringify(it.tags ?? []),
        JSON.stringify(it.data ?? {}),
        it.sort_order ?? 0,
      ],
    );
  }

  const fields: [string, string, string, string, string[]?][] = [
    ["service", "icon", "Icon", "select", ["brain", "layers", "layout", "globe", "sparkles", "database"]],
    ["service", "outcomes", "Key outcomes (one per line)", "list"],
    ["case_study", "client", "Client", "text"],
    ["case_study", "industry", "Industry", "text"],
    ["case_study", "metric_value", "Headline metric", "text"],
    ["case_study", "metric_label", "Metric label", "text"],
    ["case_study", "duration", "Engagement length", "text"],
    ["post", "author", "Author", "text"],
    ["post", "reading_time", "Reading time (min)", "number"],
    ["lead", "budget", "Budget range", "select", ["Under $25k", "$25k–$75k", "$75k–$200k", "$200k+"]],
    ["lead", "timeline", "Timeline", "select", ["ASAP", "This quarter", "Next quarter", "Exploring"]],
  ];
  let i = 0;
  for (const [entity, key, label, type, options] of fields) {
    await db.exec(
      `INSERT INTO field_defs (id, entity, key, label, type, options, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), entity, key, label, type, JSON.stringify(options ?? []), i++],
    );
  }
}
