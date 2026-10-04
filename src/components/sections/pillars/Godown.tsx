import { useMemo } from 'react';
import clsx from 'clsx';
import { Boxes, Calculator, Database } from 'lucide-react';
import { SAMPLE } from '@/lib/content';
import { inr, inr2, inrCompact, num } from '@/lib/format';
import {
  useCoarsePointer,
  useCountUp,
  useInView,
  useMediaQuery,
  usePointerOffset,
  usePrefersReducedMotion,
} from '@/lib/motion';
import { Reveal } from '@/components/ui/Reveal';
import { SampleFlag } from '@/components/ui/DeviceFrame';
import { Glow, Rule } from '@/components/ui/Surface';
import { Eyebrow, Metric, Tag } from '@/components/ui/Type';
import { TiltCard } from '@/components/ui/TiltCard';
import { PillarShell } from './PillarShell';

type GodownItem = (typeof SAMPLE.godown.items)[number];

const ITEMS = SAMPLE.godown.items;
const EXTRUDE_STEPS = 5;
const EXTRUDE_GAP = 7;

const MAX_COVERAGE = ITEMS.reduce((max, item) => Math.max(max, item.coverage), 0);
const MIN_COVERAGE = ITEMS.reduce((min, item) => Math.min(min, item.coverage), 0);

/** Slab length is days of coverage, so the tightest shelf is visibly the shortest. */
const lengthOf = (coverage: number) => 26 + (coverage / MAX_COVERAGE) * 74;

