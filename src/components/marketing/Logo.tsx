export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const ink = dark ? "#ffffff" : "var(--ink)";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Torotech">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" fill={ink} />
        {/* T + circuit trace */}
        <path d="M8 9h16M16 9v14" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="24.5" r="2.4" fill="var(--teal)" />
        <circle cx="8" cy="9" r="1.6" fill="#fff" />
        <circle cx="24" cy="9" r="1.6" fill="#fff" />
      </svg>
      <span className="text-[1.15rem] font-extrabold tracking-tight" style={{ color: ink }}>
        Torotech
      </span>
    </span>
  );
}
