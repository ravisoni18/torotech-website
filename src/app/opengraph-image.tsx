import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Default share card for every page that doesn't set its own image.
export const alt = "Torotech — SAP BTP, Fiori & AI software development in Kitchener, Ontario";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "linear-gradient(135deg,#0b1f3a 0%,#0b1f3a 55%,#0a7676 100%)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#fff", color: "#0b1f3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800 }}>T</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>Software that ships,</div>
          <div style={{ fontSize: 76, fontWeight: 400, lineHeight: 1.02, color: "#7fe0d6", fontStyle: "italic" }}>from website to SAP</div>
          <div style={{ fontSize: 30, color: "#c9d6e6", marginTop: 10 }}>SAP BTP & Fiori · AI agents · Web & mobile apps · BI · Automation</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#c9d6e6" }}>
          <div>{SITE.location}</div>
          <div>{`${SITE.domain} · ${SITE.phone}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
