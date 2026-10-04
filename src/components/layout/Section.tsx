import { type ReactNode } from 'react';
import clsx from 'clsx';

/** Page rhythm: one shell per section, consistent gutter and measure. */
export function Section({
  id,
  children,
  className,
  container = true,
  width = 'default',
  tight = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  container?: boolean;
  width?: 'default' | 'wide' | 'narrow';
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={clsx(
        'relative isolate overflow-hidden',
        tight ? 'py-16 sm:py-20' : 'py-28 sm:py-36',
        className,
      )}
    >
      {container ? (
        <div
          className={clsx(
            'mx-auto w-full px-5 sm:px-8',
            width === 'default' && 'max-w-[1180px]',
            width === 'wide' && 'max-w-[1440px]',
            width === 'narrow' && 'max-w-[880px]',
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

/** Sticky-anchor helper so navbar offsets land below the bar. */
export function Anchor({ id }: { id: string }) {
  return <span id={id} aria-hidden className="pointer-events-none absolute -top-24 block h-px w-0" />;
}
