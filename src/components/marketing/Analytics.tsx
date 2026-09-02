"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** First-party page-view tracking; posts to /api/track on every route change. */
export function Analytics() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || last.current === pathname) return;
    last.current = pathname;
    const body = JSON.stringify({
      kind: "pageview",
      path: pathname,
      referrer: document.referrer || null,
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
      }
    } catch {
      /* analytics must never break the page */
    }
  }, [pathname]);

  return null;
}

export function trackCta(label: string) {
  try {
    const body = JSON.stringify({ kind: "cta", path: location.pathname, data: { label } });
    navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }));
  } catch {
    /* ignore */
  }
}
