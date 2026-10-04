import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';
import { BRAND } from '@/lib/content';
import { clamp, phase, useCoarsePointer, usePrefersReducedMotion, useScrollProgress } from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';
import { Glow } from '@/components/ui/Surface';

/* ============================================================
   §6 — Company story. One scroll-driven scene: an abstract
   physical yard (three shed volumes, two egg-tray stacks, one
   feed-sack stack — six volumes) rotates and dissolves into a
   clean digital slab of six cells (KPI row, expense chart,
   ledger lines) while a single scan line sweeps the conversion.

   All interpolation is CSS calc() over custom properties; the
   scroll effect writes those properties onto the stage and never
   re-renders the scene subtree. Under reduced motion or a coarse
   pointer the stage renders directly in its final digital state.
   ============================================================ */

const FINAL = { '--p': '1', '--ophy': '0', '--odig': '1', '--osc': '0', '--ps': '0' } as const;
const ORIGIN = { '--p': '0', '--ophy': '1', '--odig': '0', '--osc': '0', '--ps': '0' } as const;

/** Honest framing — what the product records, what it connects, what it leaves alone. */
const FRAMING = [
  'It records the day as it happens — eggs, feed, birds, and every rupee in and out.',
  'It connects shed to store, sale to trader, expense to ledger.',
  'It leaves the way you run your farm exactly as you run it.',
];

