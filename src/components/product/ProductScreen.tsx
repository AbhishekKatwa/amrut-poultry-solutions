import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { CAPTION, SHOTS, type ScreenName } from '@/lib/content';
import { useCoarsePointer, useInView, usePrefersReducedMotion } from '@/lib/motion';

/**
 * A real screen of Amrut Poultry Management, shown as the capture it is.
 *
 * Full-page captures are taller than any frame, so the stage pans slowly through
 * the record instead of shrinking it into unreadability. Pan distance is measured,
 * not guessed, and motion is dropped for reduced-motion and coarse pointers.
 */
export const SCREEN_LABEL: Record<ScreenName, string> = {
  dashboard: 'Dashboard',
  batch: 'Batch Details',
  'egg-sales': 'Egg Sales',
  planner: 'Egg Planner',
  godown: 'Godown',
  'trader-ledger': 'Trader Ledger',
  finance: 'Finance',
  pnl: 'Farm P&L',
};

export function ProductScreen({
  name,
  className,
  chrome = true,
  device = 'desktop',
  pan = true,
  eager = false,
}: {
  name: ScreenName;
  className?: string;
  chrome?: boolean;
  device?: 'desktop' | 'phone';
  pan?: boolean;
  eager?: boolean;
}) {
  const aspect = SHOTS[name][device === 'phone' ? 'mobile' : 'desktop'];
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const [stageRef, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [panPct, setPanPct] = useState(0);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (!width || !height) return;
      const imageHeight = width * aspect;
      setPanPct(Math.max(0, (1 - height / imageHeight) * 100));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [aspect, stageRef]);

  const animate = pan && !reduced && !coarse && panPct > 1 && inView;

  return (
    <div
      ref={stageRef}
      className={clsx('relative h-full w-full overflow-hidden bg-paper', className)}
      data-screen={name}
      data-device={device}
    >
      <div
        className="absolute inset-x-0 top-0"
        style={
          animate
            ? {
                ['--pan-end' as string]: `-${panPct.toFixed(2)}%`,
                animation: 'shot-pan 28s cubic-bezier(0.45,0,0.55,1) infinite alternate',
              }
            : undefined
        }
      >
        <img
          src={`/screens/${name}-${device === 'phone' ? 'mobile' : 'desktop'}.jpg`}
          alt={`${SCREEN_LABEL[name]} screen of ${'Amrut Poultry Management'}`}
          width={device === 'phone' ? 480 : 1280}
          height={Math.round((device === 'phone' ? 480 : 1280) * aspect)}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className="block w-full select-none"
        />
      </div>

      {chrome ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-night-950/85 via-night-950/35 to-transparent px-4 pb-3 pt-10">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-bone/90">
            {SCREEN_LABEL[name]}
          </span>
          <span className="text-[0.5625rem] uppercase tracking-[0.16em] text-bone/55">{CAPTION.capture}</span>
        </div>
      ) : null}
    </div>
  );
}
