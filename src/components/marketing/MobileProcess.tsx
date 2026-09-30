"use client";

import { useState } from "react";
import Link from "next/link";
import { Cloud, FlaskConical, Server, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";

type Option = { name: string; stack: string; bestFor: string; tradeoff: string };
type Step = { title: string; body: string };
type Stage = {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  lede: string;
  optionsTitle: string;
  options: Option[];
  steps: Step[];
  deliverables: string[];
  link?: { href: string; label: string };
};

const STAGES: Stage[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: Smartphone,
    title: "Frontend: native, cross-platform or HTML5",
    lede: "There's no single right way to build a mobile app. We choose the approach from your users, the device features you need and how long the app has to last. We don't pick it from habit.",
    optionsTitle: "The approaches we build with",
    options: [
      {
        name: "Native iOS",
        stack: "Swift · SwiftUI · Combine",
        bestFor: "Premium consumer apps, and anything that relies on HealthKit, ARKit, CarPlay, widgets or Apple Watch.",
        tradeoff: "You'll need a separate Android codebase and team.",
      },
      {
        name: "Native Android",
        stack: "Kotlin · Jetpack Compose · Coroutines",
        bestFor: "Rugged Zebra and Honeywell scanners, kiosk mode, and deep Android or hardware integrations.",
        tradeoff: "You'll need a separate iOS codebase and team.",
      },
      {
        name: "React Native",
        stack: "TypeScript · Expo · New Architecture",
        bestFor: "One team shipping to both stores with 85–95% shared code. It can also share logic with a React web app.",
        tradeoff: "Some edge-case hardware needs a small native module.",
      },
      {
        name: "Flutter",
        stack: "Dart · Impeller · Riverpod",
        bestFor: "Brand-heavy, pixel-identical UI and rich animation across iOS and Android.",
        tradeoff: "Dart is a separate skill set, and less code is shared with the web.",
      },
      {
        name: "HTML5 / PWA / Capacitor",
        stack: "React · Angular · SAPUI5 · Ionic",
        bestFor: "Internal tools, Fiori apps in SAP Mobile Start, and apps nobody should have to install. It's the fastest and cheapest route.",
        tradeoff: "iOS limits background work, Bluetooth and some device APIs.",
      },
    ],
    steps: [
      { title: "Discovery and platform decision", body: "We interview users, list the devices and OS versions in the field, and map every hardware feature the app needs. The output is a written decision record that says why we chose native, cross-platform or web." },
      { title: "UX and a clickable prototype", body: "We build Figma flows that follow Apple's Human Interface Guidelines and Material 3. Real users test them before any code is written. Accessibility (Dynamic Type, VoiceOver, TalkBack) and English/French copy are designed in from the start." },
      { title: "Design system and app shell", body: "Navigation, theming, dark mode, localisation, error states and analytics hooks come first. That way every later feature plugs into a consistent frame." },
      { title: "Feature sprints", body: "We work in two-week sprints. Every sprint produces a TestFlight and Play Console internal build, so stakeholders tap through real software, not status reports." },
      { title: "Offline data and device features", body: "We add a local database (SQLite, WatermelonDB or Realm), background sync, camera, barcode and NFC scanning, GPS, biometrics, push notifications and deep links." },
      { title: "Performance hardening", body: "Our targets are cold start under 2 seconds, smooth 60/120 fps scrolling, a small bundle and a crash-free session rate above 99.5%. Each one is measured on low-end devices, not just flagships." },
    ],
    deliverables: ["Platform decision record", "Figma prototype", "Design system", "iOS + Android builds each sprint", "Source code you own"],
  },
  {
    id: "backend",
    label: "Backend",
    icon: Server,
    title: "Backend: we work with the systems you already run",
    lede: "The app is only as good as the data behind it. We connect to the systems you already run, whether that's SAP, Salesforce or your own APIs, or we build a new backend when you need one.",
    optionsTitle: "Systems we connect to",
    options: [
      {
        name: "SAP S/4HANA & ECC",
        stack: "OData · CAP on BTP · SAP Mobile Services · Event Mesh",
        bestFor: "Field service, inventory, approvals, maintenance orders and goods receipts, all posted straight into SAP.",
        tradeoff: "It needs clean-core discipline, and we build with it from day one.",
      },
      {
        name: "Salesforce",
        stack: "REST / GraphQL APIs · Mobile SDK · Platform Events",
        bestFor: "Sales reps, service agents and partner portals that need CRM data offline and in real time.",
        tradeoff: "API limits need careful caching and batching.",
      },
      {
        name: "Microsoft & other ERPs",
        stack: "Dynamics 365 · Dataverse · Graph · NetSuite · Oracle",
        bestFor: "Organisations standardised on Microsoft 365 or another ERP.",
        tradeoff: "Auth and data models differ by vendor, and we abstract that away.",
      },
      {
        name: "Custom Node.js backend",
        stack: "Node.js · NestJS / Express · PostgreSQL · Redis",
        bestFor: "New products, or apps that combine several systems into one clean API.",
        tradeoff: "You own and run it, and we set up the ops so that's easy.",
      },
      {
        name: "Backend-as-a-Service",
        stack: "Firebase · Supabase · AWS Amplify",
        bestFor: "MVPs and pilots that need auth, a database and push notifications in days.",
        tradeoff: "Complex business rules eventually outgrow it, so we plan the exit early.",
      },
    ],
    steps: [
      { title: "Map the systems of record", body: "We work out which system owns each piece of data (orders, customers, stock, assets) and who is allowed to change it. That tells us where the app reads from and writes to." },
      { title: "Contract-first API design", body: "We define an OpenAPI or GraphQL schema and stand up a mock server in week one. The mobile team starts building immediately instead of waiting on the backend." },
      { title: "Backend-for-frontend (BFF) layer", body: "A thin Node.js layer sits between the app and your ERP or CRM. It trims payloads for mobile networks, merges calls to several systems and hides SAP or Salesforce complexity from the app." },
      { title: "Sync and conflict resolution", body: "We use delta sync, idempotency keys and an outbound queue, so a form submitted offline is posted exactly once. Conflicts are resolved by rules the business agrees on, not by whichever write arrived last." },
      { title: "Events and push notifications", body: "SAP Event Mesh, Salesforce Platform Events or webhooks trigger APNs and FCM notifications, so users hear about new work orders or approvals in seconds." },
      { title: "Observability", body: "Structured logs, traces and dashboards follow every request from phone to ERP and back, so support can answer \"where did my order go?\" in minutes." },
    ],
    deliverables: ["System and data-flow map", "OpenAPI / GraphQL contract", "BFF service", "Sync engine", "Integration monitoring"],
    link: { href: "/services/sap-btp-development", label: "More on our SAP BTP work →" },
  },
  {
    id: "hosting",
    label: "Hosting",
    icon: Cloud,
    title: "Hosting and distribution",
    lede: "There are two sides to this: where the backend runs, and how the app reaches your users' phones. We automate both, so releasing becomes routine.",
    optionsTitle: "Where it can run",
    options: [
      {
        name: "AWS / Azure / Google Cloud",
        stack: "ECS / AKS / Cloud Run · RDS · S3 · CloudFront",
        bestFor: "Most custom backends. Canadian regions (AWS Montréal, Azure Toronto) keep data in Canada.",
        tradeoff: "It needs infrastructure-as-code discipline, and we provide that.",
      },
      {
        name: "SAP BTP",
        stack: "Cloud Foundry · Kyma · SAP Mobile Services",
        bestFor: "Apps that extend SAP, with SAP identity, connectivity and app lifecycle built in.",
        tradeoff: "BTP credits and entitlements need planning up front.",
      },
      {
        name: "Heroku / Salesforce",
        stack: "Heroku · Hyperforce · Salesforce Functions",
        bestFor: "Salesforce-centric apps that should live next to the CRM.",
        tradeoff: "It costs more per unit of compute at scale.",
      },
      {
        name: "Your data centre",
        stack: "Docker · Kubernetes · on-prem VMs",
        bestFor: "Regulated or air-gapped environments where data can't leave your network.",
        tradeoff: "Your team runs the hardware, and we hand over runbooks.",
      },
      {
        name: "App distribution",
        stack: "App Store · Google Play · Intune / Workspace ONE · Apple Business Manager",
        bestFor: "Public store releases, private enterprise apps pushed through MDM, or install-free PWAs.",
        tradeoff: "Store review adds 1–3 days per release, so we plan around it.",
      },
    ],
    steps: [
      { title: "Infrastructure as code", body: "Terraform or Bicep defines every environment. Dev, staging and production are identical and reproducible, and changes go through code review." },
      { title: "CI/CD for the app", body: "GitHub Actions with Fastlane or Expo EAS builds, signs and versions every commit. Certificates and provisioning profiles are managed centrally, not on someone's laptop." },
      { title: "Over-the-air updates", body: "JavaScript and asset fixes go out through EAS Update in minutes, without waiting on store review. Native changes still ship as full releases." },
      { title: "Store submission", body: "We handle listings, screenshots, privacy nutrition labels, the data safety form and review back-and-forth. For internal apps we set up MDM deployment instead." },
      { title: "Staged rollout", body: "Releases go to 1%, then 10%, then 50%, then everyone, with automatic halts if the crash rate or error budget is breached." },
      { title: "Monitoring and scaling", body: "Sentry or Crashlytics catch crashes and APM tracks performance. Autoscaling, backups and cost alerts are set up before launch day." },
    ],
    deliverables: ["Terraform / Bicep repo", "CI/CD pipelines", "Store listings", "MDM or store distribution", "Runbooks and dashboards"],
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldCheck,
    title: "Security by design, mapped to OWASP MASVS",
    lede: "Phones get lost, networks get intercepted and apps get decompiled. We design for all three, and we map our controls to the OWASP Mobile Application Security Verification Standard (MASVS).",
    optionsTitle: "Security controls in every build",
    options: [
      {
        name: "Identity and SSO",
        stack: "OAuth 2.0 + PKCE · OIDC · Entra ID · Okta · SAP IAS",
        bestFor: "Employees sign in with their existing work account. Face ID and fingerprint unlock the session.",
        tradeoff: "The app never stores passwords.",
      },
      {
        name: "Data at rest",
        stack: "iOS Keychain · Android Keystore · SQLCipher",
        bestFor: "Tokens live in hardware-backed storage, and the offline database is encrypted.",
        tradeoff: "A lost phone doesn't leak data.",
      },
      {
        name: "Data in transit",
        stack: "TLS 1.2+ · certificate pinning · signed requests",
        bestFor: "Stops man-in-the-middle attacks on hotel or airport Wi-Fi.",
        tradeoff: "Pin rotation is automated so certificate changes don't break the app.",
      },
      {
        name: "App hardening",
        stack: "App Attest · Play Integrity · obfuscation · root/jailbreak checks",
        bestFor: "Blocks tampered apps, emulators and scripted abuse from reaching your API.",
        tradeoff: "The checks are tuned so real users aren't locked out.",
      },
      {
        name: "Compliance",
        stack: "PIPEDA · PHIPA · SOC 2 · HIPAA-ready",
        bestFor: "Canadian privacy law, health data and enterprise security questionnaires.",
        tradeoff: "The evidence is collected as we build, not scrambled for at audit time.",
      },
    ],
    steps: [
      { title: "Threat model", body: "In the first sprint we map what an attacker would want, how they'd get it and what it would cost you. That drives which MASVS level (L1 or L2) we target." },
      { title: "Identity and least privilege", body: "Short-lived tokens, refresh-token rotation and roles that match your SAP, Salesforce or Entra ID roles. Users only see the data their job requires." },
      { title: "Secure storage and transport", body: "Keychain and Keystore for secrets, an encrypted local database, pinned TLS, and no sensitive data in logs, screenshots or the clipboard." },
      { title: "Secure SDLC", body: "Dependency scanning, secret scanning, SAST and MobSF static analysis run on every pull request. A vulnerable library blocks the merge." },
      { title: "Penetration test", body: "Before launch, an independent mobile and API penetration test is run against the production build. Findings are fixed and retested." },
      { title: "Remote kill switch and wipe", body: "A forced-upgrade flag, remote session revocation and MDM selective wipe mean a compromised version or device can be shut off in minutes." },
    ],
    deliverables: ["Threat model", "MASVS checklist", "Pen-test report", "Privacy impact assessment", "Incident runbook"],
  },
  {
    id: "testing",
    label: "Testing",
    icon: FlaskConical,
    title: "Testing on real devices, automated in CI",
    lede: "Mobile bugs hide in the gap between the simulator and a three-year-old Android phone on a weak connection. We automate the test pyramid and run it on real devices.",
    optionsTitle: "The test layers",
    options: [
      {
        name: "Unit and component",
        stack: "Jest · React Native Testing Library · XCTest · JUnit",
        bestFor: "Business rules, sync logic and UI components, checked in seconds on every commit.",
        tradeoff: "It's the fastest feedback, but it can't catch device issues on its own.",
      },
      {
        name: "API contract",
        stack: "Pact · OpenAPI schema tests · Postman / Newman",
        bestFor: "Catches the backend or ERP changing shape before the app breaks in production.",
        tradeoff: "Both teams have to keep the contract up to date.",
      },
      {
        name: "End-to-end UI",
        stack: "Maestro · Detox · XCUITest · Espresso · Playwright (PWA)",
        bestFor: "Real user journeys: log in, scan, go offline, submit, sync, done.",
        tradeoff: "These are slower, so we keep them focused on the critical paths.",
      },
      {
        name: "Real-device farm",
        stack: "BrowserStack · Firebase Test Lab · AWS Device Farm",
        bestFor: "Dozens of real phones, tablets and OS versions, including your field hardware.",
        tradeoff: "It has a cost, so it runs nightly and before releases.",
      },
      {
        name: "Non-functional",
        stack: "Performance profiling · VoiceOver / TalkBack · MobSF · network throttling",
        bestFor: "Speed, accessibility (WCAG 2.2 AA), security and behaviour on 3G or no signal.",
        tradeoff: "Most teams skip this layer. We don't.",
      },
    ],
    steps: [
      { title: "Test strategy in sprint 0", body: "We agree on the critical journeys, the target device matrix and quality gates such as coverage, crash-free rate and performance budgets, before feature work starts." },
      { title: "Tests written with the feature", body: "Every story ships with its unit and component tests, reviewed in the same pull request. \"Done\" means tested." },
      { title: "Automated E2E on every build", body: "Maestro or Detox flows run in CI on emulators for every pull request, and on the real-device farm nightly." },
      { title: "Offline and bad-network drills", body: "We script airplane mode, flaky 3G and mid-sync app kills to prove that no data is lost or duplicated." },
      { title: "Beta programme", body: "TestFlight and Play testing tracks put the app in real users' hands, with in-app feedback and screenshot capture." },
      { title: "Release gates", body: "A release only moves forward if tests are green, the crash-free rate holds and the performance budget is met, and we keep watching during staged rollout." },
    ],
    deliverables: ["Test strategy", "Automated test suites", "Device matrix", "CI quality gates", "Release sign-off report"],
    link: { href: "/services/automation-testing-playwright", label: "More on our test automation →" },
  },
];

