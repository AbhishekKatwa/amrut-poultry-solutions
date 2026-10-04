import { type ReactNode } from 'react';
import clsx from 'clsx';

/** Honest label for any mock that shows example figures. */
export function SampleFlag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full bg-night-900/70 px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ash-dim ring-1 ring-hairline',
        className,
      )}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-yolk-400" />
      Sample data
    </span>
  );
}

/** Phone chassis. Give it a width; the aspect ratio is fixed. */
export function PhoneFrame({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={clsx(
        'relative aspect-9/19 rounded-[2.25rem] bg-gradient-to-b from-night-600 via-night-800 to-night-900 p-[3px] ring-1 ring-hairline-bright',
        'shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.04)_inset]',
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-night-950">
        <div
          aria-hidden
          className="absolute left-1/2 top-2 z-20 h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-night-900 ring-1 ring-white/5"
        />
        {/* glass reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
        />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center pt-7">
          {title ? (
            <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-ash-dim">{title}</span>
          ) : null}
        </div>
        <div className="h-full w-full pt-12">{children}</div>
      </div>
    </div>
  );
}

/** Desktop app window. Same chrome, more room. */
export function ScreenFrame({
  children,
  className,
  title = 'Amrut Poultry Management',
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  bare?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-panel bg-night-900 ring-1 ring-hairline rim',
        className,
      )}
    >
      {bare ? null : (
        <div className="flex items-center gap-3 border-b border-hairline bg-night-850/90 px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <i className="h-2 w-2 rounded-full bg-hairline-bright" />
            <i className="h-2 w-2 rounded-full bg-hairline-bright" />
            <i className="h-2 w-2 rounded-full bg-hairline-bright" />
          </span>
          <span className="truncate text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ash-dim">
            {title}
          </span>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/** Floating card that reads as a slice of the product, used in scatter galleries. */
export function ScreenPlate({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={clsx('relative overflow-hidden rounded-panel bg-night-850 p-4 ring-1 ring-hairline rim', className)}>
      {label ? (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">{label}</span>
          <SampleFlag />
        </div>
      ) : null}
      {children}
    </div>
  );
}
