import { listPublished, contentHref } from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

// llms.txt (https://llmstxt.org): a plain-markdown overview that AI assistants can read in one request.
export async function GET() {
  const [services, products, work, posts] = await Promise.all([
    listPublished("service", 50),
    listPublished("product", 50),
    listPublished("case_study", 50),
    listPublished("post", 50),
  ]);
  const line = (c: { title: string; excerpt: string | null; type: string; slug: string }) =>
    `- [${c.title}](${SITE.url}${contentHref(c as Parameters<typeof contentHref>[0])})${c.excerpt ? `: ${c.excerpt.replace(/\s+/g, " ")}` : ""}`;
  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.legalName} is based in ${SITE.location} and works with clients across Canada and the United States. Founder: ${SITE.founder}, SAP-certified SAP BTP and Fiori architect with 12+ years of experience.

Contact: ${SITE.email} · ${SITE.phone} · ${SITE.url}/contact

## Services
${services.map(line).join("\n")}

## Products
${products.map(line).join("\n")}

## Case studies
${work.map(line).join("\n")}

## Insights
${posts.map(line).join("\n")}

## More
- [Portfolio](${SITE.url}/portfolio): SAP Fiori and SAPUI5 apps, AI assistants on SAP data, BI dashboards, websites, mobile apps and interactive demos
- [About](${SITE.url}/about)
- [Ravi Soni — CV](${SITE.url}/ravisoni)
- [Copyright & terms of use](${SITE.url}/legal) · [Privacy policy](${SITE.url}/privacy)
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
