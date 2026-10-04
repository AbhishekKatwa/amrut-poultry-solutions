import clsx from 'clsx';
import { SAMPLE } from '@/lib/content';
import { inr, signed } from '@/lib/format';
import { useCountUp, useInView, usePrefersReducedMotion } from '@/lib/motion';
import { Reveal } from '@/components/ui/Reveal';
import { SampleFlag } from '@/components/ui/DeviceFrame';
import { Glow, Panel, Rule } from '@/components/ui/Surface';
import { Eyebrow } from '@/components/ui/Type';
import { PillarShell } from './PillarShell';

const { eggSales, otherIncome, income, feed, medicine, operations, otherExpense, expense, net } = SAMPLE.pnl;

/** Every bar in the equation is drawn against revenue, so widths and sums agree. */
const SCALE = income;

type Part = { label: string; value: number; fill: string; dot: string };

const INCOME_PARTS: Part[] = [
  { label: 'Egg sales', value: eggSales, fill: 'bg-moss', dot: 'bg-moss' },
  { label: 'Other income', value: otherIncome, fill: 'bg-moss-deep', dot: 'bg-moss-deep' },
];

const EXPENSE_PARTS: Part[] = [
  { label: 'Feed', value: feed, fill: 'bg-clay', dot: 'bg-clay' },
  { label: 'Medicine', value: medicine, fill: 'bg-clay/75', dot: 'bg-clay/75' },
  { label: 'Operations', value: operations, fill: 'bg-clay/55', dot: 'bg-clay/55' },
  { label: 'Other expenses', value: otherExpense, fill: 'bg-clay/35', dot: 'bg-clay/35' },
];

/** A recessed figure: deliberately quieter than the net line it feeds. */
function RecessedFigure({
  label,
  value,
  tone,
  active,
  reduced,
  className,
}: {
  label: string;
  value: string;
  tone: 'moss' | 'clay';
  active: boolean;
  reduced: boolean;
  className?: string;
}) {
  return (
    <Panel
      tone="sunken"
      padded={false}
      className={clsx('d3 p-4 sm:p-5', className)}
    >
      <div
        style={{
          transform: active ? 'translateZ(-34px)' : 'translateZ(-72px)',
          opacity: active ? 1 : 0.35,
          transition: reduced ? undefined : 'transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 700ms ease',
        }}
      >
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">{label}</p>
        <p
          className={clsx(
            'tnum mt-2 text-[clamp(1.125rem,2.1vw,1.5rem)] font-semibold leading-none tracking-[-0.03em]',
            tone === 'moss' ? 'text-moss' : 'text-clay',
          )}
        >
          {value}
        </p>
      </div>
    </Panel>
  );
}

/** The number the whole section exists to produce. */
function NetFigure({ value, active, reduced }: { value: string; active: boolean; reduced: boolean }) {
  const margin = ((net / income) * 100).toFixed(1);
  return (
    <div className="relative d3 h-full rounded-card bg-night-800 p-5 ring-1 ring-yolk-500/35 rim-amber sm:p-7">
      <Glow from="rgba(217,164,65,0.26)" className="left-1/2 top-1/2 h-[200px] w-[112%] -translate-x-1/2 -translate-y-1/2" />
      <div
        style={{
          transform: active ? 'translateZ(38px)' : 'translateZ(0)',
          opacity: active ? 1 : 0,
          transition: reduced ? undefined : 'transform 1000ms cubic-bezier(0.16,1,0.3,1), opacity 800ms ease',
        }}
      >
        <Eyebrow tone="amber">Net P&amp;L</Eyebrow>
        <p className="tnum mt-3.5 text-[clamp(2.375rem,6.4vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-yolk-300">
          {value}
        </p>
        <p className="mt-3.5 text-[0.8125rem] text-ash">
          For the period — <span className="tnum text-bone">{margin}%</span> of revenue kept.
        </p>
      </div>
    </div>
  );
}

