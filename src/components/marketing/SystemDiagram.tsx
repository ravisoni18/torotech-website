/**
 * The hero graphic: a live schematic of how a Torotech agent is actually built —
 * a chat shell and a narrow LLM feed an orchestrator, which is the only thing that
 * reads S/4HANA and proposes actions; a person approves before anything posts back.
 * Pure SVG + CSS motion paths; no JS, respects prefers-reduced-motion.
 */
export function SystemDiagram({ className = "" }: { className?: string }) {
  const chatPath = "M 125 72 C 125 118, 200 118, 300 150";
  const llmPath = "M 460 150 C 560 118, 635 118, 635 72";
  const readPath = "M 118 206 C 200 206, 210 206, 290 206";
  const proposePath = "M 470 206 C 550 206, 560 206, 642 206";
  const approvePath = "M 698 252 C 698 322, 430 322, 405 262";
  const postPath = "M 355 262 C 330 322, 60 322, 60 252";

  return (
    <svg
      viewBox="0 0 760 400"
      className={className}
      role="img"
      aria-labelledby="sysdiag-title sysdiag-desc"
    >
      <title id="sysdiag-title">How a Torotech agent works</title>
      <desc id="sysdiag-desc">
        A chat shell and a narrow LLM both feed an orchestrator on SAP BTP. The orchestrator is the only
        thing that reads S/4HANA and proposes an action; a person approves it in a Fiori or Teams inbox
        before it posts back to SAP. The LLM never touches SAP directly.
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

      <rect x="0" y="0" width="760" height="400" fill="url(#grid)" opacity="0.7" />

      {/* connectors */}
      <g fill="none" stroke="#9fb1c4" strokeWidth="1.6">
        <path d={chatPath} className="flow-line" />
        <path d={llmPath} className="flow-line" />
        <path d={readPath} className="flow-line" />
        <path d={proposePath} className="flow-line" />
        <path d={approvePath} className="flow-line" />
        <path d={postPath} className="flow-line" />
      </g>

      {/* connector labels */}
      <g fontFamily="var(--font-sans)" fontSize="10.5" fill="#6b7a90" fontWeight="600">
        <text x="185" y="112" textAnchor="middle">question</text>
        <text x="575" y="112" textAnchor="middle">prompt → JSON</text>
        <text x="204" y="194" textAnchor="middle">OData · CDS</text>
        <text x="555" y="194" textAnchor="middle">proposal + reasoning</text>
        <text x="545" y="336" textAnchor="middle">approved</text>
        <text x="190" y="336" textAnchor="middle">RAP / BAPI posting</text>
      </g>

      {/* Chat shell node */}
      <g filter="url(#soft)">
        <rect x="50" y="16" width="150" height="56" rx="12" fill="#fff" stroke="#dde5ec" />
        <g transform="translate(66 30)">
          <rect x="0" y="0" width="20" height="16" rx="4" fill="#0b1f3a" />
          <path d="M 4 16 L 4 21 L 9 16 Z" fill="#0b1f3a" />
        </g>
        <text x="94" y="38" fontFamily="var(--font-sans)" fontSize="13" fontWeight="700" fill="#0b1f3a">
          Chat shell
        </text>
        <text x="94" y="55" fontFamily="var(--font-sans)" fontSize="10.5" fill="#6b7a90">
          any chat UI
        </text>
      </g>

      {/* Narrow LLM node */}
      <g filter="url(#soft)">
        <rect x="560" y="16" width="150" height="56" rx="12" fill="#fff" stroke="#0f9d9d" strokeWidth="1.4" />
        <text x="635" y="38" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="700" fill="#0b1f3a">
          Narrow LLM
        </text>
        <text x="635" y="55" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#0f9d9d">
          Claude / AI Core
        </text>
      </g>

      {/* S/4HANA node */}
      <g filter="url(#soft)">
        <rect x="8" y="160" width="110" height="92" rx="14" fill="#fff" stroke="#dde5ec" />
        <g transform="translate(24 176)">
          <rect x="0" y="0" width="22" height="22" rx="5" fill="#0b1f3a" />
          <rect x="4" y="5" width="14" height="2.5" rx="1" fill="#fff" />
          <rect x="4" y="10" width="10" height="2.5" rx="1" fill="#fff" />
          <rect x="4" y="15" width="12" height="2.5" rx="1" fill="#fff" />
        </g>
        <text x="24" y="222" fontFamily="var(--font-sans)" fontSize="14" fontWeight="700" fill="#0b1f3a">
          S/4HANA
        </text>
        <text x="24" y="240" fontFamily="var(--font-sans)" fontSize="11" fill="#6b7a90">
          backend of record
        </text>
      </g>

      {/* Orchestrator node */}
      <g filter="url(#soft)">
        <circle cx="380" cy="206" r="64" fill="#e3f5f5" className="pulse-ring" />
        <rect x="290" y="150" width="180" height="112" rx="18" fill="url(#agentGlow)" />
        <g transform="translate(310 166)">
          <circle cx="11" cy="11" r="11" fill="#fff" opacity="0.15" />
          <path d="M 6 11 L 10 15 L 16 7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="310" y="216" fontFamily="var(--font-sans)" fontSize="16" fontWeight="800" fill="#fff">
          Orchestrator
        </text>
        <text x="310" y="236" fontFamily="var(--font-sans)" fontSize="11.5" fill="#cfe9e9">
          on SAP BTP · plain code
        </text>
        <text x="310" y="252" fontFamily="var(--font-mono)" fontSize="10" fill="#9fdede">
          reads → decides → proposes
        </text>
      </g>

      {/* Fiori approval node */}
      <g filter="url(#soft)">
        <rect x="642" y="160" width="112" height="92" rx="14" fill="#fff" stroke="#dde5ec" />
        <g transform="translate(658 176)">
          <circle cx="11" cy="8" r="6" fill="#0f9d9d" />
          <path d="M 0 24 C 0 15, 22 15, 22 24 Z" fill="#0f9d9d" />
        </g>
        <text x="658" y="222" fontFamily="var(--font-sans)" fontSize="14" fontWeight="700" fill="#0b1f3a">
          Approver
        </text>
        <text x="658" y="240" fontFamily="var(--font-sans)" fontSize="11" fill="#6b7a90">
          Fiori inbox · Teams
        </text>
      </g>

      {/* moving packets */}
      <g>
        <circle r="5" fill="#0b1f3a" className="packet" style={{ offsetPath: `path("${chatPath}")` }} />
        <circle r="5" fill="#0f9d9d" className="packet" style={{ offsetPath: `path("${llmPath}")`, animationDelay: "0.4s" }} />
        <circle r="5" fill="#0f9d9d" className="packet" style={{ offsetPath: `path("${readPath}")`, animationDelay: "0.8s" }} />
        <circle r="5" fill="#0f9d9d" className="packet" style={{ offsetPath: `path("${proposePath}")`, animationDelay: "1.6s" }} />
        <circle r="5" fill="#f0b429" className="packet" style={{ offsetPath: `path("${approvePath}")`, animationDelay: "2.2s" }} />
        <circle r="5" fill="#0b1f3a" className="packet" style={{ offsetPath: `path("${postPath}")`, animationDelay: "2.8s" }} />
      </g>

      {/* audit strip */}
      <g transform="translate(290 292)">
        <rect x="0" y="0" width="180" height="26" rx="8" fill="#fff" stroke="#dde5ec" />
        <circle cx="14" cy="13" r="4" fill="#0f9d9d" />
        <text x="26" y="17" fontFamily="var(--font-mono)" fontSize="10.5" fill="#3f5068">
          change doc · every action
        </text>
      </g>
    </svg>
  );
}
