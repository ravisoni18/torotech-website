"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

type Screen = { src: string; caption: string; position?: string };

// Ordered innermost → outermost on each side. Our own demo screens (screen-*) are mixed with
// Unsplash photography (free for commercial use) and SAP product imagery already used on the BTP page.
const LEFT: Screen[] = [
  { src: "/images/hero/screen-mobile-swipe-demo.jpg", caption: "Swipe-to-buy storefront" },
  { src: "/images/hero/analytics-dashboard.webp", caption: "Traffic & retention" },
  { src: "/images/sap/sap-basis.webp", caption: "SAP BTP landscape", position: "60% 50%" },
  { src: "/images/hero/websites-devices.webp", caption: "Websites that convert", position: "30% 50%" },
  { src: "/images/hero/screen-sap-fiori-approval-desktop.jpg", caption: "Fiori approval inbox", position: "38% 0" },
  { src: "/images/hero/ai-agents.webp", caption: "AI agents, with an approval step" },
  { src: "/images/hero/screen-bi-desktop-dashboard.jpg", caption: "Global sales dashboard", position: "0 0" },
  { src: "/images/hero/mobile-app.webp", caption: "iOS + Android from one codebase" },
];

const RIGHT: Screen[] = [
  { src: "/images/sap/sap-integration-suite.jpg", caption: "Integration Suite APIs" },
  { src: "/images/hero/web-mobile.webp", caption: "Web + mobile, one design system" },
  { src: "/images/hero/screen-toro-ai-workspace.jpg", caption: "Enterprise AI workspace", position: "0 0" },
  { src: "/images/hero/bi-laptop.webp", caption: "BI you can trust" },
  { src: "/images/sap/sap-fiori-ui5.png", caption: "SAP Fiori launchpad", position: "0 50%" },
  { src: "/images/hero/ux-wireframe.webp", caption: "Wireframe to shipped app" },
  { src: "/images/hero/screen-sap-fiori-approval-demo.jpg", caption: "Approvals on the go" },
  { src: "/images/hero/ai-network.webp", caption: "Models on your own data" },
];

// Per slot (inner → outer): horizontal offset as a fraction of half the viewport, scale, and tilt.
// Small, steep cards near the centre and big, flatter cards at the edges read as a curved wall.
const SLOTS = [
  { k: 0.09, s: 0.26, r: 34 },
  { k: 0.16, s: 0.33, r: 32 },
  { k: 0.25, s: 0.42, r: 30 },
  { k: 0.36, s: 0.53, r: 28 },
  { k: 0.49, s: 0.67, r: 26 },
  { k: 0.64, s: 0.84, r: 24 },
  { k: 0.81, s: 1.04, r: 22 },
  { k: 1.0, s: 1.26, r: 20 },
];