/** One name-and-value term of the equation, dotted with the colour of its bar segment. */
function TermChip({ op, part }: { op: '+' | '−'; part: Part }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-control border border-hairline bg-night-850/80 px-3 py-2">
      <span aria-hidden className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', part.dot)} />
      <span aria-hidden className="tnum w-2 shrink-0 text-[0.8125rem] font-semibold text-ash-dim">
        {op}
      </span>
      <span className="whitespace-nowrap text-[0.75rem] text-ash">{part.label}</span>
      <span className="tnum text-[0.8125rem] font-semibold text-bone">{inr(part.value)}</span>
    </span>
  );
}

/** A proportional bar: stacked segments on the revenue scale, growing left to right on reveal. */
function ProportionalBar({
  label,
  parts,
  total,
  shown,
  tone,
  active,
  reduced,
  delayBase = 0,
}: {
  label: string;
  parts: Part[];
  total: number;
  shown: number;
  tone: 'moss' | 'clay' | 'amber';
  active: boolean;
  reduced: boolean;
  delayBase?: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">{label}</span>
        <span
          className={clsx(
            'tnum text-[1.0625rem] font-semibold sm:text-[1.25rem]',
            tone === 'moss' && 'text-moss',
            tone === 'clay' && 'text-clay',
            tone === 'amber' && 'text-yolk-300',
          )}
        >
          {inr(shown)}
        </span>
      </div>

      <div className="mt-2 flex h-4 w-full items-stretch overflow-hidden rounded-full bg-night-900/90 ring-1 ring-hairline">
        {parts.map((part, i) => (
          <div
            key={part.label}
            className={clsx('h-full border-r border-night-950/70 last:border-r-0', part.fill)}
            style={{
              width: `${(part.value / SCALE) * 100}%`,
              transform: active ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
              transition: reduced
                ? undefined
                : `transform 900ms cubic-bezier(0.16,1,0.3,1) ${delayBase + i * 110}ms`,
            }}
          />
        ))}
        {tone === 'clay' ? <span className="h-full flex-1" /> : null}
      </div>

      <p className="mt-2 text-[0.6875rem] text-ash-dim">
        {parts.length} recorded {parts.length === 1 ? 'line' : 'lines'} · total {inr(total)}
      </p>
    </div>
  );
}

