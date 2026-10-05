import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/marketing/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description: "How Torotech collects, uses and protects personal information on torotech.ca — no advertising trackers, no third-party analytics, no visitor cookies.",
  path: "/privacy",
});

const UPDATED = "October 5, 2026";

// Keep this page in step with what the code does: src/lib/analytics.ts, src/lib/leads.ts, src/lib/mail.ts.
export default function PrivacyPage() {
  return (
    <section className="pt-16 md:pt-24">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated {UPDATED}</p>

        <div className="prose-tt mt-10">
          <p>
            {SITE.legalName} (“Torotech”, “we”) runs {SITE.domain}. This policy explains what personal information we
            collect through the site, why, and the choices you have. We follow Canada&apos;s Personal Information
            Protection and Electronic Documents Act (PIPEDA). In short: <strong>no advertising trackers, no third-party
            analytics and no cookies for visitors</strong>.
          </p>

          <h2>What we collect</h2>
          <h3>When you browse</h3>
          <p>Our own analytics records each page view with:</p>
          <ul>
            <li>the page address and the page that linked to it (referrer);</li>
            <li>your browser type and whether you&apos;re on a phone or a computer;</li>
            <li>your country, when our hosting provides it;</li>
            <li>
              an anonymous visitor ID — a one-way hash of your IP address, browser and the date. It changes every day, cannot
              be reversed, and is used only to count unique visits. <strong>We do not store your IP address.</strong>
            </li>
          </ul>
          <p>This data stays on our own server. It is not shared with Google, advertisers or data brokers.</p>

          <h3>When you contact us</h3>
          <p>
            If you use the contact form, we collect what you enter — your name, email, company and any project details such as
            budget, timeline and your message — plus the page you sent it from. If you email or call us, we keep that
            correspondence.
          </p>

          <h3>On your own device</h3>
          <p>
            A few interactive features save small amounts of data in your browser&apos;s storage, never on our server: game high
            scores, and the order or cart in demo apps. You can clear it at any time in your browser settings.
          </p>

          <h2>Cookies</h2>
          <p>
            The public site sets no cookies. A sign-in cookie is used only on our private administration area, for our own
            staff.
          </p>

          <h2>How we use it</h2>
          <ul>
            <li>To reply to your enquiry and, if we work together, to deliver and invoice the work.</li>
            <li>To understand which pages are useful so we can improve the site.</li>
            <li>To keep the site secure and working.</li>
          </ul>
          <p>We don&apos;t sell or rent personal information, and we don&apos;t add you to mailing lists without asking.</p>

          <h2>Who else processes it</h2>
          <ul>
            <li>
              <strong>Hosting and email.</strong> The site, its database and our email run on a server we manage, rented from
              our hosting provider. Contact-form messages are emailed to our team inbox and a confirmation is emailed to you
              through our own mail server.
            </li>
            <li>
              <strong>Demo pages.</strong> Some interactive demos load fonts from Google Fonts and, for SAP Fiori demos, the
              OpenUI5 library from SAP&apos;s public content network. Those requests send your IP address and browser details to
              Google or SAP under their own privacy policies. The main site&apos;s fonts are served from our own server.
            </li>
          </ul>
          <p>
            Your information may be stored or processed outside your province or outside Canada, where it is subject to local
            law. We otherwise share it only when required by law.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries are kept for as long as needed to respond and follow up, and for client work as long as needed for the
            engagement and our legal and accounting obligations. Analytics records hold no directly identifying information.
            You can ask us to delete your enquiry at any time.
          </p>

          <h2>How we protect it</h2>
          <p>
            The site is served only over encrypted HTTPS. The database and administration area are restricted to authorised
            staff behind sign-in, and access is kept to what each task needs.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask what personal information we hold about you, ask us to correct it, or withdraw consent and have it
            deleted, subject to any legal requirement to keep it. We reply within 30 days. If you&apos;re not satisfied, you can
            contact the{" "}
            <a href="https://www.priv.gc.ca/" target="_blank" rel="noreferrer">
              Office of the Privacy Commissioner of Canada
            </a>
            .
          </p>

          <h2>Children</h2>
          <p>The site is meant for businesses and is not directed at children under 16.</p>

          <h2>Changes</h2>
          <p>If we change this policy we&apos;ll update the date at the top of this page.</p>

          <h2>Contact</h2>
          <p>
            Questions or requests about privacy: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href={SITE.phoneHref}>{SITE.phone}</a> ·{" "}
            {SITE.legalName}, {SITE.location}. See also our <Link href="/legal">copyright &amp; terms of use</Link>.
          </p>
        </div>
      </Container>
    </section>
  );
}
