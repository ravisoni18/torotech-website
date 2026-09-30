"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Cloud, FlaskConical, Gamepad2, RotateCcw, Server, ShieldCheck, Smartphone, Sparkles, Trophy } from "lucide-react";

type Fe = "ios" | "android" | "rn" | "flutter" | "pwa";
type Weights = Partial<Record<Fe, number>>;
type Choice = { id: string; label: string; hint: string; w: Weights };
type Question = { id: string; prompt: string; choices: Choice[] };
type Answers = Record<string, string>;

const FE_LABELS: Record<Fe, { name: string; stack: string }> = {
  ios: { name: "Native iOS", stack: "Swift · SwiftUI" },
  android: { name: "Native Android", stack: "Kotlin · Jetpack Compose" },
  rn: { name: "React Native", stack: "TypeScript · Expo" },
  flutter: { name: "Flutter", stack: "Dart · Impeller" },
  pwa: { name: "HTML5 / PWA", stack: "React · Capacitor" },
};
const FE_ORDER: Fe[] = ["rn", "flutter", "ios", "android", "pwa"];

const QUESTIONS: Question[] = [
  {
    id: "users",
    prompt: "Who will use the app?",
    choices: [
      { id: "consumer", label: "The public", hint: "Downloaded from the App Store and Google Play", w: { ios: 1, android: 1, rn: 2, flutter: 2, pwa: -1 } },
      { id: "employees", label: "Office staff", hint: "Approvals, dashboards, internal tools", w: { rn: 2, pwa: 3, flutter: 1 } },
      { id: "field", label: "Field or warehouse crews", hint: "Technicians, drivers, pickers", w: { rn: 2, android: 2, flutter: 1, pwa: -1 } },
      { id: "partners", label: "Customers or partners", hint: "Dealers, suppliers, B2B portals", w: { pwa: 3, rn: 2 } },
    ],
  },
  {
    id: "platforms",
    prompt: "Which platforms do you need?",
    choices: [
      { id: "ios", label: "iPhone and iPad only", hint: "An all-Apple fleet or audience", w: { ios: 5, rn: 1, android: -6 } },
      { id: "android", label: "Android only", hint: "Rugged devices or an Android fleet", w: { android: 5, rn: 1, ios: -6 } },
      { id: "both", label: "iOS and Android", hint: "The usual answer", w: { rn: 3, flutter: 3, ios: -1, android: -1 } },
      { id: "all", label: "iOS, Android and web", hint: "The same app in a browser too", w: { rn: 4, pwa: 3, flutter: 1, ios: -2, android: -2 } },
    ],
  },
  {
    id: "hardware",
    prompt: "How much of the phone does it use?",
    choices: [
      { id: "basic", label: "Mostly forms and lists", hint: "Screens, data and notifications", w: { pwa: 3, rn: 1, flutter: 1 } },
      { id: "standard", label: "Camera, GPS and push", hint: "Photos, barcodes, location", w: { rn: 2, flutter: 2 } },
      { id: "deep", label: "Deep device features", hint: "AR, Bluetooth, HealthKit, wearables", w: { ios: 3, android: 3, rn: 1, pwa: -4 } },
      { id: "rugged", label: "Enterprise scanners", hint: "Zebra or Honeywell hardware", w: { android: 4, rn: 1, ios: -3, pwa: -2 } },
    ],
  },
  {
    id: "offline",
    prompt: "What happens when there's no signal?",
    choices: [
      { id: "online", label: "It's always online", hint: "Office Wi-Fi, reliable coverage", w: { pwa: 2 } },
      { id: "sometimes", label: "Brief drop-outs", hint: "Elevators, parking garages", w: { rn: 1, flutter: 1 } },
      { id: "offline", label: "It works offline all day", hint: "Basements, rural routes, remote sites", w: { rn: 2, ios: 1, android: 1, flutter: 1, pwa: -3 } },
    ],
  },
  {
    id: "backend",
    prompt: "Where does the data live today?",
    choices: [
      { id: "sap", label: "SAP", hint: "S/4HANA, ECC or BTP", w: { pwa: 2, rn: 1 } },
      { id: "salesforce", label: "Salesforce", hint: "Sales, Service or Experience Cloud", w: { rn: 1, pwa: 1 } },
      { id: "existing", label: "Our own APIs or database", hint: "An in-house system or another ERP", w: {} },
      { id: "none", label: "Nowhere yet", hint: "We need a backend built", w: {} },
    ],
  },
  {
    id: "data",
    prompt: "How sensitive is the data?",
    choices: [
      { id: "public", label: "Public", hint: "Catalogue, content, marketing", w: {} },
      { id: "internal", label: "Company confidential", hint: "Orders, pricing, customers", w: {} },
      { id: "regulated", label: "Regulated", hint: "Health, finance or personal data", w: { ios: 1, android: 1, rn: 1, pwa: -1 } },
    ],
  },
  {
    id: "priority",
    prompt: "What matters most?",
    choices: [
      { id: "speed", label: "Speed to launch", hint: "Get an MVP in front of users fast", w: { pwa: 3, rn: 2, flutter: 1, ios: -2, android: -2 } },
      { id: "balanced", label: "Balance", hint: "Solid quality at a sensible cost", w: { rn: 2, flutter: 1 } },
      { id: "polish", label: "Best possible experience", hint: "Flagship UX, maximum performance", w: { ios: 3, android: 2, flutter: 2, rn: 1, pwa: -2 } },
    ],
  },
];

