import { Children, type ReactNode } from 'react';
import clsx from 'clsx';
import { useInView } from '@/lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

function hiddenTransform(direction: Direction, distance: number): string {
  switch (direction) {
    case 'up':
      return `translate3d(0, ${34 * distance}px, 0)`;
    case 'down':
      return `translate3d(0, ${-34 * distance}px, 0)`;
    case 'left':
      return `translate3d(${34 * distance}px, 0, 0)`;
    case 'right':
      return `translate3d(${-34 * distance}px, 0, 0)`;
    case 'scale':
      return `scale(${1 - 0.05 * distance})`;
    default:
      return 'none';
  }
}

/** Scroll-triggered entrance. The only transition most content needs. */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 1,
  duration = 900,
  once = true,
  threshold = 0.15,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  distance?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ once, threshold });
  return (
    <div
      ref={ref}
      className={clsx('transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)]', className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : hiddenTransform(direction, distance),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${inView ? delay : 0}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** Reveals each direct child after the previous one, `step` ms apart. */
export function RevealGroup({
  children,
  className,
  step = 90,
  delay = 0,
  direction = 'up',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  direction?: Direction;
  as?: 'div' | 'ul' | 'ol';
}) {
  const items = Children.toArray(children);
  return (
    <Tag className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delay={delay + i * step} direction={direction}>
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
