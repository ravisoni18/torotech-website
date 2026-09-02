import Link from "next/link";
import { ArrowUpRight, Brain, Database, Globe, Layers, LayoutPanelTop, Sparkles, type LucideIcon } from "lucide-react";
import type { Content } from "@/lib/content";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  title,
  lede,
  action,
}: {
  title: string;
  lede?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold text-ink md:text-[2.5rem] md:leading-[1.1]">{title}</h2>
        {lede && <p className="mt-3 text-lg leading-relaxed text-ink-soft">{lede}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex items-center gap-1 font-semibold text-teal-deep">
          {action.label}
          <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}

const ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  layers: Layers,
  layout: LayoutPanelTop,
  globe: Globe,
  sparkles: Sparkles,
  database: Database,
};

export function ServiceIcon({ name, className = "" }: { name?: unknown; className?: string }) {
  const Icon = ICONS[String(name ?? "sparkles")] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

export function ServiceCard({ item, index }: { item: Content; index: number }) {
  const outcomes = Array.isArray(item.data.outcomes) ? (item.data.outcomes as string[]) : [];
  const tint = index % 2 === 0 ? "bg-mist" : "bg-teal-tint/60";
  return (
    <Link
      href={`/services/${item.slug}`}
      className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-paper p-7 transition-colors hover:border-teal"
    >
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tint} text-ink`}>
        <ServiceIcon name={item.data.icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-6 text-xl font-bold text-ink">{item.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.excerpt}</p>
      {outcomes.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-ink-soft">
          {outcomes.slice(0, 3).map((o) => (
            <li key={o} className="flex gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              {o}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-teal-deep">
        Learn more
        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function CaseStudyCard({ item }: { item: Content }) {
  const d = item.data as Record<string, string | undefined>;
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group grid gap-6 rounded-[var(--radius-card)] border border-line bg-paper p-7 transition-colors hover:border-teal md:grid-cols-[auto_1fr] md:gap-10"
    >
      <div className="flex flex-col justify-between md:w-40">
        <div>
          <div className="text-4xl font-extrabold tracking-tight text-ink">{d.metric_value}</div>
          <div className="mt-1 text-sm text-ink-soft">{d.metric_label}</div>
        </div>
        <div className="mt-6 text-xs text-muted">
          {d.industry}
          {d.duration ? ` · ${d.duration}` : ""}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold leading-snug text-ink group-hover:text-teal-deep">{item.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ item }: { item: Content }) {
  const d = item.data as Record<string, string | number | undefined>;
  return (
    <Link href={`/blog/${item.slug}`} className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-paper p-7 transition-colors hover:border-teal">
      <div className="text-sm text-muted">
        {formatDate(item.published_at)}
        {d.reading_time ? ` · ${d.reading_time} min read` : ""}
      </div>
      <h3 className="mt-3 text-xl font-bold leading-snug text-ink group-hover:text-teal-deep">{item.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {item.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Link>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink-soft">{children}</span>;
}

export function formatDate(s: string | null | undefined) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

export function CtaBand({
  title = "Tell us about the process that hurts.",
  body = "A 30-minute call is enough to tell whether an agent, an extension or a plain good Fiori app is the answer. No deck, no discovery fee.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mt-24">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] bg-ink px-8 py-14 text-white md:px-16 md:py-20">
          <svg className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 opacity-20" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#0f9d9d" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="#0f9d9d" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="#0f9d9d" strokeWidth="1.5" />
          </svg>
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-extrabold md:text-4xl">{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#c9d6e3]">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-deep">
                Book a call
              </Link>
              <Link href="/work" className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
