"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

// Copying stays allowed — longer passages just carry a source line, so reposted text credits the site.
const MIN_CHARS = 120;

export function CopyAttribution() {
  useEffect(() => {
    function onCopy(e: ClipboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      const text = window.getSelection()?.toString() ?? "";
      if (text.trim().length < MIN_CHARS || !e.clipboardData) return;
      const url = `${SITE.url}${window.location.pathname}`;
      const note = `Source: ${url} — © ${new Date().getFullYear()} ${SITE.legalName} All rights reserved.`;
      e.clipboardData.setData("text/plain", `${text}\n\n${note}`);
      e.clipboardData.setData("text/html", `${text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!).replace(/\n/g, "<br>")}<br><br><small>Source: <a href="${url}">${url}</a> — © ${new Date().getFullYear()} ${SITE.legalName}</small>`);
      e.preventDefault();
    }
    document.addEventListener("copy", onCopy);
    return () => document.removeEventListener("copy", onCopy);
  }, []);
  return null;
}
