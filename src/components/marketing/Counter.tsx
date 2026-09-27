"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";

/** Animates a number counting up when it scrolls into view. Non-numeric parts (+, %, etc.) pass through untouched. */
export function Counter({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value.replace(/[0-9.]+/, "0"));

  const match = value.match(/[0-9]+(\.[0-9]+)?/);
  const target = match ? parseFloat(match[0]) : null;

  useEffect(() => {
    if (!inView || target === null || !match) return;
    const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const formatted = decimals ? v.toFixed(decimals) : Math.round(v).toString();
        setDisplay(value.replace(match[0], formatted));
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
