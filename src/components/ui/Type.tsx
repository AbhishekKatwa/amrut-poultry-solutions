import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Reveal } from '@/components/ui/Reveal';

/** Small all-caps technical label with a leading tick. */
export function Eyebrow({ children, className, tone = 'amber' }: { children: ReactNode; className?: string; tone?: 'amber' | 'moss' | 'steel' | 'bone' }) {
  return (
    <p
      className={clsx(
        'flex items-center gap-2.5 text-eyebrow font-semibold uppercase',
        tone === 'amber' && 'text-yolk-400',
        tone === 'moss' && 'text-moss',
        tone === 'steel' && 'text-steel',
        tone === 'bone' && 'text-ash',
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'inline-block h-px w-6',
          tone === 'amber' ? 'bg-yolk-500/70' : tone === 'bone' ? 'bg-hairline-bright' : 'currentColor opacity-60',
        )}
      />
      {children}
    </p>
  );
}

/** The big statement. `size=hero` is the only place type is allowed to shout. */
export function Display({
  children,
  size = 'md',
  as: Tag = 'h2',
  className,
}: {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <Tag
      className={clsx(
        'font-semibold text-bone',
        size === 'hero' && 'text-[clamp(2.75rem,7.2vw,6.5rem)] leading-[0.95] tracking-[-0.04em]',
        size === 'lg' && 'text-[clamp(2.125rem,5vw,4.25rem)] leading-[1.02] tracking-[-0.035em]',
        size === 'md' && 'text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.03em]',
        size === 'sm' && 'text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.15] tracking-[-0.02em]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('max-w-[62ch] text-sub text-ash', className)}>{children}</p>;
}

/** Section opener: eyebrow, headline, supporting line. Reveal-staggered as one unit. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  size = 'lg',
  align = 'left',
  tone = 'amber',
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  size?: 'md' | 'lg' | 'hero';
  align?: 'left' | 'center';
  tone?: 'amber' | 'moss' | 'steel' | 'bone';
  className?: string;
}) {
  return (
    <Reveal className={clsx(align === 'center' && 'flex flex-col items-center text-center', className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Display size={size} className="mt-5">
        {title}
      </Display>
      {lede ? <Lede className="mt-5">{lede}</Lede> : null}
    </Reveal>
  );
}

/** Large financial figure. `hint` is what it means, in as few words as possible. */
export function Metric({
  value,
  hint,
  unit,
  tone = 'bone',
  size = 'md',
  className,
}: {
  value: ReactNode;
  hint?: ReactNode;
  unit?: ReactNode;
  tone?: 'bone' | 'amber' | 'moss' | 'clay' | 'steel';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline gap-1.5">
        <span
          className={clsx(
            'tnum font-semibold leading-none tracking-[-0.04em]',
            size === 'sm' && 'text-2xl',
            size === 'md' && 'text-[clamp(1.75rem,3.2vw,2.75rem)]',
            size === 'lg' && 'text-[clamp(2.25rem,5vw,3.75rem)]',
            tone === 'bone' && 'text-bone',
            tone === 'amber' && 'text-yolk-300',
            tone === 'moss' && 'text-moss',
            tone === 'clay' && 'text-clay',
            tone === 'steel' && 'text-steel',
          )}
        >
          {value}
        </span>
        {unit ? <span className="text-sm font-medium text-ash-dim">{unit}</span> : null}
      </div>
      {hint ? <span className="text-[0.8125rem] text-ash-dim">{hint}</span> : null}
    </div>
  );
}

/** Technical tag: FARM / INVENTORY / P&L. */
export function Tag({ children, tone = 'bone', className }: { children: ReactNode; tone?: 'bone' | 'amber' | 'moss' | 'steel'; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] ring-1',
        tone === 'bone' && 'text-ash ring-hairline-bright bg-night-800/60',
        tone === 'amber' && 'text-yolk-300 ring-yolk-500/35 bg-yolk-500/10',
        tone === 'moss' && 'text-moss ring-moss/35 bg-moss/10',
        tone === 'steel' && 'text-steel ring-steel/35 bg-steel/10',
        className,
      )}
    >
      {children}
    </span>
  );
}
