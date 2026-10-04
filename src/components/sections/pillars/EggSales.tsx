import { useMemo } from 'react';
import clsx from 'clsx';
import { SAMPLE } from '@/lib/content';
import { num } from '@/lib/format';
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
import { PillarShell } from './PillarShell';

const EGGS_PER_TRAY = 24;
const TRAY_COLS = 6;

/** One egg: a small sphere lit from the upper left. Abstract, never cartoonish. */
function Egg({ index }: { index: number }) {
  const tone = ((index % 5) - 2) * 0.04;
  return (
    <span
      aria-hidden
      className="block w-full"
      style={{
        aspectRatio: '0.82',
        borderRadius: '50% 50% 46% 46% / 62% 62% 40% 40%',
        background: `radial-gradient(34% 28% at 31% 24%, rgba(255,250,236,0.98), rgba(248,228,190,0.94) 36%, rgba(214,176,110,${0.52 + tone}) 74%, rgba(38,30,19,0.74))`,
        boxShadow: 'inset -1px -2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.55)',
      }}
    />
  );
}

/** A tray lying in the plane, lifting on reveal. */
function Tray({
  lift,
  active,
  delay,
  reduced,
  dim = false,
}: {
  lift: number;
  active: boolean;
  delay: number;
  reduced: boolean;
  dim?: boolean;
}) {
  const eggs = useMemo(
    () => Array.from({ length: EGGS_PER_TRAY }, (_, i) => i),
    [],
  );
  return (
    <div
      className="relative rounded-[12px] ring-1 ring-hairline/80"
      style={{
        background: 'linear-gradient(155deg, rgba(22,58,42,0.96), rgba(8,26,19,0.94))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 34px -22px rgba(0,0,0,0.9)',
        transform: active ? `translateZ(${lift}px)` : 'translateZ(-72px)',
        opacity: active ? (dim ? 0.78 : 1) : 0,
        transition: reduced
          ? undefined
          : `transform 1100ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 800ms ease ${delay}ms`,
      }}
    >
      <div className="grid grid-cols-6 gap-[3px] p-[7px] sm:gap-1.5 sm:p-2.5">
        {eggs.map((i) => (
          <Egg key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

/** The diorama: trays laid out in perspective, coming up off the floor. */
function TrayScene() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.22 });
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const wide = useMediaQuery('(min-width: 640px)', true);
  const pointer = usePointerOffset({ disabled: reduced || coarse });
  const still = reduced || coarse;
  const active = still || inView;

  const baseX = wide ? 56 : 44;
  const baseZ = wide ? -22 : -11;
  const rotX = still ? baseX : baseX - pointer.y * 3;
  const rotZ = still ? baseZ : baseZ + pointer.x * 2.4;

  return (
    <div ref={ref} className="d3 relative pb-1">
      <Glow from="rgba(217,164,65,0.16)" className="left-1/2 top-6 h-[300px] w-[520px] -translate-x-1/2" />

      <div className="d3 relative h-[172px] sm:h-[212px] lg:h-[252px]">
        <div
          className="d3 absolute inset-x-[-2%] top-1/2 grid grid-cols-3 gap-2.5 sm:gap-4"
          style={{
            transform: `translateY(-50%) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`,
            transition: still ? undefined : 'transform 200ms linear',
          }}
        >
          <Tray lift={0} active={active} delay={0} reduced={still} />
          <Tray lift={26} active={active} delay={130} reduced={still} />
          <Tray lift={52} active={active} delay={260} reduced={still} dim />
        </div>

        {/* the floor the trays rest on */}
        <div
          aria-hidden
          className="d3 absolute inset-x-[6%] top-1/2 h-[120px] -translate-y-1/2 rounded-[50%] opacity-70 blur-2xl"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(217,164,65,0.14), transparent 70%)',
            transform: `translateY(-50%) rotateX(${baseX}deg)`,
          }}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Tag tone="amber">Egg stock</Tag>
        <Tag tone="steel">Bookings</Tag>
        <span className="text-[0.6875rem] text-ash-dim">
          Collected today, held in stock, already promised — one record.
        </span>
      </div>
    </div>
  );
}

function MathRow({
  op,
  label,
  value,
  note,
  strong = false,
  muted = false,
}: {
  op: '+' | '−' | '=';
  label: string;
  value: number;
  note?: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <span className="flex min-w-0 items-baseline gap-2.5">
        <span
          aria-hidden
          className={clsx(
            'tnum w-3 shrink-0 text-[0.9375rem] font-semibold',
            op === '−' ? 'text-clay' : 'text-ash-dim',
          )}
        >
          {op}
        </span>
        <span className={clsx('truncate text-[0.8125rem]', muted ? 'text-ash-dim' : 'text-ash')}>{label}</span>
        {note ? (
          <span className="shrink-0 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-steel/75">
            {note}
          </span>
        ) : null}
      </span>
      <span
        className={clsx(
          'tnum shrink-0 font-semibold',
          strong ? 'text-[1.125rem] text-bone' : 'text-[0.9375rem]',
          !strong && (muted ? 'text-steel' : 'text-bone'),
        )}
      >
        {num(value)}
      </span>
    </div>
  );
}

/** The arithmetic the planner runs: stock + expected lay − what is booked. */
function SellableMath() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;
  const counted = useCountUp(SAMPLE.eggs.available, active, 1300);
  const expected = SAMPLE.eggs.stock + SAMPLE.eggs.projected;

  return (
    <div
      ref={ref}
      className="rim relative mt-9 rounded-card bg-night-800/85 p-5 ring-1 ring-hairline sm:p-7"
    >
      <div className="flex items-center justify-between gap-4">
        <Eyebrow tone="bone">The calculation, in the open</Eyebrow>
        <SampleFlag />
      </div>

      <div className="mt-4">
        <MathRow label="Current egg stock" op="+" value={SAMPLE.eggs.stock} />
        <MathRow label="Projected production" op="+" value={SAMPLE.eggs.projected} note="expected lay" />
        <MathRow label="Stock plus expected lay" op="=" value={expected} muted />
        <Rule className="my-1.5" />
        <MathRow label="Booked eggs" op="−" value={SAMPLE.eggs.booked} note="already committed" muted />
      </div>

      <Rule className="mt-3" />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <Metric
          value={num(counted)}
          unit="eggs"
          tone="amber"
          size="lg"
          hint="Available eggs — what can actually be sold"
        />
        <p className="max-w-[24ch] text-right text-[0.75rem] leading-relaxed text-ash-dim">
          Booked load stays booked. This is the room left after it.
        </p>
      </div>
    </div>
  );
}

export function EggSales() {
  return (
    <PillarShell
      id="egg-sales"
      index="01"
      kicker="Egg Sales & Planning"
      headline="Know what you can sell."
      lede={
        'Current stock plus expected lay, minus every egg already committed — the planner hands you the ' +
        'one number worth selling against, before a single tray leaves the farm.'
      }
      foot={
        <Reveal delay={200}>
          <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
            <span className="text-[0.75rem] text-ash-dim">Daily collections and booked loads feed the same figure.</span>
          </div>
        </Reveal>
      }
    >
      <div className="d3 relative">
        <TrayScene />
        <SellableMath />
      </div>
    </PillarShell>
  );
}
