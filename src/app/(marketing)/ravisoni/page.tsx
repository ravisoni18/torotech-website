import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Link2, MapPin, Award } from "lucide-react";
import { Container } from "@/components/marketing/ui";
import { PrintButton } from "@/components/marketing/PrintButton";
import { CvProjectGrid } from "@/components/marketing/CvProjectGrid";
import { listPublished } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ravikumar Soni — CV",
  description:
    "SAP Certified Senior SAP BTP / Fiori architect with 12+ years leading SAP Fiori, BTP and SAPUI5 implementations across food distribution, mining, healthcare and consulting.",
};

const CONTACT = [
  { icon: Mail, label: "ravisoni18@gmail.com", href: "mailto:ravisoni18@gmail.com" },
  { icon: Phone, label: "+1 (613) 716 1135", href: "tel:+16137161135" },
  { icon: Phone, label: "+1 (346) 218 1035", href: "tel:+13462181035" },
  { icon: Link2, label: "linkedin.com/in/soniravi", href: "https://www.linkedin.com/in/soniravi/" },
];

const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "SAP BTP",
    items: [
      "Business Application Studio (5 yrs)",
      "WebIDE Full-Stack / Personal (7 yrs)",
      "VS Code UI5 tooling (2 yrs)",
      "Work Zone & Launchpad deployment",
      "Destination & Connectivity",
    ],
  },
  {
    group: "Fiori & SAPUI5",
    items: [
      "SAPUI5 development (9 yrs)",
      "Fiori Elements (4 yrs)",
      "Rapid deployment of standard apps (9 yrs)",
      "UI / CDS annotations (3 yrs)",
      "Fiori extensions & adaptations (7 yrs)",
      "Smart controls",
    ],
  },
  {
    group: "CDS & ABAP",
    items: [
      "CDS views — consumption, basic, composite",
      "Metadata extensions for UI annotations",
      "CRUD OData services",
      "ABAP programming & debugging (basic)",
    ],
  },
  {
    group: "SAP Screen Personas",
    items: [
      "Personas 2.0 / 3.0 SP16 (5 yrs)",
      "Slipstream Engine — responsive flavors",
      "Fiori Theme Designer",
    ],
  },
  {
    group: "Fiori Administration",
    items: ["Pages & Spaces", "Catalogs & Groups", "Target Mappings"],
  },
  {
    group: "Web & Mobile",
    items: [
      "Node.js",
      "React & React Native",
      "D3.js & VizFrame analytics",
      "HTML5 / CSS / jQuery",
      "Android (native), Cordova",
    ],
  },
];

const EXPERIENCE: {
  role: string;
  company: string;
  location?: string;
  period: string;
  note?: string;
  points: string[];
}[] = [
  {
    role: "SAP BTP / Fiori Architect",
    company: "Mindfore Inc.",
    location: "Houston, TX — onsite at Porky Products, New Jersey",
    period: "Apr 2023 – Present",
    points: [
      "Build SAPUI5 custom Fiori apps with the core team on the Business Application Studio platform.",
      "Delivered 15+ fully custom apps across finance and sales & distribution.",
      "Activated and enabled 100+ standard Fiori apps.",
      "Hands-on with Fiori adaptations, CDS views and Fiori Elements apps.",
    ],
  },
  {
    role: "SAP UX Solution Architect",
    company: "Digital Personas",
    period: "Mar 2020 – Mar 2023",
    note: "Delivery for a large Australian conglomerate",
    points: [
      "Led a 30+ person team spanning Fiori/UI5 front end and ABAP/CDS back end.",
      "Owned solution development, delivery and maintenance for the client.",
      "Ran the S/4HANA 2020 Fiori migration plus 30+ new complex SAPUI5 apps.",
      "40+ custom apps delivered — an estimated $5–10M in customer value, under 5% defects.",
      "Activated 500+ standard S/4HANA apps in phases; apps used by 1000+ staff.",
      "Replaced legacy processes end-to-end: partner onboarding, maintenance, requisition and quality management.",
    ],
  },
  {
    role: "Mobile Developer Lead II",
    company: "Philips Healthcare Services",
    period: "Feb 2017 – Mar 2020",
    points: [
      "Founded the global Fiori team; delivered against demand from Philips worldwide.",
      "Part of the DevOps team for design, implementation, L3 operations and training.",
      "Acted as Fiori architect on complex integration and implementation problems.",
      "Built complex SAP Personas flavors for mobile — barcode and photo capture.",
      "Delivered 20+ custom Fiori apps, 20+ Personas flavors and 50+ standard Fiori apps.",
      "Star Employee Award 2017; top performance ratings in years one and two.",
    ],
  },
  {
    role: "Senior Consultant",
    company: "KPMG Services",
    period: "Apr 2014 – Feb 2017",
    points: [
      "Led and executed enterprise app projects across SAP and non-SAP platforms.",
      "Founded the mobile technology team within KPMG India.",
      "Built a Cordova barcode-scanning Fiori app for SAP EWM bin-to-bin transfers.",
      "Owned the full cycle — presales, RFC/tender analysis, workshops, CCB approval, go-live support.",
      "Delivered 5 end-to-end onsite projects (~30 mobile apps) for Middle East clients.",
      "Highest (1-star) performance rating two years running.",
    ],
  },
  {
    role: "Software Engineer — Blackberry & Android",
    company: "Elegant Microweb · Sunshine Infotech · Infostretch Solutions",
    location: "Ahmedabad, India",
    period: "Jul 2010 – Apr 2012",
    points: [
      "Built the Burrp restaurant & events search app on Blackberry as the sole developer.",
      "Developed a Blackberry mobile KPI dashboard product and a graphical BI tool.",
      "Shipped recreational, directory and community apps across Blackberry and Android.",
    ],
  },
];

