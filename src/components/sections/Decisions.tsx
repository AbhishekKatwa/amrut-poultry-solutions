import { useState } from 'react';
import clsx from 'clsx';
import { DECISIONS, SCREENS, type ScreenName } from '@/lib/content';
import { useCoarsePointer, usePrefersReducedMotion } from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Tag } from '@/components/ui/Type';
import { Glow, Rule } from '@/components/ui/Surface';
import { ScreenFrame } from '@/components/ui/DeviceFrame';
import { ProductScreen } from '@/components/product/ProductScreen';

/* ============================================================
   §12 — the decisions. Four questions an owner actually asks.
   The active one drives a real product capture on the side.
   Selection is by click AND keyboard focus (hover is a shortcut,
   never the only path). The first question is open on load.
   ============================================================ */

const CAPTION_BY_SCREEN: Record<ScreenName, string> = SCREENS.reduce(
  (map, s) => {
    map[s.name] = s.caption;
    return map;
  },
  {} as Record<ScreenName, string>,
);

function QuestionVisual({ activeIndex }: { activeIndex: number }) {
  const [visited, setVisited] = useState<number[]>([0]);
  const active = DECISIONS[activeIndex];
  // A newly-selected screen mounts on first visit; visited ones stay for a smooth cross-fade.
  if (!visited.includes(activeIndex)) setVisited((v) => (v.includes(activeIndex) ? v : [...v, activeIndex]));

  return (
    <ScreenFrame title={active.answer} className="w-full">
      <div className="stage d3 relative aspect-[16/10] w-full bg-night-950">
        {DECISIONS.map((d, i) =>
          visited.includes(i) ? (
            <div
              key={d.screen}
              aria-hidden={i !== activeIndex}
              className={clsx(
                'absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                i === activeIndex ? 'z-10' : 'z-0',
              )}
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex ? 'translate3d(0,0,0) rotateY(0deg)' : 'translate3d(0,10px,-170px) rotateY(-9deg)',
              }}
            >
              <ProductScreen name={d.screen} chrome={false} eager={i === 0} pan={i === activeIndex} />
            </div>
          ) : null,
        )}
      </div>
      <figcaption className="border-t border-hairline px-4 py-3 text-[0.8125rem] leading-snug text-ash">
        {CAPTION_BY_SCREEN[active.screen]}
      </figcaption>
    </ScreenFrame>
  );
}

export function Decisions() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const still = reduced || coarse;
  const [activeIndex, setActiveIndex] = useState(0);

  const select = (i: number) => setActiveIndex(i);

  return (
    <Section id="decisions" className="border-t border-hairline bg-night-950">
      <Glow from="rgba(217,164,65,0.1)" className="left-1/2 top-8 h-[40vh] w-[70vw] max-w-[900px] -translate-x-1/2" />

      <Reveal>
        <Eyebrow tone="amber">Built Around The Decisions</Eyebrow>
        <Display size="lg" className="mt-6 max-w-[18ch]">
          Built around the decisions that matter.
        </Display>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
        {/* question list */}
        <div className="lg:col-span-7">
          <div role="tablist" aria-label="The questions the product answers" className="flex flex-col">
            {DECISIONS.map((d, i) => {
              const isActive = i === activeIndex;
              return (
                <div key={d.question}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-pressed={isActive}
                    onMouseEnter={still ? undefined : () => select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                    className={clsx(
                      'group flex w-full items-start gap-4 py-6 text-left transition-colors duration-300 sm:gap-6 sm:py-7',
                      isActive ? 'text-bone' : 'text-ash-dim hover:text-ash',
                    )}
                  >
                    <span
                      className={clsx(
                        'tnum mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] transition-colors',
                        isActive ? 'text-yolk-500' : 'text-ash-dim/60',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={clsx(
                          'block font-semibold leading-[1.05] tracking-[-0.02em] transition-[transform,color] duration-300',
                          'text-[clamp(1.5rem,4.2vw,2.75rem)]',
                          isActive ? 'text-bone' : 'text-ash-dim',
                        )}
                      >
                        {d.question}
                      </span>
                      <span
                        className={clsx(
                          'mt-3 flex items-center gap-3 transition-opacity duration-300',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        <Tag tone="amber">{d.answer}</Tag>
                        <span className="text-[0.75rem] text-ash-dim">Answered on the {d.answer.toLowerCase()} screen.</span>
                      </span>
                    </span>
                  </button>
                  {i < DECISIONS.length - 1 ? <Rule /> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* visual — directly below the list on mobile, sticky beside it on desktop (never overlapping) */}
        <div className="lg:col-span-5">
          <Reveal delay={120} direction="scale" className="lg:sticky lg:top-28">
            <QuestionVisual activeIndex={activeIndex} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
