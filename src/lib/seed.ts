import "server-only";
import { portfolioSeed } from "./portfolio-seed";

type Seedable = { exec: (sql: string, params?: unknown[]) => Promise<void> };
type Queryable = Seedable & { query: <T>(sql: string, params?: unknown[]) => Promise<T[]> };

type SeedItem = {
  type: "service" | "case_study" | "post" | "page" | "product" | "cv_project" | "portfolio";
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
    slug: "web-development",
    title: "Website Development and AI Integration",
    excerpt:
      "Next.js, TypeScript and Node.js products — customer portals, internal tools and marketing sites — with AI features that earn their place.",
    sort_order: 1,
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
  {
    type: "service",
    slug: "mobile-app-development",
    title: "Mobile Apps Development",
    excerpt:
      "Native and cross-platform apps — iOS, Android and React Native — built for real field use: offline-tolerant, camera and scanner friendly, fast to ship.",
    sort_order: 2,
    tags: ["React Native", "iOS", "Android", "Offline-first"],
    data: {
      icon: "smartphone",
      outcomes: [
        "One React Native codebase for iOS and Android",
        "Offline-tolerant sync for warehouse and field crews",
        "Store submission and release pipeline included",
      ],
    },
    body: `## Apps built for where the work actually happens

Field crews, warehouse floors and delivery routes don't have great signal. We build mobile apps that keep working when the network doesn't.

## What we deliver

- **React Native / TypeScript** apps sharing one codebase across iOS and Android, dropping to native modules where it matters
- **Offline-first sync** with conflict resolution, so a scan or a form submitted underground still lands correctly later
- **Camera, barcode and NFC scanning** wired directly into your backend workflows
- **Push notifications, deep links and background sync** configured once, not bolted on
- **App Store / Play Store release pipeline** — signing, versioning and CI builds handled end to end

## Recent patterns

- Barcode-scanning apps for warehouse bin-to-bin transfers and goods receipt
- Field-service apps with photo capture, GPS check-in and offline work orders
- Companion apps for existing web products, sharing the same backend and auth`,
  },
  {
    type: "service",
    slug: "business-intelligence-ai",
    title: "Business Intelligence and Analytics using AI",
    excerpt:
      "Dashboards and data models that answer the next question, not just the last report — with AI that explains a number instead of just charting it.",
    sort_order: 3,
    tags: ["BI", "Analytics", "Dashboards", "AI"],
    data: {
      icon: "chart",
      outcomes: [
        "One data model feeding every dashboard, no duplicate logic",
        "Natural-language questions answered against your real data",
        "Alerts on the metrics that matter, not a wall of charts",
      ],
    },
    body: `## Dashboards people actually check

Most BI rollouts stall because the dashboard answers last month's question. We build a data model first, then let both humans and an AI layer query it.

## What we deliver

- **A governed semantic layer** — one source of truth for metrics, so finance and ops stop reconciling numbers
- **Interactive dashboards** (drill-down, cohort, trend) built on your warehouse or an embedded store when one server is enough
- **Natural-language analytics** — ask a question in plain English, get a chart and the SQL behind it, not a hallucinated number
- **Anomaly detection and alerting** on the metrics you actually act on
- **Scheduled and event-driven pipelines** (ETL/ELT) that keep the model fresh without a nightly fire drill

## Where AI fits

The model never guesses at your numbers — it forms a query against your actual data model, then explains the result in plain language. Every answer is traceable back to the query that produced it.`,
  },
  {
    type: "service",
    slug: "sap-btp-development",
    title: "SAP BTP Development and Integration",
    excerpt:
      "AI agents, BTP extensions and Fiori apps that read your S/4HANA data through CDS and OData, propose the next action, and post it back — with a human approving the edge cases.",
    sort_order: 4,
    tags: ["S/4HANA", "BTP", "OData", "CAP", "Fiori", "UI5", "Agents"],
    data: {
      icon: "layers",
      outcomes: [
        "Ship a simple agent-driven app in 1–2 days",
        "Clean-core extensions with zero custom code in S/4",
        "Apps built on CDS annotations, so they stay upgrade-safe",
        "Every action traceable to an SAP change document",
      ],
    },
    body: `## AI agents inside SAP S/4HANA

Most "AI for SAP" demos stop at a chat window that summarises a screen. We build agents that **do the work** — safely, inside your authorisation concept.

A Torotech agent is a small, auditable service on BTP that:

- reads business context through **ABAP CDS views** and **OData V4** services (no direct table access, ever)
- reasons with a model of your choice (Anthropic Claude, Azure OpenAI, or SAP AI Core)
- summarises data, forms a query, compares records, or proposes an action — entirely through the app's own OData services, with the request shown to an approver before anything writes back
- writes back only after approval rules pass, and logs every step to a change document

### Typical first projects

| Process | What the agent does | Guardrail |
| --- | --- | --- |
| Sales order holds | Reads block reasons, credit exposure and delivery dates; drafts the release or the customer note | Release above a threshold needs a human |
| Material verification | Compares inbound ASN, PO and goods-receipt data; flags mismatches with a suggested resolution | Never posts a GR on its own |
| Returns triage | Classifies return reasons from free text and photos; proposes disposition and credit | Credit memo is always approved |

## BTP extensions & integration

Every customisation you put in S/4HANA is a tax on the next upgrade. We build the things your business needs *next to* SAP on BTP — and connect them with events, not batch jobs.

- **CAP services** in TypeScript with proper authorisation, draft handling and OData V4 exposure
- **Integration Suite** flows for EDI 850/856/810, cXML punch-out, and 3PL shipment feeds
- **Event Mesh** subscriptions so BTP apps react to SAP business events in seconds
- **Cloud Connector & Destinations** configured once, documented, and reproducible with Terraform
- **CI/CD** with MTA builds, Cloud Transport Management and GitHub Actions

### Reference architecture

\`\`\`
S/4HANA ──(events)──▶ Event Mesh ──▶ CAP service ──▶ HANA Cloud
   ▲                                       │
   └────────────(OData via Cloud Connector)◀┘
\`\`\`

## Fiori & UI5 applications

We build Fiori apps with the same care we'd give a consumer product — clear flows, quick loads, keyboard and scanner friendly.

- **Fiori Elements** (List Report, Object Page, Analytical List Page) driven by CDS annotations and RAP behaviour definitions
- **Freestyle UI5 / TypeScript** for scanning, planning boards, blotters and anything a template can't express
- **Launchpad & Build Work Zone** design: catalogs, spaces and pages that match how teams work
- **AI-assisted UI**: inline explanation, smart defaults and natural-language filters powered by the same agents above

## How an engagement runs

1. **Map the workflow (same day).** We sit with the people who do the work today and identify which OData services and entities the app already uses — and the exceptions that actually matter.
2. **Build and wire it (1–2 days for a simple app).** Chat shell, orchestrator, narrow LLM, OData calls — wired into the app that already exists. Nothing gets rebuilt underneath it.
3. **Test it with the people who'll use it.** Real phrasing, real edge cases, before anyone else sees it.
4. **Go live.** One integration, live for every user immediately — write-backs sit behind an approval inbox until the numbers earn wider auto-approval. More complex, multi-system workflows take longer, but the pattern itself doesn't change.

## Stack

SAP BTP Cloud Foundry or Kyma · CAP (Node.js/TypeScript) · SAP Cloud Connector · Destination service · Integration Suite · Event Mesh · Anthropic Claude / SAP AI Core · Fiori Elements & freestyle UI5.

We've run this pattern in food distribution, healthcare and manufacturing, on both ECC and S/4HANA.`,
  },
  {
    type: "service",
    slug: "automation-testing-playwright",
    title: "Automation Testing using Playwright",
    excerpt:
      "End-to-end test suites that actually get maintained — fast, parallel, and wired into CI so a broken flow fails the build, not the customer.",
    sort_order: 5,
    tags: ["Playwright", "Testing", "CI/CD", "QA"],
    data: {
      icon: "testtube",
      outcomes: [
        "Critical user flows covered before the next release, not after",
        "Cross-browser suite running in CI on every pull request",
        "Flake budget near zero — tests people trust and don't skip",
      ],
    },
    body: `## Test suites your team actually keeps

Most Playwright suites rot within a quarter because they were written once and never owned. We build suites around the flows that make you money, and set up the harness so your team keeps them alive.

## What we deliver

- **Critical-path E2E coverage** — checkout, sign-up, the workflow that generates the invoice — before edge cases
- **Cross-browser and cross-viewport runs** (Chromium, Firefox, WebKit, mobile emulation) in one config
- **Page-object / fixture architecture** that survives a redesign without a full rewrite
- **Visual regression and API-level checks** layered in alongside UI flows where they're cheaper and faster
- **CI integration** — GitHub Actions or your pipeline of choice, sharded for speed, with traces and video on failure
- **Flake triage** — quarantine, root-cause and a policy so a flaky test gets fixed, not muted forever

## How an engagement runs

1. Map the flows that actually matter to revenue or compliance.
2. Stand up the Playwright config, fixtures and CI job in the first days.
3. Write coverage flow by flow, reviewed with your team as we go.
4. Hand over a suite your engineers can extend — no black box.`,
  },
  {
    type: "service",
    slug: "workflow-automation-n8n",
    title: "Enterprise Workflow Automation using N8N",
    excerpt:
      "Self-hosted N8N workflows that connect your SaaS tools, internal systems and AI steps — without the per-task pricing of Zapier at enterprise volume.",
    sort_order: 6,
    tags: ["N8N", "Automation", "Integration", "Workflows"],
    data: {
      icon: "workflow",
      outcomes: [
        "Self-hosted, so no per-execution vendor pricing at scale",
        "One workflow layer connecting SaaS, internal APIs and AI steps",
        "Error handling and retries built in, not an afterthought",
      ],
    },
    body: `## Automation that survives contact with production

Point-and-click automation tools demo well and then fall over at real volume, or start billing per task. We build N8N workflows self-hosted on your own infrastructure, with the error handling that turns a demo into an operational system.

## What we deliver

- **Self-hosted N8N** on your own VPS or cloud account — no per-execution pricing, full data residency
- **Custom nodes and functions** where the built-in library doesn't reach — internal APIs, legacy systems, SAP OData
- **AI steps inside the workflow** — classification, extraction, summarisation — wired to the model of your choice
- **Error workflows, retries and alerting** so a failed run pages someone instead of silently dropping data
- **Version-controlled workflows** (exported as JSON, reviewed like code) instead of undocumented click-ops

## Typical automations

- Lead intake: form → enrichment → CRM → Slack notification → follow-up sequence
- Document pipeline: inbox → AI extraction → validation → ERP posting → approval alert
- Cross-system sync: keep two SaaS tools or an internal system and a SaaS tool consistent without a middleware contract`,
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
  ["product", "demo_url", "Interactive demo URL (embedded on the product page)", "text"],
  ["product", "demo_device", "Demo frame", "select", ["desktop", "phone"]],
  ["product", "highlights", "Highlights (one per line)", "list"],
];

/** Field definitions for portfolio items on /portfolio. */
const PORTFOLIO_FIELDS: [string, string, string, string, string[]?][] = [
  ["portfolio", "tabs", "Tabs (one per line: Website, Mobile Apps, SAP BTP/Fiori Apps, N8N workflows, Business Analytics, In-house Products, Enterprise Games)", "list"],
  ["portfolio", "sector", "Sector / client line (e.g. Food distributor, or Concept · Healthcare)", "text"],
  ["portfolio", "duration", "Duration (e.g. 2 weeks)", "text"],
  ["portfolio", "link", "Link (live demo, product or case study)", "text"],
  ["portfolio", "link_label", "Link button label (e.g. Open live mockup)", "text"],
  ["portfolio", "cv_slug", "Use media from CV project (slug) when this item has no gallery", "text"],
];

/** Field definitions for CV projects on /ravisoni — inserted idempotently on every boot. */
const CV_PROJECT_FIELDS: [string, string, string, string, string[]?][] = [
  ["cv_project", "client", "Client", "text"],
  ["cv_project", "tech", "Technology stack (comma-separated)", "text"],
  ["cv_project", "duration", "Duration (e.g. 3 months)", "text"],
  ["cv_project", "link", "External link", "url"],
];

export async function ensureBaselineFields(db: Seedable) {
  let i = 100;
  for (const [entity, key, label, type, options] of [...PRODUCT_FIELDS, ...CV_PROJECT_FIELDS, ...PORTFOLIO_FIELDS]) {
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
    [
      "service",
      "icon",
      "Icon",
      "select",
      ["brain", "layers", "layout", "globe", "sparkles", "database", "smartphone", "chart", "testtube", "workflow"],
    ],
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

// ---------------------------------------------------------------------------
// One-off content migrations. Each runs once per database (tracked in `settings`), so anything an
// admin edits or deletes afterwards is left alone.

const NEW_PRODUCTS: SeedItem[] = [
  {
    type: "product", slug: "toro-approvals", title: "Toro Approvals", sort_order: 2,
    excerpt: "A Fiori approval inbox for SAP purchase requisitions — budget context on every row, bulk decisions, and a full trail.",
    tags: ["SAP", "Fiori", "OpenUI5", "BTP"],
    data: {
      tagline: "Approve purchase requisitions in seconds, with the budget in front of you.", status_label: "Interactive demo",
      demo_url: "/concepts/fiori/fiori-purchase-requisitions.html", demo_device: "desktop",
      highlights: ["Filter, search and bulk-approve requisitions", "Budget used on every row; over-budget requests flagged", "Reject with a reason the requester sees", "One object page: items, budget check and approval flow"],
      gallery: [{ url: "/images/portfolio/concepts/fiori-purchase-requisitions-1.webp", type: "image" }, { url: "/images/portfolio/concepts/fiori-purchase-requisitions-2.webp", type: "image" }],
    },
    body: `Approvers shouldn't need to open three transactions to decide on a laptop order. **Toro Approvals** puts every open requisition on one list report with the cost centre, value and budget already used — so the obvious ones are approved in bulk and the questionable ones stand out.

**How it fits your landscape**

- A Fiori app on SAP BTP that reads and writes through your existing OData services
- Works with your release strategy; decisions post back as standard approvals
- Runs in the Fiori launchpad or SAP Build Work Zone, on desktop and phone

The demo above is the real UI5 front end running on sample data — select a few rows and approve them, or open one to see the budget check and approval history.`,
  },
  {
    type: "product", slug: "toro-insights", title: "Toro Insights", sort_order: 3,
    excerpt: "A drill-down sales dashboard where every KPI, chart and table answers to one data model.",
    tags: ["BI", "Analytics", "Dashboards"],
    data: {
      tagline: "Click a region or a category and the whole dashboard answers.", status_label: "Interactive demo",
      demo_url: "/demos/bi-desktop-dashboard.html", demo_device: "desktop",
      gallery: [{ url: "/images/products/toro-insights-1.webp", type: "image" }, { url: "/images/products/toro-insights-2.webp", type: "image" }],
      highlights: ["Click any bar or slice to drill down", "KPIs, trend and transactions update together", "Year, quarter and month views", "Export the filtered transactions"],
    },
    body: `Most dashboards are a set of charts that disagree with each other. **Toro Insights** is built on a single semantic layer: one definition of revenue, units and customers, so every tile changes together when you drill into a region or a product category.

**What you get**

- Sales overview with revenue, units, order value and active customers
- Drill-down by region and category, with a detailed transaction list
- Connects to SAP (CDS views / OData), a warehouse, or a DuckDB file for smaller teams

Try it above — click a region bar, then a category slice, then reset.`,
  },
  {
    type: "product", slug: "toro-workspace", title: "Toro Workspace", sort_order: 4,
    excerpt: "A private AI workspace for your team: agent chat, a knowledge base and usage analytics in one place.",
    tags: ["AI", "LLM", "Knowledge base"],
    data: {
      tagline: "Your team's AI workspace — on your data, under your rules.", status_label: "Interactive demo",
      demo_url: "/demos/toro-ai-workspace.html", demo_device: "desktop",
      gallery: [{ url: "/images/products/toro-workspace-1.webp", type: "image" }],
      highlights: ["Agent chat with saved threads", "Knowledge base grounded in your documents", "Analytics: usage, cost and agent activity", "Runs on your own infrastructure and model choice"],
    },
    body: `Teams want the speed of an AI assistant without pasting company data into a public chatbot. **Toro Workspace** gives them agent chat, a shared knowledge base and an analytics view of usage and cost — deployed in your environment, with the model of your choice.

**Built for**

- Finance, operations and IT teams that work from internal documents
- Organisations that need data to stay in-house and usage to be auditable

The demo above shows the workspace UI — switch between Enterprise Chat, Analytics & ROI and the Knowledge Base.`,
  },
  {
    type: "product", slug: "toro-catalog", title: "Toro Catalog", sort_order: 5,
    excerpt: "A swipe-to-order mobile catalogue for B2B buyers, connected to your product and pricing data.",
    tags: ["Mobile", "B2B", "Commerce"],
    data: {
      tagline: "Product discovery your buyers actually enjoy — swipe, add, order.", status_label: "Interactive demo",
      demo_url: "/demos/mobile-swipe-demo.html", demo_device: "phone",
      gallery: [{ url: "/images/products/toro-catalog-1.webp", type: "image" }],
      highlights: ["Swipe through products like cards", "Add to a cart and submit in two taps", "Works offline and syncs when back online", "Prices and stock from your ERP"],
    },
    body: `Re-ordering from a 40-page PDF price list is how a lot of B2B buying still works. **Toro Catalog** turns your catalogue into a mobile app buyers can swipe through, with live stock and their own prices, and sends the order straight into your system.

**Good fit for**

- Distributors and manufacturers with field sales or repeat B2B buyers
- Teams that want an ordering app without a full e-commerce re-platform

Swipe the cards in the demo above, add a few items, and open the cart.`,
  },
];

async function once(db: Queryable, key: string, run: () => Promise<void>) {
  const done = await db.query<{ n: number }>(`SELECT count(*)::INTEGER AS n FROM settings WHERE key = ?`, [key]);
  if (done[0]?.n) return;
  await run();
  await db.exec(`INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value`, [key, new Date().toISOString()]);
}

async function insertIfMissing(db: Queryable, it: SeedItem & { cover?: string | null }) {
  const exists = await db.query<{ n: number }>(`SELECT count(*)::INTEGER AS n FROM content WHERE type = ? AND slug = ?`, [it.type, it.slug]);
  if (exists[0]?.n) return;
  await db.exec(
    `INSERT INTO content (id, type, slug, title, excerpt, body, cover, status, tags, data, sort_order, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, now())`,
    [crypto.randomUUID(), it.type, it.slug, it.title, it.excerpt, it.body ?? null, it.cover ?? null, JSON.stringify(it.tags ?? []), JSON.stringify(it.data ?? {}), it.sort_order ?? 0],
  );
}

export async function runOnceMigrations(db: Queryable) {
  await once(db, "migration:portfolio-v1", async () => {
    for (const p of portfolioSeed()) {
      await insertIfMissing(db, { type: "portfolio", slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, cover: p.cover, tags: p.tags, data: p.data, sort_order: p.sort_order });
    }
  });
  await once(db, "migration:products-v2", async () => {
    for (const p of NEW_PRODUCTS) await insertIfMissing(db, p);
    // The site's own product card had no preview; give it the homepage screenshot if nothing was uploaded.
    const rows = await db.query<{ id: string; cover: string | null; data: string }>(`SELECT id, cover, data FROM content WHERE type = 'product' AND slug = 'torotech-ca'`);
    for (const r of rows) {
      let gallery: unknown[] = [];
      try { const d = JSON.parse(r.data || "{}"); gallery = Array.isArray(d.gallery) ? d.gallery : []; } catch { /* keep empty */ }
      if (!r.cover && gallery.length === 0) await db.exec(`UPDATE content SET cover = ? WHERE id = ?`, ["/images/portfolio/torotech-site.jpg", r.id]);
    }
  });
}