const BEST_KEY = "torotech_mobile_stack_runs";

function scores(answers: Answers): Record<Fe, number> {
  const s: Record<Fe, number> = { ios: 0, android: 0, rn: 0, flutter: 0, pwa: 0 };
  for (const q of QUESTIONS) {
    const c = q.choices.find((c) => c.id === answers[q.id]);
    if (!c) continue;
    for (const [k, v] of Object.entries(c.w)) s[k as Fe] += v ?? 0;
  }
  return s;
}

function fitPct(score: number) {
  return Math.max(4, Math.min(99, Math.round(((score + 6) / 24) * 100)));
}

type Stack = {
  fe: Fe;
  frontend: { name: string; stack: string; why: string };
  backend: string[];
  hosting: string[];
  security: string[];
  testing: string[];
  timeline: string;
  runnerUp: Fe;
};

function recommend(a: Answers): Stack {
  const s = scores(a);
  const ranked = [...FE_ORDER].sort((x, y) => s[y] - s[x]);
  const fe = ranked[0];
  const multi = a.platforms === "both" || a.platforms === "all";
  const nativeBoth = (fe === "ios" || fe === "android") && multi;

  const frontend = nativeBoth
    ? { name: "Native iOS + Android", stack: "Swift · SwiftUI  +  Kotlin · Compose", why: "Deep device features and flagship polish on both platforms justify two native codebases." }
    : {
        ...FE_LABELS[fe],
        why: {
          rn: "One TypeScript codebase for both stores, native modules where hardware needs them, and logic shared with the web.",
          flutter: "One codebase with pixel-identical, animation-rich UI on iOS and Android.",
          ios: "Your users are on Apple devices, and native Swift gets you every Apple API with no compromises.",
          android: "Native Kotlin gets you full access to scanner SDKs, kiosk mode and Android hardware.",
          pwa: "No installs, one web codebase and the fastest path to users. It also fits SAP Fiori and internal tools.",
        }[fe],
      };

  const offline = a.offline === "offline";
  const backend: string[] = [];
  if (a.backend === "sap") backend.push("SAP S/4HANA via OData", "CAP service on SAP BTP", "SAP Mobile Services");
  else if (a.backend === "salesforce") backend.push("Salesforce REST / GraphQL APIs", "Node.js BFF for payload shaping", "Platform Events → push");
  else if (a.backend === "existing") backend.push("Node.js (NestJS) BFF over your APIs", "OpenAPI contract + mock server");
  else if (a.priority === "speed") backend.push("Supabase (Postgres + auth + storage)", "Planned path to NestJS as rules grow");
  else backend.push("Node.js (NestJS) API", "PostgreSQL + Redis");
  if (offline) backend.push(fe === "pwa" ? "Service-worker cache + background sync" : "Delta-sync engine with conflict rules");

  const hosting: string[] = [];
  if (a.backend === "sap") hosting.push("SAP BTP Cloud Foundry (Canada region)");
  else if (a.backend === "salesforce") hosting.push("Heroku next to your Salesforce org");
  else if (a.data === "regulated") hosting.push("AWS ca-central-1 or Azure Canada Central", "Data stays in Canada");
  else if (a.backend === "none" && a.priority === "speed") hosting.push("Supabase + Vercel");
  else hosting.push("AWS or Azure containers (Terraform)");
  if (fe === "pwa") hosting.push("Installable PWA over HTTPS");
  else if (a.users === "employees" || a.users === "field") hosting.push("Private MDM distribution (Intune / Workspace ONE)");
  else hosting.push("App Store + Google Play, staged rollout");
  if (fe === "rn") hosting.push("EAS Build + over-the-air updates");
  else if (fe !== "pwa") hosting.push("Fastlane CI/CD");

  const security: string[] = ["OAuth 2.0 + PKCE, TLS 1.2+"];
  if (a.users === "consumer") security.push("Sign in with Apple / Google + biometrics");
  else if (a.backend === "sap") security.push("SSO via SAP IAS / Entra ID");
  else if (a.backend === "salesforce") security.push("SSO via Salesforce Identity");
  else security.push("SSO via Entra ID / Okta + biometrics");
  if (offline) security.push(fe === "pwa" ? "Encrypted IndexedDB, short-lived cache" : "SQLCipher-encrypted offline DB");
  if (a.users === "employees" || a.users === "field") security.push("MDM selective wipe + remote revoke");
  if (a.data === "regulated") security.push("Cert pinning, App Attest / Play Integrity", "OWASP MASVS L2 + independent pen test", "PIPEDA / PHIPA evidence pack");
  else if (a.data === "internal") security.push("OWASP MASVS L1, secure storage");

  const unit = { rn: "Jest + RN Testing Library", flutter: "flutter_test", ios: "XCTest", android: "JUnit", pwa: "Vitest" }[fe];
  const e2e = nativeBoth ? "XCUITest + Espresso" : { rn: "Maestro / Detox", flutter: "Maestro + integration_test", ios: "XCUITest", android: "Espresso", pwa: "Playwright" }[fe];
  const testing: string[] = [`${unit} (unit)`, `${e2e} (end-to-end)`];
  testing.push(fe === "pwa" ? "Cross-browser: Chromium, WebKit, Firefox" : "Real-device farm (BrowserStack)");
  if (a.backend === "sap" || a.backend === "salesforce") testing.push("Contract tests against sandbox");
  if (offline) testing.push("Airplane-mode and flaky-network drills");
  if (a.data === "regulated") testing.push("MobSF scans on every build");

  let weeks = a.priority === "speed" ? [6, 8] : a.priority === "polish" ? [16, 22] : [10, 14];
  if (nativeBoth) weeks = [weeks[0] + 4, weeks[1] + 6];
  if (a.backend === "none" && a.priority !== "speed") weeks = [weeks[0] + 2, weeks[1] + 2];
  const timeline = `${weeks[0]}–${weeks[1]} weeks to first release`;

  return { fe, frontend, backend, hosting, security, testing, timeline, runnerUp: ranked[1] };
}

