/**
 * The hero graphic: a live schematic of a Torotech agent loop.
 * S/4HANA (data) → BTP agent (reasoning) → Fiori approval (human) → back to S/4 (posting).
 * Pure SVG + CSS motion paths; no JS, respects prefers-reduced-motion.
 */
export function SystemDiagram({ className = "" }: { className?: string }) {
  const readPath = "M 118 150 C 200 150, 210 150, 290 150";
  const proposePath = "M 470 150 C 550 150, 560 150, 640 150";
  const approvePath = "M 700 190 C 700 300, 380 330, 380 236";
  const postPath = "M 330 236 C 330 330, 60 320, 60 190";

  return (
    <svg
      viewBox="0 0 760 360"
      className={className}
      role="img"
      aria-labelledby="sysdiag-title sysdiag-desc"
    >
      <title id="sysdiag-title">How a Torotech agent works</title>
      <desc id="sysdiag-desc">
        Data flows from SAP S/4HANA into an AI agent on BTP, which proposes an action to a person in a Fiori
        approval app; the approved action is posted back to SAP.
      </desc>
      <defs>
        <linearGradient id="agentGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f9d9d" />
          <stop offset="1" stopColor="#0b1f3a" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0b1f3a" floodOpacity="0.10" />
        </filter>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dde5ec" strokeWidth="0.6" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="760" height="360" fill="url(#grid)" opacity="0.7" />

      {/* connectors */}
      <g fill="none" stroke="#9fb1c4" strokeWidth="1.6">
        <path d={readPath} className="flow-line" />
        <path d={proposePath} className="flow-line" />
        <path d={approvePath} className="flow-line" />
        <path d={postPath} className="flow-line" />
      </g>

      {/* connector labels */}
      <g fontFamily="var(--font-sans)" fontSize="11" fill="#6b7a90" fontWeight="600">
        <text x="204" y="138" textAnchor="middle">OData · CDS</text>
        <text x="555" y="138" textAnchor="middle">proposal + reasoning</text>
        <text x="545" y="322" textAnchor="middle">approved</text>
        <text x="190" y="322" textAnchor="middle">RAP / BAPI posting</text>
      </g>

      {/* S/4HANA node */}
      <g filter="url(#soft)">
        <rect x="8" y="104" width="110" height="92" rx="14" fill="#fff" stroke="#dde5ec" />
        <g transform="translate(24 120)">
          <rect x="0" y="0" width="22" height="22" rx="5" fill="#0b1f3a" />
          <rect x="4" y="5" width="14" height="2.5" rx="1" fill="#fff" />
          <rect x="4" y="10" width="10" height="2.5" rx="1" fill="#fff" />
          <rect x="4" y="15" width="12" height="2.5" rx="1" fill="#fff" />
        </g>
        <text x="24" y="166" fontFamily="var(--font-sans)" fontSize="14" fontWeight="700" fill="#0b1f3a">
          S/4HANA
        </text>
        <text x="24" y="184" fontFamily="var(--font-sans)" fontSize="11" fill="#6b7a90">
          orders · stock · GL
        </text>
      </g>

      {/* Agent node */}
      <g filter="url(#soft)">
        <circle cx="380" cy="150" r="64" fill="#e3f5f5" className="pulse-ring" />
        <rect x="290" y="92" width="180" height="116" rx="18" fill="url(#agentGlow)" />
        <g transform="translate(310 110)">
          <circle cx="11" cy="11" r="11" fill="#fff" opacity="0.15" />
          <path d="M 6 11 L 10 15 L 16 7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="310" y="160" fontFamily="var(--font-sans)" fontSize="16" fontWeight="800" fill="#fff">
          Torotech agent
        </text>
        <text x="310" y="180" fontFamily="var(--font-sans)" fontSize="11.5" fill="#cfe9e9">
          on SAP BTP · Claude / AI Core
        </text>
        <text x="310" y="196" fontFamily="var(--font-mono)" fontSize="10.5" fill="#9fdede">
          reads → reasons → proposes
        </text>
      </g>

      {/* Fiori approval node */}
      <g filter="url(#soft)">
        <rect x="640" y="104" width="112" height="92" rx="14" fill="#fff" stroke="#dde5ec" />
        <g transform="translate(656 120)">
          <circle cx="11" cy="8" r="6" fill="#0f9d9d" />
          <path d="M 0 24 C 0 15, 22 15, 22 24 Z" fill="#0f9d9d" />
        </g>
        <text x="656" y="166" fontFamily="var(--font-sans)" fontSize="14" fontWeight="700" fill="#0b1f3a">
          Approver
        </text>
        <text x="656" y="184" fontFamily="var(--font-sans)" fontSize="11" fill="#6b7a90">
          Fiori inbox · Teams
        </text>
      </g>

      {/* moving packets */}
      <g>
        <circle r="5" fill="#0f9d9d" className="packet" style={{ offsetPath: `path("${readPath}")` }} />
        <circle r="5" fill="#0f9d9d" className="packet" style={{ offsetPath: `path("${proposePath}")`, animationDelay: "0.8s" }} />
        <circle r="5" fill="#f0b429" className="packet" style={{ offsetPath: `path("${approvePath}")`, animationDelay: "1.6s" }} />
        <circle r="5" fill="#0b1f3a" className="packet" style={{ offsetPath: `path("${postPath}")`, animationDelay: "2.4s" }} />
      </g>

      {/* audit strip */}
      <g transform="translate(290 232)">
        <rect x="0" y="0" width="180" height="26" rx="8" fill="#fff" stroke="#dde5ec" />
        <circle cx="14" cy="13" r="4" fill="#0f9d9d" />
        <text x="26" y="17" fontFamily="var(--font-mono)" fontSize="10.5" fill="#3f5068">
          change doc · every action
        </text>
      </g>
    </svg>
  );
}
