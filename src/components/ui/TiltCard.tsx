import { useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { useCoarsePointer, usePrefersReducedMotion } from '@/lib/motion';

/**
 * Pointer-tracked 3D tilt. Writes --tilt-x / --tilt-y so children can move at
 * their own depth with `translate3d(calc(var(--tilt-x) * Npx), ...)`.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  lift = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const active = !reduced && !coarse;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || !active) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty('--tilt-x', px.toFixed(3));
    node.style.setProperty('--tilt-y', py.toFixed(3));
    node.style.transform = `perspective(1200px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translate3d(0, ${(-lift * 0.3).toFixed(1)}px, ${lift}px)`;
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-x', '0');
    node.style.setProperty('--tilt-y', '0');
    node.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={clsx(
        'group/tilt relative rounded-card transition-transform duration-500 ease-out will-change-transform',
        className,
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{
            background:
              'radial-gradient(45% 55% at calc(50% + var(--tilt-x, 0) * 40%) calc(50% + var(--tilt-y, 0) * 40%), rgba(255,236,190,0.10), transparent 65%)',
          }}
        />
      ) : null}
    </div>
  );
}
