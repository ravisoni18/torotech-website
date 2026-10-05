import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { listFields } from "@/lib/fields";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Container } from "@/components/marketing/ui";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMeta({
  title: "Contact — book a call",
  description:
    "Contact Torotech in Kitchener, Ontario: call +1 613 716 1135 or email hello@torotech.ca about SAP BTP, Fiori, AI, web or mobile app development.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ interest?: string; message?: string }> }) {
  const { interest, message } = await searchParams;
  const fields = (await listFields("lead")).map((f) => ({
    key: f.key,
    label: f.label,
    type: f.type,
    options: f.options,
    required: f.required,
  }));

  return (
    <section className="pt-16 md:pt-24">
      <Container className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Let&apos;s talk about the process.</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Thirty minutes is enough to tell whether an agent, an extension or a plain good Fiori app is the answer.
            Bring the messy version — that&apos;s where the value is.
          </p>
          <address className="mt-10 space-y-5 text-[15px] not-italic">
            <div>
              <div className="font-bold text-ink">Phone</div>
              <a href={SITE.phoneHref} className="text-teal-deep hover:underline">
                {SITE.phone}
              </a>
            </div>
            <div>
              <div className="font-bold text-ink">Email</div>
              {SITE.emails.map((e) => (
                <div key={e.address}>
                  <a href={`mailto:${e.address}`} className="text-teal-deep hover:underline">
                    {e.address}
                  </a>
                  {SITE.emails.length > 1 && <span className="text-ink-soft"> · {e.label}</span>}
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold text-ink">Location</div>
              <div className="text-ink-soft">{SITE.location} · working with clients across Canada and the US</div>
            </div>
            <div>
              <div className="font-bold text-ink">Response time</div>
              <div className="text-ink-soft">Within one business day</div>
            </div>
          </address>
        </div>
        <div className="relative rounded-[var(--radius-card)] border border-line p-7 md:p-9">
          <ContactForm fields={fields} defaultInterest={interest} defaultMessage={message?.slice(0, 2000)} />
        </div>
      </Container>
    </section>
  );
}