export function MobileProcess() {
  const [active, setActive] = useState(STAGES[0].id);

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-ink">How we build your app</h2>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
        We work in five stages with one senior team. Each stage ends with something you can see, test and keep.
      </p>

      <div role="tablist" aria-label="Mobile app delivery stages" className="mt-8 grid grid-cols-5 gap-1.5 rounded-2xl bg-mist p-1.5">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={on}
              aria-controls={`panel-${s.id}`}
              onClick={() => setActive(s.id)}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-center transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:px-3 ${
                on ? "bg-ink text-white shadow-sm" : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              <span className={`text-[10px] font-bold ${on ? "text-teal-tint" : "text-teal-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
              <Icon size={16} className="hidden shrink-0 sm:block" aria-hidden="true" />
              <span className="text-[11px] font-semibold sm:text-sm">{s.label}</span>
            </button>
          );
        })}
      </div>

      {STAGES.map((s) => (
        <section
          key={s.id}
          id={`panel-${s.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${s.id}`}
          hidden={s.id !== active}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold text-ink">{s.title}</h3>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink-soft">{s.lede}</p>

          <h4 className="mt-8 text-sm font-bold uppercase tracking-wide text-muted">{s.optionsTitle}</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {s.options.map((o) => (
              <div key={o.name} className="rounded-[var(--radius-card)] border border-line bg-paper p-5 transition-colors hover:border-teal">
                <p className="text-lg font-bold text-ink">{o.name}</p>
                <p className="mt-1 font-mono text-xs text-teal-deep">{o.stack}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{o.bestFor}</p>
                <p className="mt-2 text-sm text-muted">{o.tradeoff}</p>
              </div>
            ))}
          </div>

          <h4 className="mt-10 text-sm font-bold uppercase tracking-wide text-muted">How it happens</h4>
          <ol className="mt-4 space-y-0">
            {s.steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < s.steps.length - 1 && <span className="absolute left-[17px] top-9 bottom-0 w-px bg-line" aria-hidden="true" />}
                <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-tint text-sm font-bold text-teal-deep">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-ink">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-[var(--radius-card)] bg-mist p-5">
            <p className="text-sm font-bold text-ink">What you get from this stage</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.deliverables.map((d) => (
                <span key={d} className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft">
                  {d}
                </span>
              ))}
            </div>
            {s.link && (
              <Link href={s.link.href} className="mt-4 inline-block text-sm font-semibold text-teal-deep hover:underline">
                {s.link.label}
              </Link>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