function ArcCard({ screen, slot, side, index }: { screen: Screen; slot: number; side: -1 | 1; index: number }) {
  const { k, s, r } = SLOTS[slot];
  return (
    <div
      className="absolute left-1/2 top-1/2 w-[var(--card-w)]"
      style={{
        aspectRatio: "9 / 16",
        marginTop: "calc(var(--card-w) * -16 / 18)",
        zIndex: slot,
        transform: `translateX(calc(-50% + ${side * k} * 50vw * var(--spread))) scale(${s}) perspective(900px) rotateY(${-side * r}deg)`,
      }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 + (7 - slot) * 0.06 + index * 0.01, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="arc-float h-full w-full" style={{ animationDelay: `${-(slot * 0.9 + (side > 0 ? 3.5 : 0))}s` }}>
          <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-mist shadow-[0_30px_60px_-20px_rgba(11,31,58,0.35)] ring-1 ring-black/5">
            <Image
              src={screen.src}
              alt=""
              fill
              sizes="(max-width: 768px) 45vw, 380px"
              className="object-cover"
              style={{ objectPosition: screen.position ?? "50% 50%" }}
            />
            <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            <p className="absolute inset-x-4 top-[11%] text-center text-[19px] font-extrabold leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
              {screen.caption}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Phones and tablets get a scrolling strip instead of the wall — the arc needs laptop width to read as a curve.
const REEL: Screen[] = LEFT.flatMap((screen, i) => [screen, RIGHT[i]]);

function MobileReel() {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 -mx-5 mt-6 w-screen overflow-hidden pb-10 pt-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] lg:hidden"
    >
      <div className="reel-track gap-3.5 px-2">
        {[...REEL, ...REEL].map((screen, i) => (
          <div
            key={i}
            className="relative aspect-[9/16] w-[148px] shrink-0 overflow-hidden rounded-[20px] bg-mist shadow-[0_18px_36px_-16px_rgba(11,31,58,0.4)] ring-1 ring-black/5"
            style={{ transform: `rotate(${i % 2 ? 2 : -2}deg) translateY(${i % 2 ? 10 : 0}px)` }}
          >
            <Image src={screen.src} alt="" fill sizes="150px" className="object-cover" style={{ objectPosition: screen.position ?? "50% 50%" }} />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
            <p className="absolute inset-x-3 top-3 text-center text-[14px] font-extrabold leading-tight text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
              {screen.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Homepage hero: a curved wall of real screens (apps, dashboards, AI, SAP) around the headline. Spreads and fades out as you scroll. */
export function HeroArc() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const spread = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.45]);
  const wallOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[radial-gradient(120%_70%_at_50%_100%,var(--teal-tint)_0%,var(--paper)_60%)]"
    >
      {/* Dot texture fading in towards the bottom, like a floor under the wall */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40 [mask-image:linear-gradient(to_bottom,transparent_35%,black)]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="arc-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.25" cy="1.25" r="1.25" fill="var(--line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arc-dots)" />
      </svg>

      <div className="relative flex flex-col items-center px-5 pb-12 pt-10 md:pt-14 lg:min-h-[760px] lg:min-h-[calc(100svh-4rem)] lg:justify-between">
        {/* The wall */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[48%] h-0 [--card-w:clamp(110px,13.5vw,270px)] max-lg:hidden"
          style={{ "--spread": spread, opacity: wallOpacity } as unknown as React.CSSProperties}
        >
          {LEFT.map((screen, i) => (
            <ArcCard key={screen.src} screen={screen} slot={i} side={-1} index={i} />
          ))}
          {RIGHT.map((screen, i) => (
            <ArcCard key={screen.src} screen={screen} slot={i} side={1} index={i} />
          ))}
        </motion.div>

        <motion.h1
          style={{ y: copyY }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 text-center text-[2.7rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl md:text-[5.2rem]"
        >
          Software that ships,
          <span className="mt-1 block font-serif text-[1.12em] font-normal italic tracking-[-0.02em] text-teal-deep">
            from website to SAP
          </span>
        </motion.h1>

        <MobileReel />

        <motion.div
          style={{ y: copyY }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mt-8 flex w-full max-w-[34rem] flex-col items-center text-center lg:mt-0"
        >
          <p className="text-[17px] leading-relaxed text-ink-soft md:text-lg lg:rounded-2xl lg:bg-paper/75 lg:px-3 lg:py-1 lg:backdrop-blur-sm xl:bg-transparent xl:backdrop-blur-none">
            Websites and mobile apps with AI built in, BI dashboards, SAP BTP development and integration
            <span className="max-sm:hidden">, automated testing and workflow automation</span> — each scoped to one
            process and one number you can check.
          </p>

          <form
            action="/contact"
            className="mt-7 flex w-full items-center gap-2 rounded-full border border-line bg-paper p-1.5 pl-5 shadow-[0_12px_40px_-12px_rgba(11,31,58,0.25)] focus-within:border-teal"
          >
            <Sparkles size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="hero-brief" className="sr-only">
              What do you want to build?
            </label>
            <input
              id="hero-brief"
              name="message"
              placeholder="What are you building?"
              maxLength={300}
              className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-teal-deep"
            >
              Start<span className="max-sm:hidden"> a project</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-4 text-sm text-muted">
            Just browsing?{" "}
            <Link href="/services" className="font-semibold text-ink underline underline-offset-4 hover:text-teal-deep">
              See all services
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
