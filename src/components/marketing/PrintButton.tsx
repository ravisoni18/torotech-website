"use client";

import { Printer } from "lucide-react";

export function PrintButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink ${className}`}
    >
      <Printer size={16} /> Print / Save as PDF
    </button>
  );
}
