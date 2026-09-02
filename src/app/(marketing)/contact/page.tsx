import type { Metadata } from "next";
import { listFields } from "@/lib/fields";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Container } from "@/components/marketing/ui";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact", description: "Book a call with Torotech about SAP, BTP, Fiori or an AI-integrated web app." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
  const { interest } = await searchParams;
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
          <dl className="mt-10 space-y-5 text-[15px]">
            <div>
              <dt className="font-bold text-ink">Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`} className="text-teal-deep hover:underline">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Where</dt>
              <dd className="text-ink-soft">{SITE.location} · remote across North America</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Response time</dt>
              <dd className="text-ink-soft">Within one business day</dd>
            </div>
          </dl>
        </div>
        <div className="relative rounded-[var(--radius-card)] border border-line p-7 md:p-9">
          <ContactForm fields={fields} defaultInterest={interest} />
        </div>
      </Container>
    </section>
  );
}
