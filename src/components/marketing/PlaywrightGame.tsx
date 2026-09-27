"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bug, CheckCircle2, ImageOff, Play, ShieldAlert, Timer, Trophy, XCircle } from "lucide-react";

type Finding = {
  id: string;
  label: string;
  assertion: string;
};

const FINDINGS: Finding[] = [
  { id: "overflow-button", label: "Submit button text overflows its container", assertion: "expect(button).not.toHaveCSS('text-overflow', 'clip')" },
  { id: "broken-avatar", label: "Profile avatar fails to load", assertion: "expect(img).toHaveJSProperty('naturalWidth', 0)" },
  { id: "price-mismatch", label: "Order total doesn't match item price × qty", assertion: "expect(total).toEqual(price.times(qty))" },
  { id: "fake-toggle", label: "Password toggle isn't wired to anything", assertion: "expect(toggle).toHaveAttribute('aria-pressed')" },
  { id: "low-contrast", label: "Continue button fails colour-contrast", assertion: "expect(page).toPassAxeCheck('color-contrast')" },
  { id: "fake-disabled", label: "Apply button looks disabled but isn't", assertion: "expect(button).toBeDisabled()" },
];

const ROUND_SECONDS = 35;
const BEST_KEY = "torotech_playwright_game_best";

export function PlaywrightGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [found, setFound] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(BEST_KEY);
      if (v) setBest(Number(v));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    try {
      const prev = Number(localStorage.getItem(BEST_KEY) ?? 0);
      if (found.size > prev) {
        localStorage.setItem(BEST_KEY, String(found.size));
        setBest(found.size);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    setFound(new Set());
    setTimeLeft(ROUND_SECONDS);
    setPhase("playing");
  }

  function catchBug(id: string) {
    if (phase !== "playing" || found.has(id)) return;
    setFound((f) => new Set(f).add(id));
  }

  const allCaught = found.size === FINDINGS.length;
  useEffect(() => {
    if (phase === "playing" && allCaught) setPhase("done");
  }, [allCaught, phase]);

  const grade =
    found.size === FINDINGS.length
      ? "Full coverage — ship it."
      : found.size >= 4
        ? "Close — one slipped through code review."
        : "This is exactly why we automate — a quick skim misses these.";

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-paper">
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-ink px-4 py-3 text-white sm:px-5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal text-white">
          <Bug size={15} />
        </span>
        <span className="text-sm font-bold">Playwright QA Challenge</span>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-teal-tint">Bug hunt</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs">
          <Timer size={12} /> {phase === "playing" ? `${timeLeft}s` : `${ROUND_SECONDS}s`}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs">
          <Trophy size={12} className="text-amber-300" /> {found.size}/{FINDINGS.length}
        </span>
        {phase !== "playing" ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-teal-deep"
          >
            <Play size={12} fill="currentColor" /> {phase === "idle" ? "Start" : "Play again"}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal/20 px-3.5 py-1.5 text-xs font-bold text-teal-tint">
            Hunting…
          </span>
        )}
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_280px] sm:p-5">
        {/* Mock browser window under test */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-line bg-mist px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-muted">
              https://acme-app.test/checkout
            </span>
            <span className="hidden shrink-0 items-center gap-1 text-[10px] text-muted sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> recording: chromium · firefox · webkit
            </span>
          </div>

          <div className="relative p-4 text-[#1f2937] sm:p-6">
            {/* Header row with broken avatar */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Checkout</p>
              <div className="relative inline-block">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                  <ImageOff size={15} />
                </div>
                <BugHotspot id="broken-avatar" found={found.has("broken-avatar")} onCatch={catchBug} label="Broken avatar" />
              </div>
            </div>

            {/* Order summary card with overlapping badge + price mismatch */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="relative flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">Wireless Mechanical Keyboard × 1</p>
                <div className="relative -mt-5 -mr-2 shrink-0">
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">Free shipping</span>
                  <BugHotspot id="price-mismatch" found={found.has("price-mismatch")} onCatch={catchBug} label="Overlapping badge" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-500">Item price: $19.99</span>
                <span className="font-bold text-slate-800">Total: $29.99</span>
              </div>
            </div>

            {/* Password field with fake toggle */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-500">Password</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
                <span className="flex-1 text-sm text-slate-400">••••••••••</span>
                <div className="relative inline-block">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-400">
                    👁
                  </span>
                  <BugHotspot id="fake-toggle" found={found.has("fake-toggle")} onCatch={catchBug} label="Fake toggle" />
                </div>
              </div>
            </div>

            {/* Coupon row with fake-disabled button */}
            <div className="mt-4 flex gap-2">
              <input
                readOnly
                value="SAVE10"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600"
              />
              <div className="relative inline-block">
                <button
                  type="button"
                  disabled={false}
                  className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-400"
                >
                  Apply
                </button>
                <BugHotspot id="fake-disabled" found={found.has("fake-disabled")} onCatch={catchBug} label="Fake disabled" />
              </div>
            </div>

            {/* Ghost low-contrast continue + overflowing submit */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative inline-block">
                <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300">
                  Continue shopping
                </button>
                <BugHotspot id="low-contrast" found={found.has("low-contrast")} onCatch={catchBug} label="Low contrast" />
              </div>
              <div className="relative inline-block max-w-[180px]">
                <button
                  type="button"
                  className="w-full overflow-hidden whitespace-nowrap rounded-lg bg-teal px-4 py-2 text-sm font-bold text-white"
                  style={{ textOverflow: "clip" }}
                >
                  Complete Purchase And Continue To Confirmation
                </button>
                <BugHotspot id="overflow-button" found={found.has("overflow-button")} onCatch={catchBug} label="Overflowing button" />
              </div>
            </div>
          </div>
        </div>

        {/* Live test report */}
        <div className="flex flex-col rounded-2xl border border-line bg-mist p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Test report</p>
          <ul className="mt-3 flex-1 space-y-2">
            {FINDINGS.map((f) => {
              const isFound = found.has(f.id);
              const revealed = phase === "done";
              return (
                <li key={f.id} className={`rounded-lg border p-2.5 text-xs transition-colors ${isFound ? "border-emerald-300 bg-emerald-50" : revealed ? "border-rose-300 bg-rose-50" : "border-line bg-paper"}`}>
                  <div className="flex items-start gap-1.5">
                    {isFound ? (
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                    ) : revealed ? (
                      <XCircle size={13} className="mt-0.5 shrink-0 text-rose-500" />
                    ) : (
                      <ShieldAlert size={13} className="mt-0.5 shrink-0 text-muted" />
                    )}
                    <span className={isFound ? "text-emerald-800" : revealed ? "text-rose-700" : "text-ink-soft"}>
                      {isFound || revealed ? f.label : "Pending…"}
                    </span>
                  </div>
                  {(isFound || revealed) && (
                    <code className="mt-1.5 block truncate font-mono text-[10px] text-muted">{f.assertion}</code>
                  )}
                </li>
              );
            })}
          </ul>

          <AnimatePresence>
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg bg-ink p-3 text-center text-xs text-white"
              >
                <p className="font-bold">{grade}</p>
                {best !== null && <p className="mt-1 text-white/70">Best: {best}/{FINDINGS.length}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BugHotspot({ id, found, onCatch, label }: { id: string; found: boolean; onCatch: (id: string) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onCatch(id)}
      aria-label={`Flag: ${label}`}
      disabled={found}
      className={`absolute -inset-1.5 rounded-md transition-all ${
        found ? "border-2 border-emerald-500 bg-emerald-500/10" : "border-2 border-dashed border-transparent hover:border-rose-400 hover:bg-rose-400/10"
      }`}
    >
      {found && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 size={11} />
        </span>
      )}
    </button>
  );
}
