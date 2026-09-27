"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import Link from "next/link";
import { Check, X, RotateCcw, Timer, Trophy } from "lucide-react";

type Card = { tag: string; text: string; answer: "approve" | "flag" };

const DECK: Card[] = [
  { tag: "SAP", text: "Sales order release: $400 — well under the $10k auto-approval threshold.", answer: "approve" },
  { tag: "SAP", text: "Sales order release: $85,000 — above the customer's credit limit.", answer: "flag" },
  { tag: "Testing", text: "Playwright run: checkout flow passed on Chromium, Firefox and WebKit.", answer: "approve" },
  { tag: "Testing", text: "Playwright run: checkout failed on WebKit only — screenshot shows a blank cart.", answer: "flag" },
  { tag: "Automation", text: "N8N workflow: lead synced from the web form to the CRM, every field matches.", answer: "approve" },
  { tag: "Automation", text: "N8N workflow: invoice amount extracted from a PDF reads $0.00 — likely a bad OCR pass.", answer: "flag" },
  { tag: "BI", text: "Dashboard alert: weekly active users up 4% — inside the normal range.", answer: "approve" },
  { tag: "BI", text: "Dashboard alert: revenue jumped 300% overnight with no campaign running.", answer: "flag" },
  { tag: "Mobile", text: "Crash report: same known issue already patched in the latest build.", answer: "approve" },
  { tag: "Mobile", text: "Crash report: brand new, hits checkout, and it's spiking this hour.", answer: "flag" },
  { tag: "Website", text: "Deploy: routine copy update on the marketing site, all checks green.", answer: "approve" },
  { tag: "Website", text: "Deploy: a schema migration touching the users table, no rollback plan on file.", answer: "flag" },
  { tag: "SAP", text: "Returns triage: 'damaged in transit', photo attached, credit under $200.", answer: "approve" },
  { tag: "SAP", text: "Returns triage: reason unclear, credit request for $18,000.", answer: "flag" },
];

function shuffled(arr: Card[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SECONDS = 20;
const BEST_KEY = "torotech_approval_game_best";

export function ApprovalGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [deck, setDeck] = useState<Card[]>(() => shuffled(DECK));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [exitDir, setExitDir] = useState<1 | -1>(1);
  const [best, setBest] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    try {
      const prev = Number(localStorage.getItem(BEST_KEY) ?? 0);
      if (score > prev) {
        localStorage.setItem(BEST_KEY, String(score));
        setBest(score);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const current = deck[index % deck.length];

  function start() {
    setDeck(shuffled(DECK));
    setIndex(0);
    setScore(0);
    setAnswered(0);
    setTimeLeft(ROUND_SECONDS);
    setFlash(null);
    setPhase("playing");
  }

  function choose(pick: "approve" | "flag") {
    if (phase !== "playing") return;
    const correct = pick === current.answer;
    setFlash(correct ? "correct" : "wrong");
    setExitDir(pick === "approve" ? 1 : -1);
    if (correct) setScore((s) => s + 1);
    setAnswered((n) => n + 1);
    window.setTimeout(() => {
      setFlash(null);
      setIndex((i) => i + 1);
    }, 220);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 90) choose("approve");
    else if (info.offset.x < -90) choose("flag");
  }

  const grade = useMemo(() => {
    if (answered === 0) return "";
    const pct = score / answered;
    if (pct >= 0.9) return "Approver-grade instincts.";
    if (pct >= 0.6) return "Solid calls — a real agent would earn auto-approval at this rate.";
    return "A few slipped through — exactly why every write-back gets a second pair of eyes.";
  }, [score, answered]);

  return (
    <div className="mx-auto max-w-md">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper p-6">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-tint text-ink">
                <Timer className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">You're the approver.</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {ROUND_SECONDS} seconds. An AI proposes an action — approve it, or flag it for a human. Drag the
                card, or use the buttons.
              </p>
              <button
                type="button"
                onClick={start}
                className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-deep hover:shadow-lg"
              >
                Start
              </button>
              {best !== null && (
                <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
                  <Trophy size={14} /> Your best: {best}
                </p>
              )}
            </motion.div>
          )}

          {phase === "playing" && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-soft">Score: {score}</span>
                <span className={`font-bold ${timeLeft <= 5 ? "text-[#c0392b]" : "text-ink"}`}>{timeLeft}s</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-mist">
                <motion.div
                  className="h-full rounded-full bg-teal"
                  initial={false}
                  animate={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
                  transition={{ ease: "linear", duration: 0.9 }}
                />
              </div>

              <div className="relative mt-6 h-[168px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={index}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.96, x: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      borderColor: flash === "correct" ? "#0f9d9d" : flash === "wrong" ? "#c0392b" : "var(--line)",
                    }}
                    exit={{ opacity: 0, x: exitDir * 260, rotate: exitDir * 12 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0 flex cursor-grab flex-col justify-between rounded-2xl border-2 bg-mist p-5 active:cursor-grabbing"
                  >
                    <div>
                      <span className="inline-flex rounded-full bg-paper px-2.5 py-1 text-xs font-bold text-teal-deep">
                        {current.tag}
                      </span>
                      <p className="mt-3 text-[15px] font-medium leading-snug text-ink">{current.text}</p>
                    </div>
                    <p className="text-center text-xs text-muted">← drag to flag · drag to approve →</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => choose("flag")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-semibold text-ink transition-colors hover:border-[#c0392b] hover:text-[#c0392b]"
                >
                  <X size={16} /> Flag
                </button>
                <button
                  type="button"
                  onClick={() => choose("approve")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 font-semibold text-white transition-colors hover:bg-teal-deep"
                >
                  <Check size={16} /> Approve
                </button>
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-4 text-center"
            >
              <div className="text-4xl font-extrabold text-ink">
                {score}
                <span className="text-lg font-semibold text-muted">/{answered}</span>
              </div>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-soft">{grade}</p>
              {best !== null && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                  <Trophy size={14} /> Best: {best}
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 font-semibold text-ink transition-colors hover:border-ink"
                >
                  <RotateCcw size={15} /> Play again
                </button>
                <Link
                  href="/services/sap-btp-development"
                  className="rounded-full bg-ink px-5 py-2.5 font-semibold text-white transition-colors hover:bg-teal-deep"
                >
                  See how real agents work
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