/** Revenue = expense + net, on one track, so the profit left over is visible as a sliver. */
function NetBar({ active, reduced }: { active: boolean; reduced: boolean }) {
  const segments = [
    { key: 'expense', value: expense, className: 'bg-clay/25', label: 'Expense already counted' },
    { key: 'net', value: net, className: 'bg-gradient-to-r from-yolk-500 to-yolk-300', label: 'Net' },
  ];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-yolk-400">Net P&amp;L</span>
        <span className="tnum text-[1.0625rem] font-semibold text-yolk-300 sm:text-[1.25rem]">{signed(net)}</span>
      </div>
      <div className="mt-2 flex h-5 w-full items-stretch overflow-hidden rounded-full bg-night-900/90 ring-1 ring-hairline">
        {segments.map((segment, i) => (
          <div
            key={segment.key}
            aria-hidden
            title={segment.label}
            className={clsx('h-full', segment.className, i === 0 && 'border-r border-night-950/70')}
            style={{
              width: `${(segment.value / SCALE) * 100}%`,
              transform: active ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
              transition: reduced ? undefined : `transform 1000ms cubic-bezier(0.16,1,0.3,1) ${300 + i * 140}ms`,
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-[0.6875rem] text-ash-dim">
        The amber remainder is what survives the month: {inr(income)} of revenue, {inr(expense)} of cost.
      </p>
    </div>
  );
}

function PnlScene() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const still = reduced;
  const active = still || inView;

  const shownRevenue = useCountUp(income, active, 1500);
  const shownExpense = useCountUp(expense, active, 1500);
  const shownNet = useCountUp(net, active, 1600);

  return (
    <div ref={ref} className="d3 relative">
      <div className="d3 grid gap-4 lg:grid-cols-12 lg:items-stretch">
        <div className="d3 grid grid-cols-2 gap-4 lg:col-span-5">
          <RecessedFigure
            label="Revenue"
            value={inr(shownRevenue)}
            tone="moss"
            active={active}
            reduced={still}
          />
          <RecessedFigure
            label="Expense"
            value={inr(shownExpense)}
            tone="clay"
            active={active}
            reduced={still}
          />
        </div>
        <div className="d3 lg:col-span-7">
          <NetFigure value={signed(shownNet)} active={active} reduced={still} />
        </div>
      </div>

      <Panel className="mt-5" tone="raised">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="bone">The same three numbers, as an equation</Eyebrow>
          <SampleFlag />
        </div>

        <div className="mt-6 space-y-7">
          <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
            <div className="flex flex-wrap items-center gap-2 lg:col-span-5">
              {INCOME_PARTS.map((part) => (
                <TermChip key={part.label} op="+" part={part} />
              ))}
              <span aria-hidden className="tnum text-[0.9375rem] font-semibold text-ash-dim">
                ──
              </span>
            </div>
            <div className="lg:col-span-7">
              <ProportionalBar
                label="Revenue"
                parts={INCOME_PARTS}
                total={income}
                shown={shownRevenue}
                tone="moss"
                active={active}
                reduced={still}
                delayBase={120}
              />
            </div>
          </div>

          <Rule />

          <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
            <div className="flex flex-wrap items-center gap-2 lg:col-span-5">
              {EXPENSE_PARTS.map((part) => (
                <TermChip key={part.label} op="−" part={part} />
              ))}
              <span aria-hidden className="tnum text-[0.9375rem] font-semibold text-ash-dim">
                ──
              </span>
            </div>
            <div className="lg:col-span-7">
              <ProportionalBar
                label="Expense"
                parts={EXPENSE_PARTS}
                total={expense}
                shown={shownExpense}
                tone="clay"
                active={active}
                reduced={still}
                delayBase={260}
              />
            </div>
          </div>

          <Rule />

          <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
            <div className="flex flex-wrap items-center gap-2 lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-control border border-hairline bg-night-850/80 px-3 py-2">
                <span aria-hidden className="tnum w-2 shrink-0 text-[0.8125rem] font-semibold text-yolk-400">
                  =
                </span>
                <span className="whitespace-nowrap text-[0.75rem] text-ash">Revenue less expense</span>
              </span>
            </div>
            <div className="lg:col-span-7">
              <NetBar active={active} reduced={still} />
            </div>
          </div>
        </div>

        <p className="mt-7 flex flex-wrap items-start gap-x-3 gap-y-2 border-t border-hairline pt-5 text-[0.75rem] leading-relaxed text-ash-dim">
          <SampleFlag className="mt-px" />
          <span className="max-w-[52ch]">
            The basis: one month of the sample farm book — income billed and costs incurred inside that month, taken
            from the same ledger the screens write to. Illustrative figures, never a customer’s records.
          </span>
        </p>
      </Panel>
    </div>
  );
}

export function RealPnl() {
  return (
    <PillarShell
      id="pnl"
      index="05"
      kicker="Real Farm P&L"
      headline="Know whether the farm is actually making money."
      lede={
        'Revenue in, cost out, and the difference stated without decoration. The P&L is not a separate opinion — ' +
        'it is read out of the sales, issues and expenses the farm already recorded.'
      }
      foot={
        <Reveal delay={200}>
          <div className="border-t border-hairline pt-5">
            <p className="max-w-[46ch] text-[0.8125rem] leading-relaxed text-ash-dim">
              Feed bought into the godown is stock; feed issued to a shed is that shed’s cost. The period’s expense
              counts it once, and the net figure falls out of the records.
            </p>
          </div>
        </Reveal>
      }
    >
      <PnlScene />
    </PillarShell>
  );
}
