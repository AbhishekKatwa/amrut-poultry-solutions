import { useCallback, useEffect, useRef, useState } from 'react';

/* ============================================================
   Motion primitives. Everything here is rAF/IntersectionObserver
   driven, cancels on unmount, and collapses to a static value
   under prefers-reduced-motion.
   ============================================================ */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    const apply = () => setCoarse(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return coarse;
}

/** Fires once when the node scrolls into view; `once:false` tracks both directions. */
export function useInView<T extends Element = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((entry) => entry.isIntersecting);
        if (hit) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView] as const;
}

/**
 * 0 → 1 as the element travels through the viewport:
 * 0 when its top edge reaches the bottom of the screen, 1 when its bottom edge
 * leaves the top. Read inside a rAF loop, never on raw scroll events.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      const raw = span > 0 ? (window.innerHeight - rect.top) / span : 0;
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress] as const;
}

/** Smoothed pointer offset from the viewport centre, −1 → 1 on each axis. */
export function usePointerOffset(options?: { disabled?: boolean }) {
  const disabled = options?.disabled ?? false;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      target.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    let frame = 0;
    let current = { x: 0, y: 0 };
    const loop = () => {
      current = {
        x: current.x + (target.current.x - current.x) * 0.08,
        y: current.y + (target.current.y - current.y) * 0.08,
      };
      setOffset({ x: current.x, y: current.y });
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [disabled]);

  return offset;
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
/** Maps a scroll progress window onto 0 → 1. */
export const phase = (progress: number, from: number, to: number) =>
  clamp((progress - from) / Math.max(0.0001, to - from));

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Counts to `value` once `active` turns true. Reduced motion jumps straight there. */
export function useCountUp(value: number, active: boolean, duration = 1500): number {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setShown(value);
      return;
    }
    const start = from.current;
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - t0) / duration);
      const next = start + (value - start) * easeOutExpo(t);
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, active, duration, reduced]);

  return shown;
}

/**
 * Steady rAF loop for imperative scenes (canvas / three.js).
 * The callback receives elapsed seconds since it started running.
 */
export function useRafLoop(callback: (elapsed: number, delta: number) => void, running = true) {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (!running || typeof window === 'undefined') return;
    let frame = 0;
    let start = performance.now();
    let last = start;
    const loop = (now: number) => {
      saved.current((now - start) / 1000, (now - last) / 1000);
      last = now;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);
}

export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const apply = () => setMatches(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [query]);
  return matches;
}

/** Magnet-style pull of an element towards the pointer, in px. */
export function useMagnetic(strength = 0.25, disabled = false) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node || disabled || event.pointerType === 'touch') return;
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [strength, disabled],
  );
  const onLeave = useCallback(() => {
    const node = ref.current;
    if (node) node.style.transform = '';
  }, []);
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}
