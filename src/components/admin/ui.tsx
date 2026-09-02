"use client";

export function PageHeader({ title, lede, children }: { title: string; lede?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
        {lede && <p className="mt-1 text-[15px] text-ink-soft">{lede}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({ children, className = "", title, aside }: { children: React.ReactNode; className?: string; title?: string; aside?: React.ReactNode }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-line bg-paper p-5 ${className}`}>
      {(title || aside) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-bold text-ink">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export const inputCls =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted focus:border-teal focus:outline-none disabled:opacity-60";
export const labelCls = "grid gap-1.5 text-sm font-medium text-ink";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const styles = {
    primary: "bg-ink text-white hover:bg-teal-deep",
    secondary: "border border-line bg-paper text-ink hover:border-ink",
    danger: "bg-[#fdecea] text-coral hover:bg-[#f9d6d1]",
    ghost: "text-ink-soft hover:bg-mist hover:text-ink",
  }[variant];
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    published: "bg-teal-tint text-teal-deep",
    draft: "bg-mist text-ink-soft",
    new: "bg-[#fff4d6] text-[#8a5a00]",
    contacted: "bg-[#e6ecff] text-[#2f4bc4]",
    qualified: "bg-teal-tint text-teal-deep",
    won: "bg-[#e0f5e6] text-[#1f7a3e]",
    lost: "bg-mist text-muted",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[value] ?? "bg-mist text-ink-soft"}`}>{value}</span>;
}

export async function api<T = unknown>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.json !== undefined ? { "content-type": "application/json" } : {}), ...(init?.headers ?? {}) },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export function Toast({ message, kind = "ok" }: { message: string | null; kind?: "ok" | "error" }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
        kind === "ok" ? "bg-ink text-white" : "bg-[#fdecea] text-coral"
      }`}
    >
      {message}
    </div>
  );
}

export function formatDateTime(s: string) {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
}