const EDUCATION = [
  {
    degree: "MBA — Information Technology (full-time, residential)",
    school: "Symbiosis Centre for Information Technology (SCIT)",
    period: "2012 – 2014",
    detail: "CGPA 3.2 / 4 · Majors: Software Systems",
  },
  {
    degree: "B.E. — Information Technology",
    school: "Dharmsinh Desai Institute of Technology",
    period: "2006 – 2010",
    detail: "Degree 73.84% · Aggregate 68%",
  },
  {
    degree: "SSC & HSC (Science)",
    school: "Gujarat Board",
    period: "2004 – 2006",
    detail: "SSC 87.71% · HSC 77.2%",
  },
];

const RECOGNITION = [
  "SAP Certified — Fiori Developer & Fiori Admin (Global)",
  "PMP — Project Management Institute",
  "Star Employee Award 2017 — Philips",
  "Highest performance rating (1) — KPMG, FY2014–15 & FY2015–16",
  "“Super Employee” award — KPMG India",
  "First Prize, SAP App Rumble 2013 — SAP Techniversity",
  "Invited attendee, SAP SAPPHIRE NOW 2014 — Orlando",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-teal-deep">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function RaviSoniCvPage() {
  const projects = await listPublished("cv_project", 50);
  return (
    <div className="cv-page py-14 md:py-20">
      <Container className="max-w-4xl">
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-deep">Curriculum Vitae</p>
            <h1 className="mt-2 text-4xl font-extrabold text-ink md:text-5xl">Ravikumar Soni</h1>
            <p className="mt-2 text-lg font-medium text-ink-soft">SAP BTP / Fiori Architect</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={15} /> Canada · working across Canada and the US
            </p>
          </div>
          <div className="cv-no-print shrink-0">
            <PrintButton />
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {CONTACT.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.label} href={c.href} className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-teal-deep">
                <Icon size={15} className="text-muted" /> {c.label}
              </Link>
            );
          })}
        </div>

        <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-ink-soft">
          SAP Certified senior Fiori consultant with <strong className="text-ink">12+ years</strong> leading SAP
          Fiori, BTP and SAPUI5 implementations. Deep experience in the seam between S/4HANA and the tools around
          it — CDS views, Fiori Elements, extensions and adaptations, Screen Personas, and custom SAPUI5 apps —
          delivered across food distribution, mining, healthcare and consulting.
        </p>

        <div className="mt-12 space-y-10">
          <Section title="Experience">
            <ol className="space-y-8">
              {EXPERIENCE.map((job) => (
                <li key={job.role + job.company} className="grid gap-3 md:grid-cols-[170px_1fr] md:gap-8">
                  <div className="text-sm text-muted md:pt-1">{job.period}</div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{job.role}</h3>
                    <p className="text-[15px] font-medium text-ink-soft">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    {job.note && <p className="text-sm text-muted">{job.note}</p>}
                    <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {job.points.map((p) => (
                        <li key={p} className="flex gap-2.5">
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Selected projects">
            <CvProjectGrid projects={projects} />
          </Section>

          <Section title="Skills">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SKILLS.map((s) => (
                <div key={s.group} className="break-inside-avoid">
                  <h3 className="text-sm font-bold text-ink">{s.group}</h3>
                  <ul className="mt-2 space-y-1 text-[14px] text-ink-soft">
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education">
            <ul className="space-y-4">
              {EDUCATION.map((e) => (
                <li key={e.degree} className="grid gap-1 md:grid-cols-[170px_1fr] md:gap-8">
                  <div className="text-sm text-muted">{e.period}</div>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">{e.degree}</h3>
                    <p className="text-[14px] text-ink-soft">
                      {e.school} · {e.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Certifications & recognition">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {RECOGNITION.map((r) => (
                <li key={r} className="flex gap-2.5 text-[15px] text-ink-soft">
                  <Award size={16} className="mt-0.5 shrink-0 text-gold" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="cv-no-print mt-14 rounded-[var(--radius-card)] bg-mist p-6 text-center">
          <p className="text-[15px] text-ink-soft">
            Ravi leads <Link href="/" className="font-semibold text-teal-deep hover:underline">Torotech</Link> — SAP
            and AI consulting.{" "}
            <Link href="/contact" className="font-semibold text-teal-deep hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
