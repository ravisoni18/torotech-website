import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { SITE } from "./site";

/**
 * Transactional email over SMTP (the self-hosted mail server, or any provider).
 * Configure with SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS. When SMTP_HOST is
 * unset, sending is a no-op so local dev and preview deploys keep working.
 */

let cached: Transporter | null | undefined;

function transport(): Transporter | null {
  if (cached !== undefined) return cached;
  const host = process.env.SMTP_HOST;
  if (!host) {
    cached = null;
    return null;
  }
  const port = Number(process.env.SMTP_PORT ?? 587);
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  return cached;
}

export function mailEnabled(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

const FROM = process.env.SMTP_FROM ?? `${SITE.name} <${SITE.email}>`;

export async function sendMail(msg: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<void> {
  const t = transport();
  if (!t) return;
  try {
    await t.sendMail({ from: FROM, ...msg });
  } catch (err) {
    console.error("sendMail failed", err);
  }
}

/** Notify the team of a new lead and send the enquirer a short acknowledgement. */
export async function sendLeadEmails(lead: {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  interest?: string | null;
  page?: string | null;
}): Promise<void> {
  if (!mailEnabled()) return;

  const inbox =
    process.env.LEAD_NOTIFY_TO ??
    process.env.ADMIN_EMAILS?.split(",")[0].trim() ??
    SITE.email;

  const lines = [
    `Name:     ${lead.name}`,
    `Email:    ${lead.email}`,
    lead.company ? `Company:  ${lead.company}` : null,
    lead.interest ? `Interest: ${lead.interest}` : null,
    lead.page ? `Page:     ${lead.page}` : null,
    "",
    lead.message ?? "(no message)",
    "",
    `${SITE.url}/admin/leads`,
  ].filter(Boolean);

  await sendMail({
    to: inbox,
    replyTo: `${lead.name} <${lead.email}>`,
    subject: `New lead: ${lead.name}${lead.company ? ` — ${lead.company}` : ""}`,
    text: lines.join("\n"),
  });

  await sendMail({
    to: `${lead.name} <${lead.email}>`,
    subject: `Thanks for reaching out to ${SITE.name}`,
    text: [
      `Hi ${lead.name.split(" ")[0]},`,
      "",
      `Thanks for getting in touch — we've received your message and someone from ${SITE.name} will reply within one business day.`,
      "",
      "For reference, here's what you sent:",
      "",
      lead.message ?? "(no message)",
      "",
      "— The Torotech team",
      SITE.url,
    ].join("\n"),
  });
}
