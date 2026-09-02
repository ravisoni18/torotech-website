import "server-only";
import { createHash } from "node:crypto";
import { db, newId } from "./db";

/**
 * Privacy-conscious first-party analytics.
 * The visitor id is a hash of (ip, user-agent, daily salt) — it cannot be reversed
 * and rotates every day, so it is a "same person today" signal only.
 */
export function visitorId(ip: string, ua: string) {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT ?? "torotech";
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 24);
}

export function classifyDevice(ua: string): "mobile" | "desktop" | "bot" {
  const s = ua.toLowerCase();
  if (/bot|crawl|spider|slurp|headless|lighthouse|preview/.test(s)) return "bot";
  if (/mobi|android|iphone|ipad/.test(s)) return "mobile";
  return "desktop";
}

export async function recordEvent(e: {
  kind: "pageview" | "cta" | "lead";
  path: string;
  referrer?: string | null;
  visitor: string;
  device: string;
  ua: string;
  country?: string | null;
  data?: Record<string, unknown>;
}) {
  let refHost: string | null = null;
  if (e.referrer) {
    try {
      refHost = new URL(e.referrer).hostname.replace(/^www\./, "");
    } catch {
      refHost = null;
    }
  }
  await db.exec(
    `INSERT INTO events (id, kind, path, referrer, ref_host, visitor, device, ua, country, data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newId(),
      e.kind,
      e.path.slice(0, 500),
      e.referrer?.slice(0, 1000) ?? null,
      refHost,
      e.visitor,
      e.device,
      e.ua.slice(0, 300),
      e.country ?? null,
      JSON.stringify(e.data ?? {}),
    ],
  );
}

export type Overview = {
  range_days: number;
  pageviews: number;
  visitors: number;
  leads: number;
  cta_clicks: number;
  prev_pageviews: number;
  prev_visitors: number;
  prev_leads: number;
  daily: { day: string; pageviews: number; visitors: number; leads: number }[];
  top_pages: { path: string; views: number; visitors: number }[];
  referrers: { ref_host: string; views: number }[];
  devices: { device: string; views: number }[];
  lead_status: { status: string; n: number }[];
  lead_interest: { interest: string; n: number }[];
  recent_events: { ts: string; kind: string; path: string; ref_host: string | null; device: string }[];
};

export async function overview(days = 30): Promise<Overview> {
  const d = Math.max(1, Math.min(365, days));
  const cur = `ts >= now() - INTERVAL '${d} days' AND device <> 'bot'`;
  const prev = `ts >= now() - INTERVAL '${2 * d} days' AND ts < now() - INTERVAL '${d} days' AND device <> 'bot'`;

  const [totals] = await db.query<{
    pageviews: number;
    visitors: number;
    cta_clicks: number;
    prev_pageviews: number;
    prev_visitors: number;
  }>(`
    SELECT
      (SELECT count(*)::INTEGER FROM events WHERE kind='pageview' AND ${cur}) AS pageviews,
      (SELECT count(DISTINCT visitor)::INTEGER FROM events WHERE kind='pageview' AND ${cur}) AS visitors,
      (SELECT count(*)::INTEGER FROM events WHERE kind='cta' AND ${cur}) AS cta_clicks,
      (SELECT count(*)::INTEGER FROM events WHERE kind='pageview' AND ${prev}) AS prev_pageviews,
      (SELECT count(DISTINCT visitor)::INTEGER FROM events WHERE kind='pageview' AND ${prev}) AS prev_visitors
  `);

  const [leadTotals] = await db.query<{ leads: number; prev_leads: number }>(`
    SELECT
      (SELECT count(*)::INTEGER FROM leads WHERE created_at >= now() - INTERVAL '${d} days') AS leads,
      (SELECT count(*)::INTEGER FROM leads WHERE created_at >= now() - INTERVAL '${2 * d} days' AND created_at < now() - INTERVAL '${d} days') AS prev_leads
  `);

  const daily = await db.query<{ day: string; pageviews: number; visitors: number; leads: number }>(`
    WITH days AS (
      SELECT (current_date - INTERVAL (x) DAY)::DATE AS day FROM range(${d}) t(x)
    ),
    pv AS (
      SELECT ts::DATE AS day, count(*)::INTEGER AS pageviews, count(DISTINCT visitor)::INTEGER AS visitors
      FROM events WHERE kind='pageview' AND ${cur} GROUP BY 1
    ),
    ld AS (
      SELECT created_at::DATE AS day, count(*)::INTEGER AS leads FROM leads
      WHERE created_at >= now() - INTERVAL '${d} days' GROUP BY 1
    )
    SELECT strftime(days.day, '%Y-%m-%d') AS day,
           coalesce(pv.pageviews, 0) AS pageviews,
           coalesce(pv.visitors, 0) AS visitors,
           coalesce(ld.leads, 0) AS leads
    FROM days LEFT JOIN pv USING (day) LEFT JOIN ld USING (day)
    ORDER BY days.day
  `);

  const top_pages = await db.query<{ path: string; views: number; visitors: number }>(`
    SELECT path, count(*)::INTEGER AS views, count(DISTINCT visitor)::INTEGER AS visitors
    FROM events WHERE kind='pageview' AND ${cur} GROUP BY path ORDER BY views DESC LIMIT 10
  `);

  const referrers = await db.query<{ ref_host: string; views: number }>(`
    SELECT coalesce(ref_host, 'direct') AS ref_host, count(*)::INTEGER AS views
    FROM events WHERE kind='pageview' AND ${cur} GROUP BY 1 ORDER BY views DESC LIMIT 8
  `);

  const devices = await db.query<{ device: string; views: number }>(`
    SELECT device, count(*)::INTEGER AS views FROM events
    WHERE kind='pageview' AND ${cur} GROUP BY device ORDER BY views DESC
  `);

  const lead_status = await db.query<{ status: string; n: number }>(
    `SELECT status, count(*)::INTEGER AS n FROM leads GROUP BY status ORDER BY n DESC`,
  );
  const lead_interest = await db.query<{ interest: string; n: number }>(
    `SELECT coalesce(interest, 'unspecified') AS interest, count(*)::INTEGER AS n FROM leads GROUP BY 1 ORDER BY n DESC`,
  );

  const recent_events = await db.query<{ ts: string; kind: string; path: string; ref_host: string | null; device: string }>(
    `SELECT ts, kind, path, ref_host, device FROM events WHERE device <> 'bot' ORDER BY ts DESC LIMIT 25`,
  );

  return {
    range_days: d,
    ...totals,
    ...leadTotals,
    daily,
    top_pages,
    referrers,
    devices,
    lead_status,
    lead_interest,
    recent_events,
  };
}

/** Read-only SQL for the admin query workbench. Anything but a single SELECT/WITH is rejected. */
export async function readOnlyQuery(sql: string) {
  const trimmed = sql.trim().replace(/;+\s*$/, "");
  if (!/^(select|with|from|describe|show|summarize|pivot)\b/i.test(trimmed)) {
    throw new Error("Only read queries (SELECT / WITH / DESCRIBE / SUMMARIZE) are allowed here.");
  }
  if (/\b(insert|update|delete|drop|alter|create|attach|copy|export|install|load|pragma|set)\b/i.test(trimmed)) {
    throw new Error("That statement contains a write or admin keyword and was not run.");
  }
  if (trimmed.includes(";")) throw new Error("One statement at a time.");
  const rows = await db.query(`SELECT * FROM (${trimmed}) LIMIT 500`);
  return rows;
}
