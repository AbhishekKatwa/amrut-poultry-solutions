import { FIVE_NUMBERS, SAMPLE } from '@/lib/content';
import { inr, num, signed } from '@/lib/format';
import { useCoarsePointer, useCountUp, useInView, useMediaQuery, usePrefersReducedMotion } from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede, Metric } from '@/components/ui/Type';
import { Panel, Glow } from '@/components/ui/Surface';
import { TiltCard } from '@/components/ui/TiltCard';
import { SampleFlag } from '@/components/ui/DeviceFrame';

/* ============================================================
   §13 — the five numbers. One representative figure per number,
   taken straight from SAMPLE, counted up on reveal. Net P&L sits
   forward and larger; the field has depth, not five flat tiles.
   ============================================================ */

type Tone = 'bone' | 'amber' | 'moss' | 'clay' | 'steel';

type Figure = {
  raw: number;
  render: (value: number) => string;
  unit?: string;
  tone: Tone;
  note: string;
  z: number;
  span: string;
};

const FIGURES: Figure[] = [
  { raw: SAMPLE.eggs.available, render: (v) => num(v), unit: 'eggs', tone: 'bone', note: 'Egg Planner', z: 14, span: 'lg:col-span-4' },
  { raw: SAMPLE.godown.stockValue, render: (v) => inr(v), tone: 'bone', note: 'Godown stock × average cost', z: 34, span: 'lg:col-span-4' },
  { raw: SAMPLE.trader.receivableTotal, render: (v) => inr(v), tone: 'steel', note: 'Trader ledger', z: 14, span: 'lg:col-span-4' },
  { raw: SAMPLE.pnl.expense, render: (v) => inr(v), tone: 'clay', note: 'Farm ledger, one month', z: 48, span: 'lg:col-span-5' },
  { raw: SAMPLE.pnl.net, render: (v) => signed(v), tone: 'amber', note: 'Revenue − expense', z: 96, span: 'lg:col-span-7' },
];

export function FiveNumbers() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const still = reduced || coarse;
  const wide = useMediaQuery('(min-width: 1024px)', true);

  return (
    <Section id="numbers" className="border-t border-hairline bg-night-900">
      <Glow from="rgba(239,169,58,0.13)" className="left-1/2 top-10 h-[45vh] w-[80vw] max-w-[1000px] -translate-x-1/2" />

      <div className="max-w-[56rem]">
        <Reveal>
          <Eyebrow tone="amber">The Five Numbers</Eyebrow>
          <Display size="lg" className="mt-6">
            Five numbers can change the way you run the farm.
          </Display>
          <Lede className="mt-6 max-w-[48ch]">
            Not a report to read later — five figures you can answer right now, on one screen.
          </Lede>
          <div className="mt-5 flex items-center gap-3">
            <SampleFlag />
            <p className="text-[0.75rem] text-ash-dim">Illustrative figures from the sample workspace.</p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 sm:mt-20">
        {wide ? (
          <div className="stage d3 grid grid-cols-12 gap-6">
            {FIGURES.map((figure, i) => (
              <div key={FIVE_NUMBERS[i].key} className={figure.span}>
                <Reveal delay={i * 80} direction="scale">
                  <DepthCard figure={figure} hero={i === 4} still={still} />
                </Reveal>
              </div>
            ))}
          </div>
        ) : (
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8">
            {FIGURES.map((figure, i) => (
              <div
                key={FIVE_NUMBERS[i].key}
                className="w-[82vw] max-w-[360px] shrink-0 snap-center sm:w-[64vw] lg:w-[46vw]"
              >
                <FlatCard figure={figure} hero={i === 4} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

function DepthCard({ figure, hero, still }: { figure: Figure; hero: boolean; still: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const active = still || inView;
  const shown = useCountUp(figure.raw, active, 1400);
  const depth = still ? 0 : figure.z;

  return (
    <div ref={ref} className="d3 h-full" style={{ transform: `translateZ(${depth}px)` }}>
      <TiltCard max={hero ? 8 : 5} lift={hero ? 16 : 9} glare>
        <FigureBody figure={figure} shown={shown} hero={hero} />
      </TiltCard>
    </div>
  );
}

function FlatCard({ figure, hero }: { figure: Figure; hero: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  const shown = useCountUp(figure.raw, reduced || inView, 1400);
  return (
    <div ref={ref} className="h-full">
      <FigureBody figure={figure} shown={shown} hero={hero} />
    </div>
  );
}

function FigureBody({ figure, shown, hero }: { figure: Figure; shown: number; hero: boolean }) {
  const meta = FIVE_NUMBERS[FIGURES.indexOf(figure)];
  return (
    <Panel tone={hero ? 'accent' : 'raised'} className="flex h-full min-h-[190px] flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-ash-dim">{meta.label}</span>
        {hero ? <SampleFlag /> : null}
      </div>

      <p className={hero ? 'mt-4 text-sub font-medium text-bone' : 'mt-4 text-[1.0625rem] font-medium leading-snug text-bone'}>
        {meta.question}
      </p>

      <div className="mt-6">
        <Metric
          value={figure.render(Math.round(shown))}
          unit={figure.unit}
          tone={figure.tone}
          size="lg"
          hint={figure.note}
        />
      </div>
    </Panel>
  );
}
