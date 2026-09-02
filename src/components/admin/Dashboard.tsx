"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Overview } from "@/lib/analytics";
import { BarList, SERIES, StatTile, TrendChart, pctChange } from "./Charts";
import { Button, Card, PageHeader, StatusPill, api, formatDateTime } from "./ui";

const RANGES = [7, 30, 90];

export function Dashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(true);

  const load = useCallback(async () => {
    try {
      const next = await api<Overview>(`/api/admin/analytics?days=${days}`);
      setData(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [days]);

  function refresh() {
    setLoading(true);
    void load();
  }

  useEffect(() => {
    let cancelled = false;
    api<Overview>(`/api/admin/analytics?days=${days}`)
      .then((next) => {
        if (cancelled) return;
        setData(next);
        setError(null);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"));
    return () => {
      cancelled = true;
    };
  }, [days]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [live, load]);

  const dayLabel = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" });

  return (
    <>
      <PageHeader title="Overview" lede="First-party analytics and the lead pipeline, straight from DuckDB.">
        <div className="flex rounded-lg border border-line bg-paper p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${days === r ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {r}d
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={() => setLive((v) => !v)} aria-pressed={live}>
          <span className={`h-2 w-2 rounded-full ${live ? "bg-teal" : "bg-line"}`} />
          {live ? "Live" : "Paused"}
        </Button>
        <Button variant="ghost" onClick={refresh} disabled={loading} aria-label="Refresh">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </PageHeader>

      {error && <p className="mb-4 rounded-lg bg-[#fdecea] px-4 py-3 text-sm text-coral">{error}</p>}

      {data && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Page views" value={data.pageviews.toLocaleString()} delta={pctChange(data.pageviews, data.prev_pageviews)} hint="No previous period yet" />
            <StatTile label="Visitors" value={data.visitors.toLocaleString()} delta={pctChange(data.visitors, data.prev_visitors)} hint="Unique per day, hashed" />
            <StatTile label="Leads" value={data.leads.toLocaleString()} delta={pctChange(data.leads, data.prev_leads)} hint="From the contact form" />
            <StatTile label="CTA clicks" value={data.cta_clicks.toLocaleString()} hint="Tracked buttons" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Page views per day">
              <TrendChart data={data.daily.map((d) => ({ label: dayLabel(d.day), value: d.pageviews }))} color={SERIES.a} />
            </Card>
            <Card title="Visitors per day">
              <TrendChart data={data.daily.map((d) => ({ label: dayLabel(d.day), value: d.visitors }))} color={SERIES.b} />
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Top pages">
              <BarList data={data.top_pages.map((p) => ({ label: p.path, value: p.views }))} />
            </Card>
            <Card title="Referrers">
              <BarList data={data.referrers.map((r) => ({ label: r.ref_host, value: r.views }))} color={SERIES.b} />
            </Card>
            <Card title="Devices">
              <BarList data={data.devices.map((d) => ({ label: d.device, value: d.views }))} color={SERIES.c} />
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Lead pipeline">
              <BarList data={data.lead_status.map((s) => ({ label: s.status, value: s.n }))} />
            </Card>
            <Card title="Leads by interest">
              <BarList data={data.lead_interest.map((s) => ({ label: s.interest, value: s.n }))} color={SERIES.b} />
            </Card>
            <Card title="Latest activity">
              <ul className="max-h-72 divide-y divide-line overflow-auto text-sm">
                {data.recent_events.length === 0 && <li className="py-6 text-center text-muted">Nothing yet.</li>}
                {data.recent_events.map((e, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-ink">{e.path}</div>
                      <div className="text-xs text-muted">
                        {formatDateTime(e.ts)} · {e.device}
                        {e.ref_host ? ` · from ${e.ref_host}` : ""}
                      </div>
                    </div>
                    <StatusPill value={e.kind} />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
