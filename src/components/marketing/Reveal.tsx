"use client";

import { motion, type Variants } from "motion/react";

const DIRECTIONS = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
} as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: keyof typeof DIRECTIONS;
  as?: "div" | "li";
}) {
  const offset = DIRECTIONS[direction];
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

/** Stagger a list of children with an incrementing delay, capped so long lists don't crawl in. */
export function RevealGroup({
  children,
  className = "",
  step = 0.08,
  max = 6,
}: {
  children: React.ReactNode[];
  className?: string;
  step?: number;
  max?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={Math.min(i, max) * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
