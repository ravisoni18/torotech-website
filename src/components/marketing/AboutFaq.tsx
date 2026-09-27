"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FAQS = [
  {
    q: "Do you work with ECC as well as S/4HANA?",
    a: "Yes. The read side (CDS views, OData) works on both. Write-backs on ECC go through BAPIs behind the same approval step we use on S/4HANA.",
  },
  {
    q: "How is pricing structured?",
    a: "Fixed scope for the first agent, extension or app — usually 1–2 days for something simple, longer for multi-system work. We quote after the process-mapping call, not before.",
  },
  {
    q: "Who owns the code afterward?",
    a: "You do. Everything ships as code in your own repository, on your own BTP subaccount or infrastructure. There's no platform fee and nothing that only we can maintain.",
  },
  {
    q: "Can you work alongside our existing SAP or dev team?",
    a: "That's the usual setup. We map the workflow with the people who run it today and build in the open — pull requests, not a black box that shows up finished.",
  },
  {
    q: "What if we're not on SAP at all?",
    a: "About half of what we build has nothing to do with SAP — websites, mobile apps, BI dashboards, test automation and workflow automation stand on their own.",
  },
];

export function AboutFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-ink">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 text-muted">
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
