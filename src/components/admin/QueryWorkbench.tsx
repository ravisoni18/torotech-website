"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button, Card, PageHeader, api, inputCls } from "./ui";

const EXAMPLES: { label: string; sql: string }[] = [
  {
    label: "Views by page, last 7 days",
    sql: `SELECT path, count(*) AS views, count(DISTINCT visitor) AS visitors
FROM events
WHERE kind = 'pageview' AND ts >= now() - INTERVAL '7 days' AND device <> 'bot'
GROUP BY path ORDER BY views DESC`,
  },
  {
    label: "Leads with a custom field",
    sql: `SELECT name, email, interest, status,
       data->>'budget'   AS budget,
       data->>'timeline' AS timeline
FROM leads ORDER BY created_at DESC`,
  },
  {
    label: "Hourly traffic today",
    sql: `SELECT date_part('hour', ts) AS hour, count(*) AS views
FROM events WHERE kind='pageview' AND ts::DATE = current_date
GROUP BY 1 ORDER BY 1`,
  },
  {
    label: "Content by type and status",
    sql: `SELECT type, status, count(*) AS n, max(updated_at) AS last_edit
FROM content GROUP BY 1, 2 ORDER BY 1, 2`,
  },
  {
    label: "Contact-page conversion",
    sql: `WITH v AS (SELECT count(DISTINCT visitor) AS visitors FROM events WHERE path='/contact' AND kind='pageview' AND ts >= now() - INTERVAL '30 days'),
     l AS (SELECT count(*) AS leads FROM leads WHERE created_at >= now() - INTERVAL '30 days')
SELECT visitors, leads, round(100.0 * leads / nullif(visitors, 0), 1) AS conversion_pct FROM v, l`,
  },
];

export function QueryWorkbench() {
  const [sql, setSql] = useState(EXAMPLES[0].sql);
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [ms, setMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      const res = await api<{ rows: Record<string, unknown>[]; ms: number }>(`/api/admin/query`, { method: "POST", json: { sql } });
      setRows(res.rows);
      setMs(res.ms);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Query failed");
      setRows(null);
    } finally {
      setRunning(false);
    }
  }

  const cols = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <>
      <PageHeader title="Query" lede="Ask DuckDB anything about content, leads or traffic. Read-only, capped at 500 rows.">
        <Button onClick={run} disabled={running}>
          <Play size={15} /> {running ? "Running…" : "Run"}
        </Button>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <Card title="Examples">
          <ul className="space-y-1">
            {EXAMPLES.map((ex) => (
              <li key={ex.label}>
                <button type="button" onClick={() => setSql(ex.sql)} className="w-full rounded-md px-2 py-1.5 text-left text-sm text-ink-soft hover:bg-mist hover:text-ink">
                  {ex.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-line pt-4 text-xs text-muted">
            Tables: <code className="font-mono">content</code>, <code className="font-mono">leads</code>, <code className="font-mono">events</code>,{" "}
            <code className="font-mono">field_defs</code>. Custom fields are JSON in <code className="font-mono">data</code> — use{" "}
            <code className="font-mono">data-&gt;&gt;&apos;key&apos;</code>.
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <textarea
              className={`${inputCls} min-h-[10rem] font-mono text-[13px] leading-relaxed`}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run();
              }}
              spellCheck={false}
            />
            <div className="mt-2 text-xs text-muted">⌘/Ctrl + Enter runs the query.</div>
          </Card>

          {error && <p className="rounded-lg bg-[#fdecea] px-4 py-3 text-sm text-coral">{error}</p>}

          {rows && (
            <Card title={`${rows.length} row${rows.length === 1 ? "" : "s"}${ms !== null ? ` · ${ms} ms` : ""}`} className="overflow-hidden p-0 [&>div]:px-5 [&>div]:pt-5">
              <div className="overflow-auto">
                {rows.length === 0 ? (
                  <p className="p-6 text-sm text-muted">The query ran but returned no rows.</p>
                ) : (
                  <table className="w-full whitespace-nowrap text-sm">
                    <thead className="bg-mist text-left text-xs text-ink-soft">
                      <tr>
                        {cols.map((c) => (
                          <th key={c} className="px-4 py-2 font-semibold">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line font-mono text-[13px]">
                      {rows.map((r, i) => (
                        <tr key={i}>
                          {cols.map((c) => (
                            <td key={c} className="max-w-[28rem] truncate px-4 py-1.5 text-ink">
                              {fmt(r[c])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function fmt(v: unknown) {
  if (v === null || v === undefined) return <span className="text-muted">null</span>;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
