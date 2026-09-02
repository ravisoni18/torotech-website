"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/field-types";
import { Button, Card, PageHeader, StatusPill, Toast, api, formatDateTime, inputCls } from "./ui";

export type LeadView = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  interest: string | null;
  source: string | null;
  page: string | null;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export function LeadsInbox({ initial, fields }: { initial: LeadView[]; fields: FieldDef[] }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<LeadView | null>(initial[0] ?? null);
  const [toast, setToast] = useState<string | null>(null);

  const visible = leads.filter((l) => filter === "all" || l.status === filter);

  async function setStatus(lead: LeadView, status: string) {
    try {
      await api(`/api/admin/leads/${lead.id}`, { method: "PATCH", json: { status } });
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status } : l)));
      setSelected((s) => (s?.id === lead.id ? { ...s, status } : s));
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Update failed");
      setTimeout(() => setToast(null), 2500);
    }
  }

  async function remove(lead: LeadView) {
    if (!window.confirm(`Delete lead from ${lead.name}?`)) return;
    await api(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
    setLeads((ls) => ls.filter((l) => l.id !== lead.id));
    setSelected((s) => (s?.id === lead.id ? null : s));
  }

  function exportCsv() {
    const cols = ["created_at", "name", "email", "company", "interest", "status", "page", "message", ...fields.map((f) => f.key)];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = leads.map((l) => cols.map((c) => esc(c in l ? (l as Record<string, unknown>)[c] : l.data[c])).join(","));
    const blob = new Blob([[cols.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `torotech-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <>
      <PageHeader title="Leads" lede="Everything submitted through the contact form, newest first.">
        <Button variant="secondary" onClick={exportCsv} disabled={leads.length === 0}>
          Export CSV
        </Button>
      </PageHeader>

      <div className="mb-4 flex rounded-lg border border-line bg-paper p-0.5">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${filter === s ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
          >
            {s}
            {s !== "all" && <span className="ml-1 text-xs opacity-70">{leads.filter((l) => l.status === s).length}</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="max-h-[70vh] overflow-auto p-0">
          {visible.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">No leads in this view. When someone sends the contact form, it lands here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {visible.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(l)}
                    className={`w-full px-4 py-3 text-left hover:bg-mist/60 ${selected?.id === l.id ? "bg-teal-tint/50" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink">{l.name}</span>
                      <StatusPill value={l.status} />
                    </div>
                    <div className="truncate text-sm text-ink-soft">
                      {l.company ? `${l.company} · ` : ""}
                      {l.interest ?? "No interest given"}
                    </div>
                    <div className="mt-0.5 text-xs text-muted">{formatDateTime(l.created_at)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          {!selected ? (
            <p className="py-12 text-center text-sm text-muted">Select a lead to read it.</p>
          ) : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-ink">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-teal-deep hover:underline">
                    {selected.email}
                  </a>
                  {selected.company && <div className="text-ink-soft">{selected.company}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <select className={`${inputCls} w-auto`} value={selected.status} onChange={(e) => setStatus(selected, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button variant="danger" onClick={() => remove(selected)} aria-label="Delete lead">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>

              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <Fact k="Interest" v={selected.interest} />
                <Fact k="Received" v={formatDateTime(selected.created_at)} />
                <Fact k="From page" v={selected.page} />
                <Fact k="Source" v={selected.source} />
                {fields.map((f) => (
                  <Fact key={f.key} k={f.label} v={formatValue(selected.data[f.key])} />
                ))}
              </dl>

              <div className="mt-6">
                <div className="text-sm font-bold text-ink">Message</div>
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-mist p-4 text-[15px] leading-relaxed text-ink-soft">
                  {selected.message || "No message."}
                </p>
              </div>

              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your note to Torotech")}`}
                className="mt-6 inline-block rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-teal-deep"
              >
                Reply by email
              </a>
            </div>
          )}
        </Card>
      </div>
      <Toast message={toast} kind="error" />
    </>
  );
}

function Fact({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <div className="rounded-lg border border-line px-3 py-2">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="text-ink">{v || "—"}</dd>
    </div>
  );
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
