import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/site";

// Self-hosted variable fonts (SIL OFL) — no network call at build or run time.
const manrope = localFont({
  variable: "--font-manrope",
  src: [
    { path: "../fonts/manrope-latin.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/manrope-latin-ext.woff2", weight: "200 800", style: "normal" },
  ],
  display: "swap",
});

const jetbrains = localFont({
  variable: "--font-jetbrains",
  src: [{ path: "../fonts/jetbrains-mono-latin.woff2", weight: "100 800", style: "normal" }],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — AI solutions for SAP, BTP & Fiori`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — AI solutions for SAP, BTP & Fiori`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
