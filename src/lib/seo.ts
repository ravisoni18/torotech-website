import type { Metadata } from "next";
import { SITE } from "./site";

/**
 * Metadata for one page. Next merges `openGraph` shallowly, so a page that sets only a title would
 * otherwise lose the site's share-card fields — build the full object here instead.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  image,
  noindex = false,
}: {
  title?: string;
  description?: string | null;
  path: string;
  type?: "website" | "article";
  image?: string | null;
  noindex?: boolean;
}): Metadata {
  const desc = (description || SITE.description).slice(0, 300);
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.title;
  // A page-level openGraph object replaces the root one, so the default card has to be named explicitly.
  const images = [image ? { url: image } : { url: "/opengraph-image", width: 1200, height: 630, alt: SITE.title }];
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE.name, locale: "en_CA", url: path, title: fullTitle, description: desc, images },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE.url}${p}`);

/** The business itself — shown in Google's knowledge panel and local results. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: abs("/icon.svg"),
    image: abs("/opengraph-image"),
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    founder: { "@type": "Person", name: SITE.founder, url: abs("/ravisoni") },
    address: { "@type": "PostalAddress", addressLocality: SITE.address.locality, addressRegion: SITE.address.region, addressCountry: SITE.address.country },
    areaServed: [{ "@type": "Country", name: "Canada" }, { "@type": "Country", name: "United States" }],
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: SITE.phone, email: SITE.email, areaServed: ["CA", "US"], availableLanguage: ["English"] }],
    knowsAbout: ["SAP BTP", "SAP Fiori", "SAPUI5", "SAP S/4HANA", "AI agents", "Web development", "Mobile app development", "Business intelligence", "Playwright test automation", "n8n workflow automation"],
    sameAs: [SITE.linkedin, SITE.github],
  };
}

export function websiteLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, publisher: { "@id": `${SITE.url}/#organization` }, inLanguage: "en-CA" };
}

export function breadcrumbLd(trail: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

export function serviceLd(s: { title: string; excerpt?: string | null; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.excerpt ?? undefined,
    url: abs(`/services/${s.slug}`),
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: ["CA", "US"],
  };
}

export function softwareLd(p: { title: string; excerpt?: string | null; slug: string; image?: string | null; category?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.excerpt ?? undefined,
    url: abs(`/products/${p.slug}`),
    image: p.image ? abs(p.image) : undefined,
    applicationCategory: p.category ?? "BusinessApplication",
    operatingSystem: "Web, Android, iOS",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function articleLd(a: { title: string; excerpt?: string | null; slug: string; published?: string | null; updated?: string | null; image?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt ?? undefined,
    url: abs(`/blog/${a.slug}`),
    image: a.image ? abs(a.image) : abs("/opengraph-image"),
    datePublished: a.published ?? undefined,
    dateModified: a.updated ?? a.published ?? undefined,
    author: { "@type": "Person", name: SITE.founder, url: abs("/ravisoni") },
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

/** Serialise for a <script type="application/ld+json">, escaping `<` so content can't close the tag. */
export function ldJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
