import { useEffect, useMemo, useRef } from 'react';
import { DATA_POINTS, PIPELINE } from '@/lib/content';
import {
  clamp,
  lerp,
  phase,
  useCoarsePointer,
  usePrefersReducedMotion,
  useScrollProgress,
} from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow } from '@/components/ui/Type';
import { Glow } from '@/components/ui/Surface';

/* ============================================================
   §7 — The core problem. The twelve numbers a poultry business
   produces, first scattered and disconnected, then settling into
   an ordered field with hairline edges converging on one node.

   Node positions are computed once (golden-angle scatter → tidy
   barrel columns) with zero randomness at render. The settle
   value comes from the scroll phase; a single rAF handler writes
   two wave custom properties for the idle drift, which fades out
   as the field orders itself. Under reduced motion or a coarse
   pointer the field renders fully settled and connected.
   ============================================================ */

const smooth = (t: number) => t * t * (3 - 2 * t);

type Placement = {
  label: string;
  sx: number; // scattered position, % of field
  sy: number;
  ex: number; // settled position, % of field
  ey: number;
  wx: number; // drift participation, −1 → 1
  wy: number;
};

/** Deterministic: index arithmetic only, never Math.random. */
function buildPlacements(): Placement[] {
  return DATA_POINTS.map((label, i) => {
    const left = i < 6;
    const row = i % 6;
    const ex = left ? 18 + Math.abs(row - 2.5) * 1.6 : 82 - Math.abs(row - 2.5) * 1.6;
    const ey = 14 + row * 14.4;
    const angle = i * 2.39996323; // golden angle, in radians
    const radius = 16 + 20 * (((i * 5) % 6) / 5);
    return {
      label,
      sx: clamp(50 + Math.cos(angle) * radius * 1.1, 18, 82),
      sy: clamp(50 + Math.sin(angle) * radius * 0.95, 10, 90),
      ex,
      ey,
      wx: ((i % 4) - 1.5) / 1.5,
      wy: (((i * 3) % 4) - 1.5) / 1.5,
    };
  });
}

/** One gently bowed hairline from a settled node to the centre. */
function edgePath(ex: number, ey: number): string {
  const dx = 50 - ex;
  const dy = 50 - ey;
  const len = Math.hypot(dx, dy) || 1;
  const bow = len * 0.09;
  const cx = (ex + 50) / 2 + (-dy / len) * bow;
  const cy = (ey + 50) / 2 + (dx / len) * bow;
  return `M ${ex.toFixed(2)} ${ey.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} 50 50`;
}

/** Ash → amber colour blend as the field settles. */
function blend(t: number, from: [number, number, number], to: [number, number, number], alpha: number) {
  return `rgb(${Math.round(lerp(from[0], to[0], t))} ${Math.round(lerp(from[1], to[1], t))} ${Math.round(
    lerp(from[2], to[2], t),
  )} / ${alpha.toFixed(3)})`;
}

