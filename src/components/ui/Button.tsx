import { type ReactNode } from 'react';
import clsx from 'clsx';
import { useMagnetic, usePrefersReducedMotion, useCoarsePointer } from '@/lib/motion';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-yolk-400 text-night-950 hover:bg-yolk-300 shadow-[0_18px_44px_-22px_rgba(224,176,75,0.75)] hover:shadow-[0_22px_54px_-20px_rgba(224,176,75,0.85)]',
  secondary: 'bg-night-800/70 text-bone ring-1 ring-hairline-bright hover:bg-night-700 hover:ring-yolk-500/40',
  ghost: 'bg-transparent text-ash hover:text-bone ring-1 ring-transparent hover:ring-hairline',
};

/** The one call-to-action control. `magnetic` gives it the pointer pull premium sites lean on. */
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className,
  icon,
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const magnet = useMagnetic(0.18, !magnetic || reduced || coarse);

  const classes = clsx(
    'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium tracking-tight',
    'transition-[background-color,color,box-shadow,transform] duration-300 ease-out select-none',
    size === 'sm' && 'px-4 py-2 text-[0.8125rem]',
    size === 'md' && 'px-5 py-2.5 text-[0.9375rem]',
    size === 'lg' && 'px-7 py-3.5 text-base',
    VARIANTS[variant],
    className,
  );

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {icon ? <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span> : null}
    </>
  );

  if (href) {
    const external = href.startsWith('http');
    return (
      <div
        ref={magnetic ? magnet.ref : undefined}
        onPointerMove={magnetic ? magnet.onPointerMove : undefined}
        onPointerLeave={magnetic ? magnet.onPointerLeave : undefined}
        className="inline-block transition-transform duration-300 ease-out"
      >
        <a
          href={href}
          aria-label={ariaLabel}
          className={classes}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {inner}
        </a>
      </div>
    );
  }

  return (
    <div
      ref={magnetic ? magnet.ref : undefined}
      onPointerMove={magnetic ? magnet.onPointerMove : undefined}
      onPointerLeave={magnetic ? magnet.onPointerLeave : undefined}
      className="inline-block transition-transform duration-300 ease-out"
    >
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes}>
        {inner}
      </button>
    </div>
  );
}
