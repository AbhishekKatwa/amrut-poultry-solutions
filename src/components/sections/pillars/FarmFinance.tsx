import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { SAMPLE } from '@/lib/content';
import { inr, signed } from '@/lib/format';
import { useCountUp, useInView, usePrefersReducedMotion } from '@/lib/motion';
import { Reveal } from '@/components/ui/Reveal';
import { SampleFlag } from '@/components/ui/DeviceFrame';
import { Glow, Panel, Rule, StatLine } from '@/components/ui/Surface';
import { Eyebrow, Metric } from '@/components/ui/Type';
import { PillarShell } from './PillarShell';

/** The scale every money bar in this section is drawn against: the larger of income or expense. */
const SCALE = Math.max(SAMPLE.pnl.income, SAMPLE.pnl.expense);

/** One labelled figure on that scale, growing from the left when the panel is revealed. */
function MoneyBar({
  label,
  value,
  shown,
  active,
  reduced,
  tone,
  delay,
  hint,
}: {
  label: string;
  value: number;
  shown: number;
  active: boolean;
  reduced: boolean;
  tone: 'moss' | 'clay';
  delay: number;
  hint?: string;
}) {
  const pct = (value / SCALE) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">{label}</span>
          {hint ? <span className="truncate text-[0.6875rem] text-ash-dim/80">{hint}</span> : null}
        </span>
        <span
          className={clsx(
            'tnum shrink-0 text-[1.0625rem] font-semibold sm:text-[1.25rem]',
            tone === 'moss' ? 'text-moss' : 'text-clay',
          )}
        >
          {inr(shown)}
        </span>
      </div>

      <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-night-900/90 ring-1 ring-hairline">
        <div
          className={clsx(
            'h-full rounded-full',
            tone === 'moss' ? 'bg-gradient-to-r from-moss-deep to-moss' : 'bg-gradient-to-r from-clay/75 to-clay',
          )}
          style={{
            width: `${pct}%`,
            transform: active ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: reduced ? undefined : `transform 1100ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

/** Income and expense for the period, on one scale, so the two bars are comparable at a glance. */
function PeriodLedger() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;

  const shownIncome = useCountUp(SAMPLE.pnl.income, active, 1400);
  const shownExpense = useCountUp(SAMPLE.pnl.expense, active, 1400);

  return (
    <div ref={ref} className="d3 relative">
      <Glow from="rgba(217,164,65,0.12)" className="left-1/2 top-0 h-[240px] w-[440px] -translate-x-1/2" />

      <Panel className="relative" padded>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="bone">One period on the ledger</Eyebrow>
          <SampleFlag />
        </div>

        <div className="mt-6 space-y-6">
          <MoneyBar
            label="Income"
            hint="billed in the period"
            value={SAMPLE.pnl.income}
            shown={shownIncome}
            active={active}
            reduced={reduced}
            tone="moss"
            delay={80}
          />
          <MoneyBar
            label="Expense"
            hint="incurred in the period"
            value={SAMPLE.pnl.expense}
            shown={shownExpense}
            active={active}
            reduced={reduced}
            tone="clay"
            delay={220}
          />
        </div>

        <Rule className="mt-7" />

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Metric
            value={signed(SAMPLE.pnl.net)}
            tone="amber"
            size="md"
            hint="Income less expense, exactly as the ledger records it"
          />
          <p className="max-w-[22ch] text-right text-[0.75rem] leading-relaxed text-ash-dim">
            Both land on the same dated record — nothing is parked in a separate book.
          </p>
        </div>
      </Panel>
    </div>
  );
}

/** One direction of cash movement: a figure, a thin rail and a travelling pulse. */
function Flow({
  direction,
  label,
  value,
}: {
  direction: 'in' | 'out';
  label: string;
  value: string;
}) {
  const Icon = direction === 'in' ? ArrowDownLeft : ArrowUpRight;
  return (
    <div className="min-w-0">
      <span className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ash-dim">
        <Icon size={13} className={direction === 'in' ? 'text-yolk-400' : 'text-ash'} />
        {label}
      </span>
      <p className="tnum mt-1.5 text-[1.125rem] font-semibold text-bone sm:text-[1.25rem]">{value}</p>
      <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden className="mt-2.5 h-1 w-full">
        <line x1="0" y1="2" x2="100" y2="2" stroke="#2C5A48" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line
          x1={direction === 'in' ? '100' : '0'}
          y1="2"
          x2={direction === 'in' ? '0' : '100'}
          y2="2"
          stroke="#D9A441"
          strokeWidth="1"
          strokeDasharray="1.5 10"
          vectorEffect="non-scaling-stroke"
          className="animate-dash opacity-80"
        />
      </svg>
    </div>
  );
}

/** What actually left and entered the till — a different question from what was billed. */
function CashMovement() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;
  const shownIn = useCountUp(SAMPLE.cash.in, active, 1300);
  const shownOut = useCountUp(SAMPLE.cash.out, active, 1300);

  return (
    <div ref={ref}>
      <Panel tone="sunken" className="h-full">
        <Eyebrow tone="bone">Cash movement</Eyebrow>

        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
          <Flow direction="in" label="Cash in" value={inr(shownIn)} />
          <Flow direction="out" label="Cash out" value={inr(shownOut)} />
        </div>

        <p className="mt-3 text-[0.6875rem] leading-relaxed text-ash-dim">
          Includes payments to suppliers for what the godown bought in, and what the farm paid out to keep running.
        </p>

        <Rule className="mt-6" />

        <div className="mt-2">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">Where it sits</p>
          <div className="mt-1">
            {SAMPLE.cash.pockets.map((pocket) => (
              <StatLine key={pocket.name} label={pocket.name} value={inr(pocket.amount)} tone="bone" />
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

/** Billed but unsettled: the receivable side of the trader ledger. */
function ReceivableColumn() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;
  const shownTotal = useCountUp(SAMPLE.trader.receivableTotal, active, 1300);
  const open = SAMPLE.trader.receivables.filter((trader) => trader.balance > 0);

  return (
    <div ref={ref}>
      <Panel tone="sunken" className="h-full">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow tone="steel">Receivable</Eyebrow>
          <SampleFlag />
        </div>

        <Metric
          className="mt-4"
          value={inr(shownTotal)}
          tone="steel"
          size="sm"
          hint="Sold to traders, not yet paid"
        />

        <Rule className="mt-5" />

        <ul className="mt-4 space-y-3">
          {open.map((trader) => {
            const pct = (trader.balance / SAMPLE.trader.receivableTotal) * 100;
            return (
              <li key={trader.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[0.75rem] text-ash">{trader.name}</span>
                  <span className="tnum shrink-0 text-[0.75rem] font-semibold text-bone">{inr(trader.balance)}</span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-night-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-steel/60 to-steel"
                    style={{
                      width: `${pct}%`,
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: reduced ? undefined : 'transform 900ms cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

export function FarmFinance() {
  return (
    <PillarShell
      id="finance"
      index="04"
      kicker="Farm Finance"
      headline="Know where the money goes."
      lede={
        'Income, expense and every payment land on one dated ledger, so the farm’s money story is read from the ' +
        'records themselves — not rebuilt from a notebook at the end of the month.'
      }
      foot={
        <Reveal delay={200}>
          <div className="border-t border-hairline pt-5">
            <p className="max-w-[46ch] text-[0.8125rem] leading-relaxed text-ash-dim">
              Money received is not income billed: cash in is what reached the till, income is what the period earned.
              The ledger keeps them as separate rows, so a payment settles a balance instead of quietly becoming profit.
            </p>
          </div>
        </Reveal>
      }
    >
      <PeriodLedger />

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <CashMovement />
        <ReceivableColumn />
      </div>
    </PillarShell>
  );
}
