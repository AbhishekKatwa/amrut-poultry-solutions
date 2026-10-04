import { Phone } from 'lucide-react';
import { BRAND } from '@/lib/content';
import { lerp, useCoarsePointer, usePointerOffset, usePrefersReducedMotion, useScrollProgress } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display } from '@/components/ui/Type';
import { Glow, Panel } from '@/components/ui/Surface';
import { ContactNumber } from '@/components/ui/ContactNumber';

const PLANES = 7;

/**
 * Receding amber-lit planes. Geometry is placed once; scroll and pointer only
 * write transforms, so the scene is complete in its final state under reduced motion.
 */
function DepthScene({ progress, pointer }: { progress: number; pointer: { x: number; y: number } }) {
  return (
    <div aria-hidden className="stage pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="d3 absolute inset-x-[-14%] bottom-[-16%] h-[64%]"
        style={{
          transform: `rotateX(${(63 + pointer.y * 2.5).toFixed(2)}deg) translate3d(${(pointer.x * 12).toFixed(
            1,
          )}px, ${lerp(14, -18, progress).toFixed(1)}px, 0)`,
          transformOrigin: '50% 100%',
        }}
      >
        {Array.from({ length: PLANES }, (_, i) => {
          const t = i / (PLANES - 1);
          return (
            <div
              key={i}
              className="absolute left-1/2 h-[2px] rounded-full"
              style={{
                width: `${lerp(74, 22, t).toFixed(2)}%`,
                bottom: `${lerp(2, 88, Math.pow(t, 1.7)).toFixed(2)}%`,
                transform: `translateX(-50%) translateZ(${(-t * 260).toFixed(1)}px)`,
                opacity: lerp(0.85, 0.08, t).toFixed(3),
                background:
                  i % 2 === 0
                    ? 'linear-gradient(to right, transparent, rgba(224,176,75,0.95) 25%, rgba(231,197,131,1) 50%, rgba(224,176,75,0.95) 75%, transparent)'
                    : 'linear-gradient(to right, transparent, rgba(244,241,233,0.35) 30%, rgba(244,241,233,0.35) 70%, transparent)',
              }}
            />
          );
        })}
        <div
          className="absolute inset-x-[8%] bottom-0 top-0"
          style={{ background: 'radial-gradient(55% 60% at 50% 92%, rgba(217,164,65,0.22), transparent 70%)' }}
        />
      </div>

      {/* one slow-drifting light body above the field */}
      <div className="absolute inset-x-0 top-[14%] flex justify-center">
        <div className="animate-drift-slow">
          <div
            className="h-[26vh] w-[52vw] max-w-[720px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(217,164,65,0.16), transparent 68%)' }}
          />
        </div>
      </div>
    </div>
  );
}

/** The hero idea stated again, without words: many physical records resolving into one financial line. */
function PhysicalToFinancial() {
  const ticks = Array.from({ length: 13 }, (_, i) => i);
  return (
    <svg viewBox="0 0 360 44" aria-hidden className="h-11 w-[min(100%,360px)]">
      {ticks.map((i) => {
        const x = 12 + i * 12;
        const half = 4 + ((i * 5) % 11);
        return (
          <line
            key={i}
            x1={x}
            y1={22 - half}
            x2={x}
            y2={22 + half}
            stroke="rgba(244,241,233,0.30)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
      <path
        d="M178 22 H224"
        stroke="rgba(217,164,65,0.5)"
        strokeWidth="1"
        strokeDasharray="4 5"
        className="animate-dash"
      />
      <path
        d="M232 8 L248 22 L232 36"
        fill="none"
        stroke="rgba(217,164,65,0.6)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect x="262" y="15" width="90" height="14" rx="7" fill="url(#amrut-finalcta-bar)" />
      <defs>
        <linearGradient id="amrut-finalcta-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9972E" />
          <stop offset="0.55" stopColor="#E0B04B" />
          <stop offset="1" stopColor="#E7C583" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** §16 — the closing scene. Two lines, two links, one signature. */
export function FinalCta() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const pointer = usePointerOffset({ disabled: reduced || coarse });
  const [ref, raw] = useScrollProgress<HTMLDivElement>();
  const progress = reduced ? 0.55 : raw;

  return (
    <div ref={ref} className="relative">
      <Section id="trial" container={false} className="bg-night-950">
        <DepthScene progress={progress} pointer={pointer} />
        <Glow from="rgba(217,164,65,0.18)" className="left-1/2 top-[38%] h-[50vh] w-[80vw] -translate-x-1/2" />

        {/* vignette into the footer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-b from-transparent to-night-950"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto flex max-w-[54rem] flex-col items-center text-center">
            <Reveal direction="fade">
              <Display as="h2" size="hero">
                Your poultry business is already generating the data.
              </Display>
            </Reveal>

            <Reveal delay={180} className="mt-6">
              <Display as="h3" size="hero">
                Now turn it into <span className="text-yolk-300">decisions.</span>
              </Display>
            </Reveal>

            <Reveal delay={320} className="mt-11 w-full">
              <PhysicalToFinancial />
            </Reveal>

            <Reveal delay={420} className="mt-11">
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button href={BRAND.contact.tel} size="lg" magnetic icon={<Phone size={16} />}>
                  Start Your First Month Free
                </Button>
                <Button href="#product" size="lg" variant="secondary">
                  Explore {BRAND.product}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={500} className="mt-10 w-full max-w-[24rem]">
              <Panel tone="sunken" className="px-4 py-4 text-left">
                <p className="text-eyebrow font-semibold uppercase text-ash-dim">First month free</p>
                <ContactNumber className="mt-3" />
                <p className="mt-3 text-[0.75rem] leading-relaxed text-ash-dim">
                  One number to start your free month, ask about assisted onboarding, or anything else about the
                  product.
                </p>
              </Panel>
            </Reveal>

            <Reveal delay={640} className="mt-16">
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-eyebrow font-semibold uppercase text-yolk-400">{BRAND.company}</p>
                <p className="text-[0.8125rem] text-ash-dim">{BRAND.positioning}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </div>
  );
}
