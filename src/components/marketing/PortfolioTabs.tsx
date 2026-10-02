"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CvProjectGrid } from "./CvProjectGrid";
import type { Content } from "@/lib/content-types";

export type PortfolioGroup = {
  id: string;
  label: string;
  /** Shown when the group has no pieces yet — points somewhere real instead of an empty grid. */
  empty?: { text: string; href: string; cta: string };
};

export function PortfolioTabs({
  groups,
  items,
  initial,
}: {
  groups: PortfolioGroup[];
  items: { groups: string[]; content: Content }[];
  initial: string;
}) {
  const [active, setActive] = useState(groups.some((g) => g.id === initial) ? initial : groups[0].id);

  const select = (id: string) => {
    setActive(id);
    // Keep the tab in the URL so a filtered view can be shared, without adding history entries.
    const url = new URL(window.location.href);
    if (id === groups[0].id) url.searchParams.delete("tab");
    else url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  };

  const count = (id: string) => (id === groups[0].id ? items.length : items.filter((it) => it.groups.includes(id)).length);

  return (
    <div>
      <div role="tablist" aria-label="Portfolio categories" className="flex flex-wrap gap-1.5 rounded-2xl bg-mist p-1.5">
        {groups.map((g) => {
          const on = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={on}
              aria-controls={`panel-${g.id}`}
              onClick={() => select(g.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                on ? "bg-ink text-white shadow-sm" : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              {g.label}
              <span className={`text-xs font-bold ${on ? "text-teal-tint" : "text-teal-deep"}`}>{count(g.id)}</span>
            </button>
          );
        })}
      </div>

      {groups.map((g) => {
        const shown = g.id === groups[0].id ? items : items.filter((it) => it.groups.includes(g.id));
        return (
          <section key={g.id} id={`panel-${g.id}`} role="tabpanel" aria-labelledby={`tab-${g.id}`} hidden={g.id !== active} className="mt-8">
            {shown.length > 0 ? (
              <CvProjectGrid projects={shown.map((it) => it.content)} />
            ) : (
              g.empty && (
                <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-mist/50 px-6 py-14 text-center">
                  <p className="mx-auto max-w-md text-[15px] leading-relaxed text-ink-soft">{g.empty.text}</p>
                  <Link
                    href={g.empty.href}
                    className="group mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-deep"
                  >
                    {g.empty.cta}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )
            )}
          </section>
        );
      })}
    </div>
  );
}