function Shelf({
  item,
  tight,
  active,
  delay,
  reduced,
}: {
  item: GodownItem;
  tight: boolean;
  active: boolean;
  delay: number;
  reduced: boolean;
}) {
  const width = `${lengthOf(item.coverage).toFixed(1)}%`;
  const layers = useMemo(() => Array.from({ length: EXTRUDE_STEPS }, (_, i) => i).reverse(), []);

  return (
    <div
      className="d3 relative h-[clamp(30px,4.4vw,42px)] w-full"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateZ(0)' : 'translateZ(-26px)',
        transition: reduced ? undefined : `opacity 700ms ease ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {layers.map((i) => (
        <div
          key={i}
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-[5px] ring-1 ring-hairline/70"
          style={{
            width,
            transform: `translateZ(${-i * EXTRUDE_GAP}px)`,
            background: 'linear-gradient(180deg, rgba(20,28,27,0.9), rgba(8,11,11,0.9))',
          }}
        />
      ))}

      <div
        className={clsx(
          'absolute inset-y-0 left-0 flex items-center justify-between gap-3 rounded-[5px] px-3 ring-1',
          tight ? 'ring-clay/55' : 'ring-hairline-bright/80',
        )}
        style={{
          width,
          background: tight
            ? 'linear-gradient(160deg, rgba(46,24,20,0.96), rgba(12,10,10,0.96))'
            : 'linear-gradient(160deg, rgba(31,42,40,0.97), rgba(10,14,13,0.97))',
          boxShadow: tight
            ? 'inset 0 1px 0 rgba(180,85,63,0.34), 0 16px 30px -22px rgba(0,0,0,0.9)'
            : 'inset 0 1px 0 rgba(255,212,132,0.2), 0 16px 30px -22px rgba(0,0,0,0.9)',
        }}
      >
        <span className={clsx('truncate text-[0.6875rem] font-semibold sm:text-[0.75rem]', tight ? 'text-clay' : 'text-bone')}>
          {item.name}
        </span>
        <span className={clsx('tnum shrink-0 text-[0.625rem] font-semibold sm:text-[0.6875rem]', tight ? 'text-clay/90' : 'text-yolk-300/90')}>
          {inrCompact(item.value)}
        </span>
      </div>
    </div>
  );
}

/** The godown as a volume: uprights, shelves, one amber rim light. */
function GodownRack() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const wide = useMediaQuery('(min-width: 640px)', true);
  const pointer = usePointerOffset({ disabled: reduced || coarse });
  const still = reduced || coarse;
  const active = still || inView;

  const rotY = still || !wide ? -13 : -13 + pointer.x * 3.2;
  const rotX = still || !wide ? 9 : 9 - pointer.y * 2.2;

  return (
    <div ref={ref} className="d3 relative">
      <Glow from="rgba(239,169,58,0.15)" className="left-1/2 top-0 h-[280px] w-[460px] -translate-x-1/2" />

      <div
        className="d3 relative rounded-panel px-3 pb-4 pt-5 sm:px-5"
        style={{
          transform: `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`,
          background: 'linear-gradient(180deg, rgba(14,18,18,0.7), rgba(6,8,8,0.4))',
        }}
      >
        {/* rack uprights */}
        <div aria-hidden className="absolute inset-y-1 left-1 w-px bg-hairline-bright/60 sm:left-2" style={{ transform: 'translateZ(-14px)' }} />
        <div aria-hidden className="absolute inset-y-1 right-1 w-px bg-hairline-bright/60 sm:right-2" style={{ transform: 'translateZ(-14px)' }} />

        <div className="d3 space-y-2.5 sm:space-y-3">
          {ITEMS.map((item, i) => (
            <Shelf
              key={item.name}
              item={item}
              tight={item.coverage === MIN_COVERAGE}
              active={active}
              delay={i * 110}
              reduced={still}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <SampleFlag />
        <p className="text-[0.6875rem] text-ash-dim">
          Slab length is days of coverage — the shortest shelf is the one that runs out first.
        </p>
      </div>
    </div>
  );
}

function StepArrow({ tone }: { tone: 'bone' | 'amber' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className={clsx('h-2 w-8 shrink-0 sm:w-12', tone === 'amber' ? 'text-yolk-500' : 'text-hairline-bright')}
    >
      <line x1="0" y1="4" x2="100" y2="4" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />
    </svg>
  );
}

/** PHYSICAL STOCK → DIGITAL INVENTORY → FINANCIAL VALUE. */
function StockChain() {
  const steps = [
    { label: 'Physical stock', hint: 'Sacks and drums on the shelf', tone: 'bone', icon: Boxes },
    { label: 'Digital inventory', hint: 'Godown entry, batch by batch', tone: 'bone', icon: Database },
    { label: 'Financial value', hint: 'Quantity × average cost', tone: 'amber', icon: Calculator },
  ] as const;

  return (
    <div className="mt-8">
      <p className="mb-3 text-[0.5625rem] font-semibold uppercase tracking-[0.24em] text-ash-dim">From shelf to book</p>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2.5 sm:flex-1 sm:gap-3">
            <div
              className={clsx(
                'flex min-w-0 flex-1 items-center gap-3 rounded-panel px-3.5 py-3 ring-1',
                step.tone === 'amber' ? 'bg-night-800 ring-yolk-500/35 rim-amber' : 'bg-night-900/70 ring-hairline',
              )}
            >
              <step.icon size={16} className={clsx('shrink-0', step.tone === 'amber' ? 'text-yolk-400' : 'text-ash')} />
              <span className="min-w-0">
                <span
                  className={clsx(
                    'block truncate text-[0.6875rem] font-semibold uppercase tracking-[0.14em]',
                    step.tone === 'amber' ? 'text-yolk-300' : 'text-bone',
                  )}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 block truncate text-[0.625rem] text-ash-dim">{step.hint}</span>
              </span>
            </div>
            {i < steps.length - 1 ? <StepArrow tone={i === 1 ? 'amber' : 'bone'} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StockRow({ item, tight }: { item: GodownItem; tight: boolean }) {
  const share = (item.coverage / MAX_COVERAGE) * 100;
  return (
    <div className="border-b border-hairline/70 py-3 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-[0.8125rem] font-medium text-bone">{item.name}</span>
            {tight ? (
              <span className="shrink-0 rounded-full bg-clay/15 px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-clay ring-1 ring-clay/35">
                Tightest shelf
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-[0.6875rem] text-ash-dim">
            {item.qty > 0 ? (
              <span className="tnum">
                {num(item.qty)} kg at {inr2(item.avg)}/kg
              </span>
            ) : (
              'Held at line value'
            )}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className={clsx('tnum block text-[0.875rem] font-semibold', tight ? 'text-clay' : 'text-bone')}>
            {inr(item.value)}
          </span>
          <span className={clsx('tnum block text-[0.6875rem]', tight ? 'text-clay' : 'text-ash-dim')}>
            {item.coverage} days
          </span>
        </span>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-night-700">
        <div
          className={clsx('h-full rounded-full', tight ? 'bg-clay' : 'bg-yolk-500/70')}
          style={{ width: `${share.toFixed(1)}%` }}
        />
      </div>
    </div>
  );
}

/** The same five shelves as a record — quantity, average cost, value, coverage. */
function GodownRecord() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;
  const counted = useCountUp(SAMPLE.godown.stockValue, active, 1400);
  const total = useMemo(() => ITEMS.reduce((sum, item) => sum + item.value, 0), []);

  return (
    <TiltCard className="mt-9" max={5} lift={8} glare={false}>
      <div ref={ref} className="rim rounded-card bg-night-800/85 p-4 ring-1 ring-hairline sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <Eyebrow tone="bone">Godown stock</Eyebrow>
          <SampleFlag />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 border-b border-hairline pb-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ash-dim">
          <span>Item · quantity · average cost</span>
          <span className="text-right">
            Value
            <br />
            Coverage
          </span>
        </div>

        {ITEMS.map((item) => (
          <StockRow key={item.name} item={item} tight={item.coverage === MIN_COVERAGE} />
        ))}

        <Rule className="mt-3" />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Metric
            value={inr(Math.round(counted))}
            tone="amber"
            size="md"
            hint={`Stock value across ${ITEMS.length} godown items`}
          />
          <div className="text-right">
            <p className="text-[0.625rem] uppercase tracking-[0.18em] text-ash-dim">Total inventory</p>
            <p className="tnum mt-1 text-[1.0625rem] font-semibold text-bone">{inrCompact(total)}</p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export function Godown() {
  return (
    <PillarShell
      id="inventory"
      index="03"
      kicker="Inventory"
      headline="Know what your farm owns."
      lede={
        'Maize, soybean, DDGS, layer feed, medicines — the godown holds each item by quantity, average ' +
        'cost and the days of coverage that stock buys you.'
      }
      foot={
        <Reveal delay={180}>
          <div className="border-t border-hairline pt-5">
            <p className="max-w-[46ch] text-[0.8125rem] leading-relaxed text-ash">
              Stock sitting in the godown is inventory. It becomes a shed's expense when it is issued out — never both
              at once.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag tone="amber">Stock coverage</Tag>
              <Tag>Tightest shelf</Tag>
            </div>
          </div>
        </Reveal>
      }
    >
      <div className="d3 relative">
        <GodownRack />
        <StockChain />
        <GodownRecord />
      </div>
    </PillarShell>
  );
}
