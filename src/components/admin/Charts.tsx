"use client";

import { useId, useState } from "react";

/* Chart palette validated for CVD separation and contrast on the light surface. */
export const SERIES = { a: "#0f9d9d", b: "#3b5bdb", c: "#c2620a" };
const GRID = "#e6ecf1";
const AXIS = "#6b7a90";

type Point = { label: string; value: number };

/** Single-series area/line over time with a crosshair tooltip. */
export function TrendChart({
  data,
  color = SERIES.a,
  height = 180,
  format = (n: number) => n.toLocaleString(),
}: {
  data: Point[];
  color?: string;
  height?: number;
  format?: (n: number) => string;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const pad = { l: 36, r: 12, t: 12, b: 26 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i / (n - 1)) * (W - pad.l - pad.r));
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`).join(" ");
  const area = `${path} L ${x(n - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  const labelEvery = Math.max(1, Math.ceil(n / 6));

  if (n === 0) return <Empty />;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Trend over time"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1));
          setHover(Math.max(0, Math.min(n - 1, i)));
        }}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.18" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={GRID} />
            <text x={pad.l - 6} y={y(t) + 4} fontSize="10" textAnchor="end" fill={AXIS}>
              {format(t)}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#${id}-fill)`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {data.map((d, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <text key={d.label} x={x(i)} y={H - 8} fontSize="10" textAnchor="middle" fill={AXIS}>
              {d.label}
            </text>
          ) : null,
        )}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke={AXIS} strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(data[hover].value)} r="5" fill={color} stroke="#fff" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-1 rounded-md bg-ink px-2.5 py-1.5 text-xs text-white"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="text-[#c9d6e3]">{data[hover].label}</div>
          <div className="font-semibold">{format(data[hover].value)}</div>
        </div>
      )}
    </div>
  );
}

/** Horizontal bars for a ranked categorical list. */
export function BarList({ data, color = SERIES.a, max: maxProp }: { data: Point[]; color?: string; max?: number }) {
  if (data.length === 0) return <Empty />;
  const max = maxProp ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-2.5">
      {data.map((d) => (
        <li key={d.label} className="group text-sm" title={`${d.label}: ${d.value.toLocaleString()}`}>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-ink">{d.label}</span>
            <span className="tabular-nums text-ink-soft">{d.value.toLocaleString()}</span>
          </div>
          <div className="mt-1 h-2 rounded-[4px] bg-mist">
            <div className="h-2 rounded-[4px] transition-[width]" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StatTile({ label, value, delta, hint }: { label: string; value: string; delta?: number | null; hint?: string }) {
  const up = (delta ?? 0) > 0;
  const flat = delta === null || delta === undefined || delta === 0;
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
      <div className="text-sm text-ink-soft">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight text-ink">{value}</div>
      {!flat && (
        <div className={`mt-1 text-xs font-semibold ${up ? "text-teal-deep" : "text-coral"}`}>
          {up ? "▲" : "▼"} {Math.abs(delta!).toFixed(0)}% vs previous period
        </div>
      )}
      {flat && hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

function Empty() {
  return <p className="py-8 text-center text-sm text-muted">No data yet. It shows up here as visitors arrive.</p>;
}

export function pctChange(cur: number, prev: number): number | null {
  if (!prev) return null;
  return ((cur - prev) / prev) * 100;
}