export function MobileStackGame() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [runs, setRuns] = useState<number | null>(null);

  const done = step >= QUESTIONS.length;
  const s = useMemo(() => scores(answers), [answers]);
  const result = useMemo(() => (done ? recommend(answers) : null), [done, answers]);
  const leader = [...FE_ORDER].sort((x, y) => s[y] - s[x])[0];
  const anyAnswered = Object.keys(answers).length > 0;

  function choose(q: Question, c: Choice) {
    setAnswers((a) => ({ ...a, [q.id]: c.id }));
    const next = step + 1;
    setStep(next);
    if (next === QUESTIONS.length) {
      try {
        const n = Number(localStorage.getItem(BEST_KEY) ?? 0) + 1;
        localStorage.setItem(BEST_KEY, String(n));
        setRuns(n);
      } catch {
        /* ignore */
      }
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  const contactHref = result
    ? `/contact?interest=${encodeURIComponent("Mobile Apps Development")}&message=${encodeURIComponent(
        `Stack Builder result:\n• Frontend: ${result.frontend.name} (${result.frontend.stack})\n• Backend: ${result.backend.join(", ")}\n• Hosting: ${result.hosting.join(", ")}\n• Security: ${result.security.join(", ")}\n• Testing: ${result.testing.join(", ")}\n• Estimate: ${result.timeline}\n\nAbout our project: `,
      )}`
    : "/contact";

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-paper">
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-ink px-4 py-3 text-white sm:px-5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal text-white">
          <Gamepad2 size={15} />
        </span>
        <span className="text-sm font-bold">Mobile Stack Builder</span>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-teal-tint">7 questions</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs">
          <Sparkles size={12} className="text-amber-300" /> {Math.min(step, QUESTIONS.length)}/{QUESTIONS.length}
        </span>
        {runs !== null && runs > 0 && (
          <span className="hidden items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs sm:inline-flex">
            <Trophy size={12} className="text-amber-300" /> Stacks built: {runs}
          </span>
        )}
        {anyAnswered && (
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-teal-deep"
          >
            <RotateCcw size={12} /> Restart
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="h-1 bg-mist">
        <motion.div className="h-full bg-teal" animate={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_260px]">
        {/* Question / result */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      aria-label="Previous question"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-soft hover:border-teal hover:text-ink"
                    >
                      <ArrowLeft size={14} />
                    </button>
                  )}
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Question {step + 1}</p>
                </div>
                <p className="mt-2 text-xl font-bold text-ink sm:text-2xl">{q.prompt}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {q.choices.map((c) => {
                    const picked = answers[q.id] === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => choose(q, c)}
                        className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-teal hover:shadow-md ${
                          picked ? "border-teal bg-teal-tint" : "border-line bg-paper"
                        }`}
                      >
                        <p className="font-bold text-ink">{c.label}</p>
                        <p className="mt-1 text-sm text-ink-soft">{c.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              result && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Your recommended stack</p>
                  <div className="mt-3 rounded-2xl bg-ink p-5 text-white">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal">
                        <Smartphone size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xl font-extrabold">{result.frontend.name}</p>
                        <p className="font-mono text-xs text-teal-tint">{result.frontend.stack}</p>
                      </div>
                      <span className="ml-auto shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                        {fitPct(s[result.fe])}% fit
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">{result.frontend.why}</p>
                    <p className="mt-2 text-xs text-white/60">
                      Runner-up: {FE_LABELS[result.runnerUp].name} · {result.timeline}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ResultCard icon={Server} title="Backend" items={result.backend} />
                    <ResultCard icon={Cloud} title="Hosting & delivery" items={result.hosting} />
                    <ResultCard icon={ShieldCheck} title="Security" items={result.security} />
                    <ResultCard icon={FlaskConical} title="Testing" items={result.testing} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      href={contactHref}
                      className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-deep"
                    >
                      Send this stack to us
                    </Link>
                    <button type="button" onClick={restart} className="text-sm font-semibold text-teal-deep hover:underline">
                      Try different answers
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Live fit meter */}
        <div className="flex flex-col rounded-2xl border border-line bg-mist p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Live fit meter</p>
          <ul className="mt-3 space-y-3">
            {FE_ORDER.map((fe) => {
              const pct = anyAnswered ? fitPct(s[fe]) : 50;
              const lead = anyAnswered && fe === leader;
              return (
                <li key={fe}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className={`font-semibold ${lead ? "text-ink" : "text-ink-soft"}`}>{FE_LABELS[fe].name}</span>
                    <span className="tabular-nums text-muted">{anyAnswered ? `${pct}%` : "–"}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
                    <motion.div
                      className={`h-full rounded-full ${lead ? "bg-teal" : "bg-line"}`}
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 140, damping: 20 }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">
            {done
              ? "This is a starting point. We confirm it in a one-week discovery with your users and devices."
              : anyAnswered
                ? `Leading: ${FE_LABELS[leader].name}. Every answer re-weights the options.`
                : "Answer each question and watch the options re-rank."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ icon: Icon, title, items }: { icon: typeof Server; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-ink">
        <Icon size={15} className="text-teal-deep" /> {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-snug text-ink-soft">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
