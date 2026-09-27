/** Purely decorative background graphic for the homepage hero — dot grid + soft floating blobs. No stock imagery, just brand-colour shapes. */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden="true">
        <defs>
          <pattern id="hero-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="var(--line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
      <div className="float-slow absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-tint/70 blur-3xl" />
      <div className="float-slow-delay absolute -right-16 top-24 h-80 w-80 rounded-full bg-mist blur-3xl" />
      <div className="float-slow absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-tint/40 blur-3xl" />
    </div>
  );
}
