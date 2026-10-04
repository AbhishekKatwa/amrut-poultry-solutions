import { type CSSProperties, useMemo } from 'react';
import { BRAND, PIPELINE } from '@/lib/content';
import { lerp, phase, useCoarsePointer, useMediaQuery, usePrefersReducedMotion, useScrollProgress } from '@/lib/motion';
import { Reveal } from '@/components/ui/Reveal';
import { Divider, Glow, Rule } from '@/components/ui/Surface';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';
import { Section } from '@/components/layout/Section';

/** The six business systems arranged around the company. `Farm` is where the data starts, so it opens the chain. */
const NODES: string[] = PIPELINE.slice(1);
const RING_R = 40;
const INNER_R = 21;

type Point = { x: number; y: number };

/** A point on the plane, in percentages of the square stage. */
function onRing(radius: number, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

/** Custom properties the scene reads from — scroll writes these, never per-frame state in children. */
type SceneVars = CSSProperties & { '--tilt': string; '--spread': string };

/** A hairline card standing off the plane, labelled with its place in the chain. */
function OrbitNode({
  label,
  order,
  point,
  lift,
}: {
  label: string;
  order: number;
  point: Point;
  lift: number;
}) {
  const style = {
    left: `calc(50% + ${(point.x - 50).toFixed(3)} * var(--spread) * 1%)`,
    top: `calc(50% + ${(point.y - 50).toFixed(3)} * var(--spread) * 1%)`,
    '--lift': `${lift}px`,
    transform:
      'translate(-50%, -50%) translateZ(var(--lift)) rotateX(calc(-1 * var(--tilt)))',
  } as CSSProperties;

  return (
    <div className="absolute d3" style={style}>
      <div className="flex items-baseline gap-2 whitespace-nowrap rounded-panel border border-hairline bg-night-850/95 px-3 py-2 shadow-[0_16px_30px_-22px_rgba(0,0,0,0.95)] backdrop-blur-sm">
        <span className="tnum text-[0.5625rem] font-semibold text-yolk-500/70">
          {String(order).padStart(2, '0')}
        </span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-bone">{label}</span>
      </div>
    </div>
  );
}

/** The tilted system plate: rings, spokes and pulses drawn in the plane, cards standing off it. */
function SystemPlate() {
  const nodes = useMemo(
    () => NODES.map((label, i) => ({ label, order: i + 2, point: onRing(RING_R, -90 + i * 60) })),
    [],
  );
  const product = onRing(INNER_R, 90);

  return (
    <div className="relative mx-auto aspect-square w-[min(100%,620px)]">
      {/* the plane itself */}
      <div
        className="absolute inset-0 d3"
        style={{
          transform: 'rotateX(var(--tilt))',
          transition: 'transform 220ms linear',
        }}
      >
        {/* floor light + rings + spokes */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <radialGradient id="eco-floor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(217,164,65,0.16)" />
              <stop offset="60%" stopColor="rgba(217,164,65,0.04)" />
              <stop offset="100%" stopColor="rgba(217,164,65,0)" />
            </radialGradient>
          </defs>

          <circle cx="50" cy="50" r="46" fill="url(#eco-floor)" />
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            stroke="#356B54"
            strokeWidth="1"
            strokeDasharray="2 5"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="50"
            cy="50"
            r={INNER_R}
            fill="none"
            stroke="#356B54"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
    />

    {nodes.map((node) => (
            <g key={node.label}>
              {/* the static spoke: node → the business in the middle */}
              <line
                x1={node.point.x}
                y1={node.point.y}
                x2="50"
                y2="50"
                stroke="#2C5A48"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* the pulse travelling along it */}
              <line
                x1={node.point.x}
                y1={node.point.y}
                x2="50"
                y2="50"
                stroke="#D9A441"
                strokeWidth="1"
                strokeDasharray="1.5 11"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="animate-dash opacity-70"
              />
              <circle cx={node.point.x} cy={node.point.y} r="0.9" fill="#D9A441" opacity="0.6" />
            </g>
          ))}
          <circle cx="50" cy="50" r="1.4" fill="#E0B04B" />
        </svg>

        {/* centre: the company */}
        <div
          className="absolute d3"
          style={
            {
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) translateZ(26px) rotateX(calc(-1 * var(--tilt)))',
            } as CSSProperties
          }
        >
          <div className="rounded-full border border-hairline bg-night-900/90 px-4 py-2 text-center shadow-[0_20px_40px_-26px_rgba(0,0,0,0.95)]">
            <p className="whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-yolk-300">
              {BRAND.company}
            </p>
          </div>
        </div>

        {/* inner orbit: the product that carries the record */}
        <div
          className="absolute d3"
          style={
            {
              left: `calc(50% + ${(product.x - 50).toFixed(3)} * var(--spread) * 1%)`,
              top: `calc(50% + ${(product.y - 50).toFixed(3)} * var(--spread) * 1%)`,
              transform: 'translate(-50%, -50%) translateZ(44px) rotateX(calc(-1 * var(--tilt)))',
            } as CSSProperties
          }
        >
          <div className="rounded-panel border border-yolk-500/40 bg-night-800/95 px-3.5 py-2.5 text-center rim-amber">
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-ash-dim">The product</p>
            <p className="mt-1 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bone">
              {BRAND.product}
            </p>
          </div>
        </div>

        {nodes.map((node, i) => (
          <OrbitNode
            key={node.label}
            label={node.label}
            order={node.order}
            point={node.point}
            lift={20 + (i % 3) * 12}
          />
        ))}
      </div>
    </div>
  );
}

