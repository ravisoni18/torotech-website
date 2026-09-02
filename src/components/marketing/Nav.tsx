"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/85 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_var(--line)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] font-medium transition-colors hover:text-ink ${
                  active ? "text-ink" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-teal-deep"
          >
            Book a call
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3 text-lg font-medium text-ink">
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-ink px-5 py-3 text-center font-semibold text-white"
            >
              Book a call
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
