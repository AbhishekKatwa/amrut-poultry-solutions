import { type ReactNode } from 'react';
import clsx from 'clsx';

/** The standard raised surface: near-black, hairline rim, one soft shadow. */
export function Panel({
  children,
  className,
  tone = 'raised',
  interactive = false,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'raised' | 'sunken' | 'accent' | 'outline';
  interactive?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative rounded-card',
        padded && 'p-6 sm:p-7',
        tone === 'raised' && 'bg-night-800/85 ring-1 ring-hairline rim',
        tone === 'sunken' && 'bg-night-900/90 ring-1 ring-hairline',
        tone === 'accent' && 'bg-night-800 ring-1 ring-yolk-500/30 rim-amber',
        tone === 'outline' && 'bg-transparent ring-1 ring-hairline',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:ring-hairline-bright',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Out-of-focus light. Used sparingly so black never reads as empty. */
export function Glow({
  className,
  from = 'rgba(239,169,58,0.22)',
}: {
  className?: string;
  from?: string;
}) {
  return (
    <div
      aria-hidden
      className={clsx('pointer-events-none absolute inset-0 -z-10 blur-[110px]', className)}
      style={{ background: `radial-gradient(38% 46% at 50% 50%, ${from}, transparent 70%)` }}
    />
  );
}

/** Hairline that dissolves at both ends. */
export function Rule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx('h-px w-full bg-gradient-to-r from-transparent via-hairline-bright to-transparent', className)}
    />
  );
}

/** Vertical hairline used between stat columns. */
export function Divider({ className }: { className?: string }) {
  return <div aria-hidden className={clsx('w-px self-stretch bg-hairline', className)} />;
}

/** A single labelled figure inside a panel. */
export function StatLine({
  label,
  value,
  tone = 'bone',
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: 'bone' | 'moss' | 'clay' | 'amber' | 'ash';
  className?: string;
}) {
  return (
    <div className={clsx('flex items-baseline justify-between gap-4 py-2', className)}>
      <span className="text-[0.8125rem] text-ash-dim">{label}</span>
      <span
        className={clsx(
          'tnum text-[0.9375rem] font-semibold',
          tone === 'bone' && 'text-bone',
          tone === 'amber' && 'text-yolk-300',
          tone === 'moss' && 'text-moss',
          tone === 'clay' && 'text-clay',
          tone === 'ash' && 'text-ash',
        )}
      >
        {value}
      </span>
    </div>
  );
}
