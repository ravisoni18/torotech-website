"use client";

import { useState } from "react";
import { Laptop, Smartphone } from "lucide-react";

const MODES = {
  desktop: {
    src: "/demos/sap-fiori-approval-desktop.html",
    height: "h-[680px] md:h-[780px]",
    bg: "bg-[#F2F2F2]",
    caption:
      "This is the approver's actual desk — a Fiori dashboard with budget context, vendor info and an outbox, not just a card.",
  },
  mobile: {
    src: "/demos/sap-fiori-approval-demo.html",
    height: "h-[700px] md:h-[780px]",
    bg: "bg-[#e2e8f0]",
    caption: "The same inbox on a phone — swipe or tap to approve or reject a purchase order on the go.",
  },
} as const;

type Mode = keyof typeof MODES;

export function SapApprovalDemo() {
  const [mode, setMode] = useState<Mode>("desktop");
  const active = MODES[mode];

  return (
    <div>
      <div className="inline-flex rounded-full border border-line bg-mist p-1">
        {(["desktop", "mobile"] as Mode[]).map((m) => {
          const Icon = m === "desktop" ? Laptop : Smartphone;
          const isActive = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                isActive ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon size={14} />
              {m === "desktop" ? "Desktop dashboard" : "Mobile app"}
            </button>
          );
        })}
      </div>

      <div className={`mt-4 overflow-hidden rounded-[28px] border border-line ${active.bg}`}>
        <iframe key={mode} src={active.src} title={`Fiori purchase-order approval — ${mode}`} className={`w-full ${active.height}`} loading="lazy" />
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        {active.caption}{" "}
        <a href={active.src} target="_blank" rel="noreferrer" className="font-semibold text-teal-deep hover:underline">
          Open full-screen ↗
        </a>
      </p>
    </div>
  );
}
