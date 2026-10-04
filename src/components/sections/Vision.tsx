import { BRAND } from '@/lib/content';
import { lerp, usePrefersReducedMotion, useScrollProgress } from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';
import { Glow, Rule } from '@/components/ui/Surface';

const ROWS = 9;

/**
 * The one 3D element: a lattice of record lines receding towards an amber horizon.
 * Geometry is hand-placed (compressing spacing + shrinking width) then given real
 * depth with translateZ, so scroll parallax reads as distance rather than size.
 */
function RecordField({ progress }: { progress: number }) {
  return (
    <div aria-hidden className="stage pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[58vh] overflow-hidden">
      {/* the horizon itself — one line of amber light the field recedes towards */}
      <div
        className="absolute inset-x-[6%] top-[30%] h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(239,169,58,0.45) 24%, rgba(255,212,132,0.8) 50%, rgba(239,169,58,0.45) 76%, transparent)',
        }}
      />
      <div
        className="absolute inset-x-[10%] top-[16%] bottom-[34%] blur-[70px]"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(239,169,58,0.18), transparent 70%)' }}
      />

      <div
        className="d3 absolute inset-0"
        style={{
          transform: `rotateX(52deg) translate3d(0, ${lerp(-10, 10, progress).toFixed(2)}px, 0)`,
          transformOrigin: '50% 92%',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 6%, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 6%, transparent 78%)',
        }}
      >
        {Array.from({ length: ROWS }, (_, i) => {
          const t = i / (ROWS - 1); // 0 = near, 1 = furthest
          return (
            <div
              key={i}
              className="absolute bottom-[8%] h-px"
              style={{
                left: '50%',
                width: `${lerp(92, 34, Math.pow(t, 0.85)).toFixed(2)}%`,
                bottom: `${lerp(8, 74, Math.pow(t, 1.8)).toFixed(2)}%`,
                transform: `translateX(-50%) translateZ(${(-t * 210).toFixed(1)}px) translateY(${(
                  lerp(14, -8, t) *
                  (progress - 0.5) *
                  2
                ).toFixed(2)}px)`,
                opacity: lerp(0.5, 0.07, t).toFixed(3),
                background:
                  i % 3 === 0
                    ? 'linear-gradient(to right, transparent, rgba(239,169,58,0.9) 20%, rgba(239,169,58,0.9) 80%, transparent)'
                    : 'linear-gradient(to right, transparent, rgba(244,241,233,0.5) 18%, rgba(244,241,233,0.5) 82%, transparent)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/** §14 — the company, not the product. Editorial, quiet, one statement. */
export function Vision() {
  const reduced = usePrefersReducedMotion();
  const [ref, raw] = useScrollProgress<HTMLDivElement>();
  const progress = reduced ? 0.5 : raw;

  return (
    <div ref={ref} className="relative">
      <Section id="vision" className="bg-night-950">
        <Glow from="rgba(239,169,58,0.09)" className="left-1/2 top-[24%] h-[54vh] w-[86vw] -translate-x-1/2" />
        <RecordField progress={progress} />

        <div className="relative z-10 mx-auto max-w-[58rem]">
          <Reveal direction="fade">
            <Eyebrow>{BRAND.company}</Eyebrow>
          </Reveal>

          <Reveal delay={90}>
            <Display size="lg" className="mt-7 max-w-[26ch]">
              Building the digital infrastructure for modern poultry businesses.
            </Display>
          </Reveal>

          <Reveal delay={200}>
            <Lede className="mt-7 max-w-[46ch]">
              Amrut Poultry Solutions is focused on practical technology that makes poultry operations easier to
              understand, manage and grow.
            </Lede>
          </Reveal>

          <Reveal delay={320} className="mt-14 max-w-[52ch]">
            <Rule />
            <p className="mt-7 text-[0.9375rem] leading-[1.75] text-ash">
              That starts with what a farm already produces: eggs collected, feed drawn, stock moved, sales billed,
              payments received. Recorded once, at the moment it happens, the month&apos;s numbers fall out of the
              work instead of being reconstructed after it.
            </p>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
