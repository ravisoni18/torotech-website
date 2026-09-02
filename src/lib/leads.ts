import "server-only";
import { db, newId } from "./db";
import { safeJson } from "./content";
import { sendLeadEmails } from "./mail";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  interest: string | null;
  source: string | null;
  page: string | null;
  data: Record<string, unknown>;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

type Row = Omit<Lead, "data"> & { data: string };

export async function createLead(input: {
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  interest?: string | null;
  source?: string | null;
  page?: string | null;
  data?: Record<string, unknown>;
}): Promise<string> {
  const id = newId();
  await db.exec(
    `INSERT INTO leads (id, name, email, company, message, interest, source, page, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.name,
      input.email,
      input.company ?? null,
      input.message ?? null,
      input.interest ?? null,
      input.source ?? null,
      input.page ?? null,
      JSON.stringify(input.data ?? {}),
    ],
  );
  await notifyWebhook({ id, ...input });
  await sendLeadEmails({ id, ...input });
  return id;
}

export async function listLeads(status?: LeadStatus): Promise<Lead[]> {
  const rows = status
    ? await db.query<Row>(`SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC`, [status])
    : await db.query<Row>(`SELECT * FROM leads ORDER BY created_at DESC`);
  return rows.map((r) => ({ ...r, data: safeJson<Record<string, unknown>>(r.data, {}) }));
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await db.exec(`UPDATE leads SET status = ?, updated_at = now() WHERE id = ?`, [status, id]);
}

export async function deleteLead(id: string) {
  await db.exec(`DELETE FROM leads WHERE id = ?`, [id]);
}

/** Optional: POST every new lead to a webhook (Slack, Zapier, n8n, your CRM). */
async function notifyWebhook(lead: Record<string, unknown>) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `New lead: ${lead.name} <${lead.email}>${lead.company ? ` (${lead.company})` : ""}`,
        lead,
      }),
    });
  } catch (err) {
    console.error("lead webhook failed", err);
  }
}