export function CoreProblem() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const animate = !reduced && !coarse;
  const [fieldRef, progress] = useScrollProgress<HTMLDivElement>();
  const driftRef = useRef<HTMLDivElement | null>(null);
  const settleRef = useRef(0);

  const placements = useMemo(buildPlacements, []);
  const edges = useMemo(() => placements.map(({ ex, ey }) => edgePath(ex, ey)), [placements]);

  // Nodes settle first; edges draw behind them a beat later.
  const t1 = animate ? smooth(phase(progress, 0.22, 0.58)) : 1;
  const t2 = animate ? smooth(phase(progress, 0.44, 0.8)) : 1;

  useEffect(() => {
    settleRef.current = t1;
  }, [t1]);

  useEffect(() => {
    const el = driftRef.current;
    if (!el) return;
    if (!animate) {
      el.style.setProperty('--w1', '0px');
      el.style.setProperty('--w2', '0px');
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = (now - t0) / 1000;
      const amp = Math.max(0, 1 - settleRef.current);
      el.style.setProperty('--w1', `${(Math.sin(s * 0.8) * 8 * amp).toFixed(2)}px`);
      el.style.setProperty('--w2', `${(Math.sin(s * 0.6 + 1.7) * 6 * amp).toFixed(2)}px`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  return (
    <Section id="problem" className="border-y border-hairline bg-night-900">
      <Glow from="rgba(239,169,58,0.09)" className="left-1/2 top-1/3 h-[50vh] -translate-x-1/2" />

      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow tone="bone">The problem</Eyebrow>
          <Display size="lg" className="mt-6 max-w-[16ch]">
            A poultry business generates thousands of numbers.
          </Display>
        </Reveal>

        {/* the field */}
        <div ref={fieldRef} className="mt-10 sm:mt-14">
          <div
            ref={driftRef}
            className="relative mx-auto h-[clamp(380px,62svh,540px)] w-full max-w-[880px]"
            style={{ transform: 'perspective(1400px) rotateX(4deg)' }}
          >
            {/* edges — 1px amber hairlines that draw in as the field connects */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {edges.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="var(--color-yolk-500)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - t2}
                  opacity={(0.06 + t2 * 0.26).toFixed(3)}
                />
              ))}
            </svg>

            {/* the node every number converges on */}
            <div
              className="absolute left-1/2 top-1/2 z-10"
              style={{ transform: `translate3d(-50%,-50%,0) scale(${lerp(0.85, 1, t2).toFixed(3)})` }}
            >
              <div
                className="flex h-[60px] w-[60px] items-center justify-center rounded-full border bg-night-900 sm:h-[72px] sm:w-[72px]"
                style={{
                  borderColor: `rgb(239 169 58 / ${(0.18 + t2 * 0.42).toFixed(3)})`,
                  boxShadow: `0 0 ${Math.round(24 + t2 * 44)}px -8px rgba(239,169,58,${(0.12 + t2 * 0.3).toFixed(3)})`,
                }}
              >
                <span className="text-[0.8125rem] font-semibold tracking-tight text-bone sm:text-sm">Amrut</span>
              </div>
            </div>

            {/* the numbers themselves */}
            {placements.map((n) => {
              const x = lerp(n.sx, n.ex, t1);
              const y = lerp(n.sy, n.ey, t1);
              return (
                <div
                  key={n.label}
                  className="absolute"
                  style={{
                    left: `${x.toFixed(3)}%`,
                    top: `${y.toFixed(3)}%`,
                    opacity: lerp(0.55, 1, t1).toFixed(3),
                    transform: `translate3d(calc(-50% + var(--w1, 0px) * ${n.wx.toFixed(2)}), calc(-50% + var(--w2, 0px) * ${n.wy.toFixed(2)}), 0) scale(${lerp(0.92, 1, t1).toFixed(3)})`,
                  }}
                >
                  <span
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-night-900/85 px-2 py-1 text-[0.625rem] font-medium sm:px-2.5 sm:text-[0.75rem]"
                    style={{
                      borderColor: blend(t1, [51, 64, 61], [239, 169, 58], lerp(0.6, 0.34, t1)),
                      color: blend(t1, [163, 172, 168], [244, 241, 233], 1),
                    }}
                  >
                    <span
                      aria-hidden
                      className="h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: blend(t1, [109, 118, 114], [247, 194, 92], 0.9) }}
                    />
                    {n.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* the ledger line: what actually gets connected */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 border-y border-hairline py-4 text-[0.5625rem] font-semibold uppercase tracking-[0.18em] sm:text-[0.625rem]">
            <span className="mr-1 text-ash-dim">Connects</span>
            {PIPELINE.map((step, i) => (
              <span key={step} className="flex items-center gap-2.5">
                <span className="text-ash">{step}</span>
                {i < PIPELINE.length - 1 ? (
                  <span aria-hidden className="text-yolk-500/60">
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>

        {/* the closing statement */}
        <Reveal delay={80} className="mt-16 sm:mt-20">
          <Display size="lg" className="mx-auto max-w-[24ch] text-center">
            The numbers are connected.
            <span className="mt-2 block text-yolk-300">Your system should be too.</span>
          </Display>
        </Reveal>
      </div>
    </Section>
  );
}
