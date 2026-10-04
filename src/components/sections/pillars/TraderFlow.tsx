import { useMemo } from 'react';
import clsx from 'clsx';
import { ArrowRightToLine, Wallet } from 'lucide-react';
import { SAMPLE } from '@/lib/content';
import { inr } from '@/lib/format';
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
import { Divider, Glow, Panel, Rule, StatLine } from '@/components/ui/Surface';
import { Eyebrow, Tag } from '@/components/ui/Type';
import { PillarShell } from './PillarShell';

type NodeTone = 'moss' | 'amber' | 'steel' | 'bone';

const TONE_NODE: Record<NodeTone, string> = {
  moss: 'ring-moss/40 from-moss/12',
  amber: 'ring-yolk-500/40 from-yolk-500/12',
  steel: 'ring-steel/40 from-steel/12',
  bone: 'ring-hairline-bright from-bone/8',
};

const TONE_LABEL: Record<NodeTone, string> = {
  moss: 'text-moss',
  amber: 'text-yolk-400',
  steel: 'text-steel',
  bone: 'text-ash',
};

const TONE_TEXT: Record<NodeTone, string> = {
  moss: 'text-moss',
  amber: 'text-yolk-300',
  steel: 'text-steel',
  bone: 'text-bone',
};

/** A single accounting event, standing as its own object. */
function FlowNode({
  label,
  amount,
  tone,
  dominant = false,
  active,
  delay,
  reduced,
}: {
  label: string;
  amount: number;
  tone: NodeTone;
  dominant?: boolean;
  active: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative min-w-0 shrink overflow-hidden rounded-panel bg-gradient-to-b to-night-900/95 px-4 py-3.5 ring-1',
        TONE_NODE[tone],
        dominant ? 'basis-[58%] px-5 py-5 rim-amber sm:basis-[54%]' : 'basis-[40%] sm:basis-[36%]',
      )}
      style={{
        transform: active ? 'translateZ(22px)' : 'translateZ(-30px)',
        opacity: active ? 1 : 0,
        transition: reduced
          ? undefined
          : `transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 650ms ease ${delay}ms`,
      }}
    >
      <p className={clsx('text-[0.5625rem] font-semibold uppercase tracking-[0.2em]', TONE_LABEL[tone])}>{label}</p>
      <p
        className={clsx(
          'tnum mt-2 font-semibold leading-none tracking-[-0.03em]',
          TONE_TEXT[tone],
          dominant
            ? 'text-[clamp(1.5rem,4.2vw,2.5rem)]'
            : 'text-[clamp(1.0625rem,2.4vw,1.5rem)]',
        )}
      >
        {inr(amount)}
      </p>
      {dominant ? (
        <p className="mt-2 text-[0.6875rem] text-ash-dim">Still owed to the farm</p>
      ) : null}
    </div>
  );
}

