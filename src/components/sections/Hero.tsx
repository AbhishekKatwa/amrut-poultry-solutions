import { lazy, Suspense, useMemo } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { BRAND, PIPELINE } from '@/lib/content';
import { useCoarsePointer, usePointerOffset, usePrefersReducedMotion, useScrollProgress } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';
import { Reveal } from '@/components/ui/Reveal';

const HeroCanvas = lazy(() => import('@/components/sections/HeroCanvas'));

/** The FARM → P&L chain, in DOM so it stays crisp and readable at every size. */
function PipelineStrip() {
  const items = useMemo(() => [...PIPELINE], []);
  return (
    <div className="fade-right -mx-1 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      {items.map((label, i) => (
        <div key={label} className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-hairline bg-night-900/70 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ash">
            {label}
          </span>
          {i < items.length - 1 ? (
            <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden className="text-yolk-500/50">
              <path d="M0 4h14" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="animate-dash" />
              <path d="M14 1.2 18 4l-4 2.8" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const pointer = usePointerOffset({ disabled: reduced || coarse });
  const [progressRef, progress] = useScrollProgress<HTMLDivElement>();

  return (
    <div ref={progressRef} id="top" className="relative">
      <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        {/* atmosphere */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 rule-grid opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute -z-20 h-[70vh] w-[70vh] rounded-full opacity-70 blur-[130px] animate-pulse-soft"
          style={{
            right: '-10%',
            top: '12%',
            background: 'radial-gradient(circle, rgba(217,164,65,0.20), transparent 65%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -z-20 h-[55vh] w-[55vh] rounded-full blur-[140px]"
          style={{
            left: '-12%',
            bottom: '-10%',
            background: 'radial-gradient(circle, rgba(46,107,79,0.22), transparent 68%)',
          }}
        />

        {/* the diorama: a band on mobile, the right half on desktop */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[44vh] opacity-95 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[58%]">
          <Suspense fallback={null}>
            <HeroCanvas progress={progress} pointer={pointer} />
          </Suspense>
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(45% 45% at 50% 55%, rgba(217,164,65,0.16), transparent 70%), conic-gradient(from 180deg at 50% 55%, rgba(255,255,255,0.04), transparent 40%)',
              boxShadow: 'inset 0 0 120px 40px rgba(6,21,16,0.9)',
            }}
          />
        </div>

        {/* legibility scrim towards the copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-night-950 via-night-950/85 to-transparent lg:via-night-950/55 lg:to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-night-950 to-transparent"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pt-28 pb-16 sm:px-8">
          <div className="max-w-[46rem]">
            <Reveal direction="fade">
              <Eyebrow>{BRAND.company}</Eyebrow>
            </Reveal>
            <Reveal delay={90}>
              <Display as="h1" size="hero" className="mt-7">
                Technology built around the way poultry businesses{' '}
                <span className="text-yolk-300">actually work.</span>
              </Display>
            </Reveal>
            <Reveal delay={220}>
              <Lede className="mt-7 max-w-[40ch] text-[clamp(1.0625rem,1.6vw,1.3125rem)]">
                From daily farm operations to egg sales, inventory, traders and profitability, Amrut connects the
                numbers that matter.
              </Lede>
            </Reveal>
            <Reveal delay={330}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button href="#product" size="lg" magnetic icon={<ArrowRight size={16} />}>
                  Explore {BRAND.product}
                </Button>
                <Button href="#how-it-works" size="lg" variant="secondary">
                  See How It Works
                </Button>
              </div>
            </Reveal>
            <Reveal delay={440} className="mt-12 max-w-[38rem]">
              <p className="mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ash-dim">
                One connected chain
              </p>
              <PipelineStrip />
            </Reveal>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 sm:px-8">
          <div className="flex items-center justify-between gap-6 border-t border-hairline pt-5">
            <p className="text-[0.75rem] text-ash-dim">
              {BRAND.company} — {BRAND.positioning.toLowerCase()}
            </p>
            <a
              href="#story"
              className="group hidden items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-yolk-300 sm:flex"
            >
              Scroll
              <ArrowDown size={13} className="transition-transform duration-500 group-hover:translate-y-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