/** Narrow screens: the same ring unrolled into a readable vertical chain. */
function SystemChain() {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="flex items-center justify-center gap-3">
        <Eyebrow tone="amber" className="justify-center">
          {BRAND.product}
        </Eyebrow>
      </div>

      <ol className="mt-5">
        {PIPELINE.map((label, i) => (
          <li key={label}>
            <div className="flex items-center justify-between gap-3 rounded-panel border border-hairline bg-night-850/90 px-4 py-3">
              <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-bone">{label}</span>
              <span className="tnum text-[0.625rem] font-semibold text-yolk-500/70">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            {i < PIPELINE.length - 1 ? (
              <div className="flex justify-center">
                <svg viewBox="0 0 4 26" aria-hidden className="h-6 w-1">
                  <line x1="2" y1="0" x2="2" y2="26" stroke="#2C5A48" strokeWidth="1" />
                  <line
                    x1="2"
                    y1="0"
                    x2="2"
                    y2="26"
                    stroke="#D9A441"
                    strokeWidth="1"
                    strokeDasharray="1.5 7"
                    className="animate-dash opacity-75"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-center text-[0.6875rem] uppercase tracking-[0.18em] text-ash-dim">
        One record · {BRAND.company}
      </p>
    </div>
  );
}

export function Ecosystem() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const still = reduced || coarse;
  const wide = useMediaQuery('(min-width: 780px)', true);
  const [ref, progress] = useScrollProgress<HTMLDivElement>();

  // Scroll writes two numbers into CSS; the scene's transforms read them from there.
  const tilt = still ? 57 : lerp(61.5, 50, phase(progress, 0.12, 0.8));
  const spread = still ? 1 : lerp(0.84, 1.05, phase(progress, 0.1, 0.74));
  const vars = { '--tilt': `${tilt.toFixed(2)}deg`, '--spread': spread.toFixed(4) } as SceneVars;

  return (
    <Section id="how-it-works" container={false} className="border-t border-hairline bg-night-950">
      <div ref={ref} className="relative isolate">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-20 rule-grid opacity-60" />
        <Glow from="rgba(217,164,65,0.2)" className="absolute inset-x-0 top-1/4 -z-20 h-[60vh]" />

        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
          <div className="mx-auto max-w-[54rem] text-center">
            <Reveal direction="fade">
              <Eyebrow className="justify-center">The Amrut Ecosystem</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <Display size="lg" className="mt-6">
                From farm activity to business intelligence.
              </Display>
            </Reveal>
            <Reveal delay={160}>
              <Lede className="mx-auto mt-6 max-w-[46ch]">One connected view of the poultry business.</Lede>
            </Reveal>
          </div>

          <Reveal delay={120} direction="scale" className="mt-10 sm:mt-14">
            <div className="stage relative" style={vars}>
              {wide ? <SystemPlate /> : <SystemChain />}

              {wide ? (
                <div className="mx-auto mt-4 flex max-w-[52rem] flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[0.6875rem] uppercase tracking-[0.18em] text-ash-dim">
                  <span className="inline-flex items-center gap-2">
                    <i aria-hidden className="h-1.5 w-1.5 rounded-full bg-yolk-400" />
                    The product holds the record
                  </span>
                  <Divider className="h-3" />
                  <span className="inline-flex items-center gap-2">
                    <i aria-hidden className="h-1.5 w-8 bg-hairline-bright" />
                    Each system reads the same data
                  </span>
                  <Divider className="h-3" />
                  <span>Amrut Poultry Solutions</span>
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-14 sm:mt-20">
            <div className="mx-auto max-w-[64rem]">
              <Rule />
              <div className="grid gap-8 pt-9 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                  <Eyebrow tone="bone">What "connected" means here</Eyebrow>
                </div>
                <div className="md:col-span-7">
                  <p className="text-[clamp(1.0625rem,1.7vw,1.3125rem)] leading-relaxed text-bone">
                    One record, two answers. The load of eggs you bill is income for the period, a balance on the
                    trader’s account and a line in the farm’s P&L at the same moment.
                  </p>
                  <p className="mt-5 max-w-[58ch] text-sub leading-relaxed text-ash">
                    Ask it as an operations question and the answer is already there; ask it as a money question and it
                    comes from the same entry. Nothing has to be reconciled by hand.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