/** A dashed connector whose dash travels from the event towards the ledger. */
function Connector({ tone }: { tone: 'moss' | 'steel' }) {
  return (
    <div className={clsx('flex min-w-[42px] flex-1 items-center gap-1 self-center', tone === 'moss' ? 'text-moss' : 'text-steel')}>
      <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" className="h-2 min-w-0 flex-1">
        <line
          x1="0"
          y1="4"
          x2="100"
          y2="4"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.8"
          className="animate-dash"
        />
      </svg>
      <svg aria-hidden width="9" height="8" viewBox="0 0 9 8" className="shrink-0">
        <path d="M1 1 7 4 1 7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/** One band = one accounting event. The two bands are never merged. */
function FlowBand({
  step,
  caption,
  tone,
  from,
  to,
  active,
  delay,
  reduced,
  dominant,
  depth,
}: {
  step: string;
  caption: string;
  tone: 'moss' | 'steel';
  from: { label: string; amount: number; tone: NodeTone };
  to: { label: string; amount: number; tone: NodeTone };
  active: boolean;
  delay: number;
  reduced: boolean;
  dominant?: boolean;
  depth: number;
}) {
  return (
    <div
      className="d3 relative"
      style={{
        transform: `translateZ(${-depth}px)`,
        opacity: active ? 1 : 0,
        transition: reduced ? undefined : `opacity 800ms ease ${delay}ms`,
      }}
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <span className="tnum text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-ash-dim">{step}</span>
        <Divider className="h-3" />
        <span className="text-[0.6875rem] text-ash">{caption}</span>
      </div>

      <div className="d3 flex items-stretch gap-1.5 rounded-panel bg-night-900/60 p-2 ring-1 ring-hairline sm:gap-2 sm:p-3">
        <FlowNode {...from} active={active} delay={delay + 90} reduced={reduced} />
        <Connector tone={tone} />
        <FlowNode {...to} active={active} delay={delay + 260} reduced={reduced} dominant={dominant} />
      </div>
    </div>
  );
}

/** Traders who still owe, from the same ledger the bands read. */
function ReceivableList() {
  const rows = SAMPLE.trader.receivables;
  const total = useMemo(() => rows.reduce((sum, row) => sum + row.balance, 0), [rows]);

  return (
    <Panel tone="sunken" className="mt-7 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <Eyebrow tone="steel">Trader balances</Eyebrow>
        <SampleFlag />
      </div>

      <ul className="mt-3.5">
        {rows.map((row, i) => (
          <Reveal key={row.name} delay={i * 70} distance={0.4}>
            <li>
              <StatLine
                label={row.name}
                value={inr(row.balance)}
                tone={row.balance > 0 ? 'bone' : 'ash'}
                className="border-b border-hairline/70 last:border-b-0"
              />
            </li>
          </Reveal>
        ))}
      </ul>

      <Rule className="mt-2" />
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-[0.75rem] text-ash-dim">
          <Wallet size={14} className="text-steel" />
          Outstanding across traders
        </span>
        <span className="tnum text-[1.0625rem] font-semibold text-steel">{inr(total)}</span>
      </div>
    </Panel>
  );
}

export function TraderFlow() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const wide = useMediaQuery('(min-width: 640px)', true);
  const pointer = usePointerOffset({ disabled: reduced || coarse });
  const still = reduced || coarse;
  const active = still || inView;
  const settled = useCountUp(SAMPLE.trader.received, active, 1100);

  const rotY = still || !wide ? 0 : -13 + pointer.x * 3.5;
  const rotX = still || !wide ? 0 : 5 - pointer.y * 2;

  return (
    <PillarShell
      id="traders"
      index="02"
      kicker="Trader Management"
      headline="Every sale has a balance behind it."
      flip
      lede={
        'A load of eggs leaves the farm on credit. The sale is booked as income and the trader is owed ' +
        'a balance; each payment settles part of that balance, never the sale itself.'
      }
      foot={
        <Reveal delay={180}>
          <div className="border-t border-hairline pt-5">
            <p className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-ash">
              <ArrowRightToLine size={15} className="mt-0.5 shrink-0 text-yolk-500" />
              <span>A sale creates income and a receivable. A payment settles the receivable.</span>
            </p>
            <p className="mt-2.5 text-[0.75rem] text-ash-dim">
              Money received so far against this sale: <span className="tnum text-steel">{inr(Math.round(settled))}</span>.
            </p>
          </div>
        </Reveal>
      }
    >
      <div ref={ref} className="d3 relative">
        <Glow from="rgba(111,151,190,0.14)" className="left-1/2 top-10 h-[320px] w-[520px] -translate-x-1/2" />

        <div
          className="d3 relative space-y-4 sm:space-y-5"
          style={{ transform: `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)` }}
        >
          <FlowBand
            step="Event one"
            caption="The sale is billed — the trader now owes it"
            tone="moss"
            depth={0}
            delay={0}
            active={active}
            reduced={still}
            from={{ label: 'Egg sale', amount: SAMPLE.trader.sale, tone: 'moss' }}
            to={{ label: 'Trader receivable', amount: SAMPLE.trader.sale, tone: 'amber' }}
          />

          <div className="flex items-center gap-3 pl-1">
            <span className="h-6 w-px bg-hairline-bright" />
            <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-ash-dim">
              A different event
            </span>
          </div>

          <FlowBand
            step="Event two"
            caption="Cash arrives — it clears part of the receivable"
            tone="steel"
            depth={-10}
            delay={220}
            active={active}
            reduced={still}
            dominant
            from={{ label: 'Payment received', amount: SAMPLE.trader.received, tone: 'steel' }}
            to={{ label: 'Trader balance', amount: SAMPLE.trader.balance, tone: 'bone' }}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Tag tone="moss">Income</Tag>
          <Tag tone="amber">Receivable</Tag>
          <Tag tone="steel">Receipt</Tag>
          <SampleFlag />
          <span className="text-[0.6875rem] text-ash-dim">
            Income and receivable are one event recorded twice; a receipt is the next event.
          </span>
        </div>

        <ReceivableList />
      </div>
    </PillarShell>
  );
}
