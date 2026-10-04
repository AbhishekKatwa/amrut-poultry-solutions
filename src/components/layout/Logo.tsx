import clsx from 'clsx';

/** Egg silhouette with a node lattice inside: a poultry identity that reads as technology. */
export function LogoMark({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden
      className={clsx('shrink-0', className)}
      fill="none"
    >
      <defs>
        <linearGradient id="amrut-egg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD484" />
          <stop offset="55%" stopColor="#EFA93A" />
          <stop offset="100%" stopColor="#CF8A1E" />
        </linearGradient>
      </defs>
      <path
        d="M16 3.2c5.6 0 10.1 8.1 10.1 14.4A10.1 10.1 0 0 1 16 27.8 10.1 10.1 0 0 1 5.9 17.6C5.9 11.3 10.4 3.2 16 3.2Z"
        stroke="url(#amrut-egg)"
        strokeWidth="1.5"
      />
      <path d="M16 9.4v8.2M11.4 15.2l4.6 2.4 4.6-2.4" stroke="url(#amrut-egg)" strokeWidth="1.25" strokeLinecap="round" opacity="0.85" />
      <circle cx="16" cy="17.6" r="1.5" fill="#FFD484" />
      <circle cx="11.4" cy="15.2" r="1.1" fill="#EFA93A" />
      <circle cx="20.6" cy="15.2" r="1.1" fill="#EFA93A" />
    </svg>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <LogoMark size={compact ? 24 : 28} />
      <span className="flex flex-col leading-none">
        <span className="text-[0.9375rem] font-semibold tracking-[0.02em] text-bone">AMRUT</span>
        <span className="mt-0.5 text-[0.5625rem] font-medium uppercase tracking-[0.26em] text-ash-dim">
          Poultry Solutions
        </span>
      </span>
    </span>
  );
}
