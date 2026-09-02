import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services/ai-for-sap", label: "AI agents for S/4HANA" },
      { href: "/services/btp-extensions", label: "BTP extensions" },
      { href: "/services/fiori-apps", label: "Fiori & UI5" },
      { href: "/services/web-development", label: "Web apps with AI" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/products", label: "Products" },
      { href: "/work", label: "Work" },
      { href: "/blog", label: "Insights" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { href: SITE.linkedin, label: "LinkedIn" },
      { href: SITE.github, label: "GitHub" },
      { href: `mailto:${SITE.email}`, label: SITE.email },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-mist">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-soft">
            AI solutions for SAP, BTP and Fiori — and web applications with AI built in. Based in{" "}
            {SITE.location}.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-ink-soft transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Torotech Inc. All rights reserved.</p>
          <p>
            SAP, S/4HANA, BTP and Fiori are trademarks of SAP SE. Torotech is an independent consultancy.
          </p>
        </div>
      </div>
    </footer>
  );
}
