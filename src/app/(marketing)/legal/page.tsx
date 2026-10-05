import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/marketing/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Copyright & terms of use",
  description: "Copyright notice and terms of use for torotech.ca — content, source code, designs and interactive demos are owned by Torotech Inc.",
  path: "/legal",
});

const UPDATED = "October 5, 2026";

export default function LegalPage() {
  const year = new Date().getFullYear();
  return (
    <section className="pt-16 md:pt-24">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Copyright &amp; terms of use</h1>
        <p className="mt-3 text-sm text-muted">Last updated {UPDATED}</p>

        <div className="prose-tt mt-10">
          <h2>Copyright</h2>
          <p>
            © {year} {SITE.legalName} All rights reserved. Everything on {SITE.domain} — including text, source code,
            page layouts, graphics, screenshots, product and portfolio designs, interactive demos, concept mockups and
            the selection and arrangement of that material — is owned by {SITE.legalName} or used under licence, and is
            protected by the Copyright Act (Canada) and international copyright treaties.
          </p>

          <h2>What you may do</h2>
          <ul>
            <li>View the site and use its demos for your own evaluation of our services.</li>
            <li>Share links to any page.</li>
            <li>Quote short passages with a clear credit and a link back to the source page.</li>
          </ul>

          <h2>What you may not do without our written permission</h2>
          <ul>
            <li>Copy, reproduce, republish or redistribute the site&apos;s content, code, designs or demos, in whole or in part.</li>
            <li>Reuse our demos, mockups or interface designs in your own products, portfolios, proposals or client work.</li>
            <li>Frame or embed our pages or demos on another website.</li>
            <li>Scrape, crawl or bulk-download content, or use it to train machine-learning models.</li>
            <li>Remove or alter copyright notices, attributions or watermarks.</li>
          </ul>

          <h2>Trademarks</h2>
          <p>
            “Torotech” and the Torotech logo are trademarks of {SITE.legalName}. SAP, S/4HANA, BTP and Fiori are trademarks of
            SAP SE; Zebra is a trademark of Zebra Technologies; other names belong to their respective owners. Their use
            describes compatibility and does not imply endorsement. Torotech is an independent consultancy.
          </p>

          <h2>Demos and concept work</h2>
          <p>
            Interactive demos and concept designs use fictional brands and sample data. They are illustrations of our work,
            not offers of software, and any resemblance to real businesses is coincidental. Third-party photographs are used
            under the Unsplash licence and remain the property of their photographers.
          </p>

          <h2>Reporting misuse or requesting permission</h2>
          <p>
            To request permission, or to report a copy of our work published elsewhere, email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call <a href={SITE.phoneHref}>{SITE.phone}</a>. We act on
            infringement, including takedown notices to hosting providers. How we handle personal information is described in our{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>

          <h2>No warranty</h2>
          <p>
            The site is provided as is. We aim to keep it accurate but make no warranty about its completeness or
            availability, and we are not liable for loss arising from its use. These terms are governed by the laws of
            Ontario and the federal laws of Canada applicable there.
          </p>
        </div>
      </Container>
    </section>
  );
}