/** One abstract volume: footprint, two extruded walls, lifted top face. */
function Block({
  left,
  top,
  width,
  height,
  z = 12,
  radius = 2,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  z?: number;
  radius?: number;
}) {
  return (
    <div
      className="d3 absolute"
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
    >
      <div className="absolute inset-0 border border-hairline bg-night-850/50" style={{ borderRadius: radius }} />
      <div
        className="absolute inset-x-0 bottom-0 border-t border-hairline bg-gradient-to-b from-white/[0.05] to-transparent"
        style={{ height: z, transformOrigin: 'bottom', transform: 'rotateX(-90deg)' }}
      />
      <div
        className="absolute inset-y-0 right-0 border-l border-hairline bg-gradient-to-r from-transparent to-white/[0.05]"
        style={{ width: z, transformOrigin: 'right', transform: 'rotateY(90deg)' }}
      />
      <div
        className="absolute inset-0 border border-hairline-bright bg-night-700/85"
        style={{
          transform: `translateZ(${z}px)`,
          borderRadius: radius,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      />
    </div>
  );
}

/** A stack of thin plates — egg trays and feed sacks, kept geometric. */
function Stack({
  left,
  top,
  width,
  height,
  plates,
  step,
  radius,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  plates: number;
  step: number;
  radius: number;
}) {
  const zs = useMemo(() => Array.from({ length: plates }, (_, k) => 4 + k * step), [plates, step]);
  return (
    <>
      {zs.map((tz) => (
        <div
          key={tz}
          className="absolute border border-hairline bg-night-800/70"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${width}%`,
            height: `${height}%`,
            borderRadius: radius,
            transform: `translateZ(${tz}px)`,
          }}
        />
      ))}
    </>
  );
}

function PhysicalField() {
  return (
    <div
      className="d3 absolute left-1/2 top-1/2 aspect-square w-[min(76vw,400px)] opacity-[var(--ophy)]"
      style={{ transform: 'translate3d(-50%,-50%,0)' }}
    >
      {/* the ground plane */}
      <div className="rule-grid absolute inset-0 rounded-[6px] border border-hairline bg-night-850/60" />
      {/* thin surveyed edges */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 h-full w-full text-white/12"
      >
        <path
          d="M0 24H100 M0 66H100 M27 0V100 M66 0V100"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M2 2 12 12 M98 2 88 12 M2 98 12 88 M98 98 88 88"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* three shed volumes */}
      <Block left={9} top={7} width={36} height={14} z={13} />
      <Block left={9} top={30} width={28} height={13} z={11} />
      <Block left={54} top={8} width={34} height={11} z={10} />
      {/* two egg-tray stacks */}
      <Stack left={55} top={27} width={15} height={9} plates={5} step={3.5} radius={2} />
      <Stack left={75} top={27} width={14} height={9} plates={5} step={3} radius={2} />
      {/* feed-sack stack */}
      <Stack left={16} top={70} width={12} height={12} plates={3} step={6} radius={4} />
    </div>
  );
}

/** One cell of the digital slab — the same volume count, reorganised. */
function Cell({ children, className, rise = 0 }: { children: ReactNode; className?: string; rise?: number }) {
  return (
    <div
      className={clsx('rounded-[10px] border border-hairline bg-night-850/80 p-3.5', className)}
      style={{
        opacity: 'var(--odig)',
        transform: `translate3d(0, calc((1 - var(--odig)) * ${6 + rise * 4}px), 0)`,
      }}
    >
      {children}
    </div>
  );
}

function DigitalSlab() {
  return (
    <div
      className="d3 absolute left-1/2 top-1/2 flex w-[min(86vw,420px)] flex-col gap-2.5 rounded-panel border border-hairline-bright bg-night-800/90 p-3.5 rim"
      style={{ transform: 'translate3d(-50%,-50%,0)' }}
    >
      {/* header — the rule resolves from a stub into a labelled title */}
      <div className="flex items-center justify-between" style={{ opacity: 'var(--odig)' }}>
        <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-ash">{BRAND.product}</span>
        <span
          aria-hidden
          className="h-px bg-gradient-to-r from-transparent via-hairline-bright to-transparent"
          style={{ width: 'calc(4px + var(--odig) * 120px)', opacity: 'calc(0.25 + var(--odig) * 0.55)' }}
        />
      </div>

      {/* KPI row — three cells */}
      <div className="grid grid-cols-3 gap-2.5">
        {(['income', 'expense', 'net'] as const).map((key, i) => (
          <Cell key={key} rise={i}>
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ash-dim">
              {key === 'income' ? 'Income' : key === 'expense' ? 'Expense' : 'Net'}
            </p>
            <p
              className={clsx(
                'tnum mt-1.5 text-[0.9375rem] font-semibold leading-none',
                key === 'income' && 'text-moss',
                key === 'expense' && 'text-clay',
                key === 'net' && 'text-bone',
              )}
            >
              {key === 'income' ? '₹8,46,000' : key === 'expense' ? '₹7,32,800' : '₹1,13,200'}
            </p>
          </Cell>
        ))}
      </div>

      {/* chart + ledger — the remaining three cells */}
      <div className="grid grid-cols-5 gap-2.5">
        <Cell rise={1} className="col-span-3">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ash-dim">Expense split</p>
          <svg viewBox="0 0 100 44" aria-hidden className="mt-2.5 h-11 w-full">
            {[
              { x: 5, h: 32 },
              { x: 30, h: 6 },
              { x: 55, h: 11 },
              { x: 80, h: 5 },
            ].map((bar) => (
              <rect key={bar.x} x={bar.x} y={38 - bar.h} width={15} height={bar.h} rx={1.5} fill="var(--color-clay)" opacity={0.34} />
            ))}
            <line x1="0" y1="38.5" x2="100" y2="38.5" stroke="var(--color-hairline)" strokeWidth="1" />
            <polyline
              points="12,20 37,13 62,16 87,7"
              fill="none"
              stroke="var(--color-yolk-400)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Cell>
        <Cell rise={2} className="col-span-2">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ash-dim">The book</p>
          <div className="mt-1.5 space-y-1.5">
            {[
              { k: 'Trader balance', v: '₹2,69,300', tone: 'text-steel' },
              { k: 'Stock value', v: '₹14,24,560', tone: 'text-bone' },
            ].map((row) => (
              <div key={row.k} className="flex items-baseline justify-between gap-2">
                <span className="text-[0.5625rem] uppercase tracking-[0.1em] text-ash-dim">{row.k}</span>
                <span className={clsx('tnum text-[0.75rem] font-semibold', row.tone)}>{row.v}</span>
              </div>
            ))}
          </div>
        </Cell>
      </div>
    </div>
  );
}

export function CompanyStory() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const animate = !reduced && !coarse;
  const [progressRef, progress] = useScrollProgress<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);

  // The only per-frame work: write custom properties onto the stage. The scene
  // subtree is static markup driven entirely by CSS calc() over these vars.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !animate) return;
    const p = phase(progress, 0.3, 0.68);
    const e = p * p * (3 - 2 * p);
    stage.style.setProperty('--p', e.toFixed(4));
    stage.style.setProperty('--ophy', clamp(1.02 - e * 1.75).toFixed(4));
    stage.style.setProperty('--odig', clamp((e - 0.42) / 0.58).toFixed(4));
    stage.style.setProperty('--osc', e > 0.12 && e < 0.9 ? Math.sin(Math.PI * ((e - 0.12) / 0.78)).toFixed(4) : '0');
    stage.style.setProperty('--ps', clamp((e - 0.06) / 0.8).toFixed(4));
  }, [progress, animate]);

  return (
    <Section id="story">
      <Glow from="rgba(239,169,58,0.10)" className="left-1/2 top-16 h-[40vh] -translate-x-1/2" />

      <div className="grid items-center gap-10 lg:grid-cols-12">
        {/* the company, in plain words */}
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="bone">The company</Eyebrow>
            <Display size="lg" className="mt-6">
              Built from the poultry business, for the poultry business.
            </Display>
            <Lede className="mt-6 max-w-[42ch]">
              Amrut Poultry Solutions focuses on solving the operational and financial complexity that comes with
              running a modern poultry business.
            </Lede>
          </Reveal>

          <Reveal delay={140} className="mt-10">
            <div className="space-y-5">
              {FRAMING.map((line) => (
                <div key={line} className="flex gap-4">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yolk-500/70" />
                  <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-ash">{line}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* the stage: sticky while the track travels */}
        <div className="lg:col-span-7">
          <div ref={animate ? progressRef : undefined}>
            <div className={clsx(animate && 'relative h-[170svh] sm:h-[185svh]')}>
              <div className={clsx('inset-x-0', animate ? 'sticky top-0 flex h-[100svh] items-center' : 'relative')}>
                <div
                  ref={stageRef}
                  className="stage w-full"
                  style={(animate ? ORIGIN : FINAL) as CSSProperties}
                >
                  <div className="d3 relative mx-auto h-[clamp(360px,52svh,520px)] w-full">
                    {/* the board: tilted physical → flat digital as --p runs 0→1 */}
                    <div
                      className="d3 absolute inset-0"
                      style={{
                        transform:
                          'perspective(1500px) rotateX(calc(54deg - var(--p) * 52deg)) rotateZ(calc(-38deg + var(--p) * 38deg)) translate3d(0, calc(var(--p) * -16px), calc(var(--p) * 70px))',
                      }}
                    >
                      <PhysicalField />
                      <DigitalSlab />
                    </div>

                    {/* the scan line sweeps across as the physical layer converts */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div
                        className="absolute bottom-[6%] top-[6%] w-[2px] bg-gradient-to-b from-transparent via-yolk-300 to-transparent"
                        style={{ left: 'calc(5% + var(--ps) * 90%)', opacity: 'var(--osc)' }}
                      />
                      <div
                        className="absolute bottom-[6%] top-[6%] w-14 -translate-x-1/2 blur-[14px]"
                        style={{
                          left: 'calc(5% + var(--ps) * 90%)',
                          opacity: 'calc(var(--osc) * 0.55)',
                          background: 'linear-gradient(90deg, transparent, rgba(239,169,58,0.35), transparent)',
                        }}
                      />
                    </div>
                  </div>

                  {/* the two ends, named */}
                  <div className="mx-auto mt-6 flex w-full max-w-[520px] items-center px-1">
                    <span
                      className="text-[0.5625rem] font-semibold uppercase tracking-[0.28em] text-ash"
                      style={{ opacity: 'calc(0.18 + var(--ophy) * 0.82)' }}
                    >
                      Physical
                    </span>
                    <span aria-hidden className="mx-4 h-px flex-1 bg-gradient-to-r from-hairline via-hairline-bright to-hairline" />
                    <span
                      className="text-[0.5625rem] font-semibold uppercase tracking-[0.28em] text-yolk-300"
                      style={{ opacity: 'calc(0.18 + var(--odig) * 0.82)' }}
                    >
                      Digital
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
