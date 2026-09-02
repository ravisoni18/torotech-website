const TECH = [
  "SAP S/4HANA",
  "SAP BTP",
  "Fiori Elements",
  "SAPUI5",
  "CAP · Node.js",
  "RAP · ABAP CDS",
  "HANA Cloud",
  "Integration Suite",
  "Event Mesh",
  "Anthropic Claude",
  "SAP AI Core",
  "Next.js",
  "TypeScript",
  "DuckDB",
  "Docker",
];

/** Wordmarks of the platforms we build on. Text, not logos — nothing to license, nothing to fake. */
export function TechMarquee() {
  const items = [...TECH, ...TECH];
  return (
    <div className="marquee relative overflow-hidden border-y border-line bg-paper py-5" aria-label="Technologies we work with">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
      <div className="marquee-track gap-12 px-6">
        {items.map((t, i) => (
          <span key={i} className="whitespace-nowrap text-[15px] font-semibold text-ink-soft" aria-hidden={i >= TECH.length}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
