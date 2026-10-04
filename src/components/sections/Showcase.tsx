import { CAPTION, SCREENS, type ScreenName } from '@/lib/content';
import { lerp, phase, useCoarsePointer, useMediaQuery, usePrefersReducedMotion, useScrollProgress } from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';
import { Glow } from '@/components/ui/Surface';
import { ScreenFrame } from '@/components/ui/DeviceFrame';
import { ProductScreen } from '@/components/product/ProductScreen';

/* ============================================================
   §11 — the product gallery.
   Eight real captures open scattered through depth; scrolling gathers them
   into one aligned grid. The convergence IS the message: separate screens,
   one record. Under reduced / coarse motion the gallery is shown converged.
   ============================================================ */

/** Where each plate starts (px offsets, depth in px, rotation in deg, scale). */
type Scatter = { x: number; y: number; z: number; ry: number; rx: number; s: number };

const SCATTER: Scatter[] = [
  { x: -30, y: 20, z: -180, ry: 12, rx: -6, s: 0.86 },
  { x: 40, y: -14, z: -120, ry: -10, rx: 5, s: 0.92 },
  { x: -18, y: -30, z: -220, ry: 6, rx: 8, s: 0.8 },
  { x: 30, y: 22, z: -90, ry: -14, rx: -4, s: 0.95 },
  { x: -44, y: -8, z: -150, ry: 10, rx: 6, s: 0.88 },
  { x: 20, y: 30, z: -200, ry: -8, rx: -7, s: 0.82 },
  { x: -10, y: -20, z: -110, ry: 14, rx: 4, s: 0.93 },
  { x: 36, y: 10, z: -170, ry: -12, rx: -5, s: 0.87 },
];

/** 0 = fully scattered, 1 = seated in the grid facing the camera. */
function transformOf(s: Scatter, c: number): string {
  const inv = 1 - c;
  return [
    `translate3d(${(s.x * inv).toFixed(1)}px, ${(s.y * inv).toFixed(1)}px, ${(s.z * inv).toFixed(1)}px)`,
    `rotateY(${(s.ry * inv).toFixed(2)}deg)`,
    `rotateX(${(s.rx * inv).toFixed(2)}deg)`,
    `scale(${lerp(s.s, 1, c).toFixed(3)})`,
  ].join(' ');
}

function PlateBody({ name, label, caption, eager }: { name: ScreenName; label: string; caption: string; eager: boolean }) {
  return (
    <>
      <ScreenFrame title={label} className="w-full">
        <div className="relative aspect-[16/10] w-full">
          <ProductScreen name={name} chrome={false} eager={eager} />
        </div>
      </ScreenFrame>
      <figcaption className="mt-3 text-[0.75rem] leading-snug text-ash">{caption}</figcaption>
    </>
  );
}

/** Desktop: the depth stage that gathers with scroll. */
function ScatteredGallery({ progress }: { progress: number }) {
  return (
    <div className="stage d3 mx-auto grid max-w-[1240px] grid-cols-2 gap-x-8 gap-y-12 xl:grid-cols-4">
      {SCREENS.map((screen, i) => {
        const c = phase(progress, 0.1 + i * 0.045, 0.56 + i * 0.045);
        return (
          <figure
            key={screen.name}
            className="d3 will-change-transform"
            style={{ transform: transformOf(SCATTER[i], c), opacity: lerp(0.5, 1, c) }}
          >
            <PlateBody name={screen.name} label={screen.label} caption={screen.caption} eager={i === 0} />
          </figure>
        );
      })}
    </div>
  );
}

/** Converged grid — what reduced / coarse motion and the end of the scroll both settle to. */
function AlignedGallery() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-12 xl:grid-cols-4">
      {SCREENS.map((screen, i) => (
        <Reveal key={screen.name} delay={i * 60} direction="scale">
          <figure>
            <PlateBody name={screen.name} label={screen.label} caption={screen.caption} eager={i === 0} />
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

/** Mobile: the same eight, one per row, a gentle settle only — never a second render at full size. */
function StackedGallery() {
  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col gap-12">
      {SCREENS.map((screen, i) => (
        <Reveal key={screen.name} direction="up" delay={Math.min(i, 3) * 60}>
          <figure>
            <PlateBody name={screen.name} label={screen.label} caption={screen.caption} eager={i === 0} />
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function Showcase() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const still = reduced || coarse;
  const wide = useMediaQuery('(min-width: 780px)', true);
  const [progressRef, progress] = useScrollProgress<HTMLDivElement>();

  return (
    <Section id="showcase" container={false} className="border-t border-hairline bg-night-900">
      <div ref={progressRef} className="relative isolate">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-20 rule-grid opacity-50" />
        <Glow from="rgba(217,164,65,0.12)" className="absolute inset-x-0 top-0 -z-20 h-[50vh]" />

        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
          <div className="mx-auto max-w-[52rem] text-center">
            <Reveal direction="fade">
              <Eyebrow className="justify-center">Product Showcase</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <Display size="lg" className="mt-6">
                The whole business, on one record.
              </Display>
            </Reveal>
            <Reveal delay={150}>
              <Lede className="mx-auto mt-6 max-w-[46ch]">
                Eight screens for eight jobs — and underneath every one of them, the same farm data.
              </Lede>
            </Reveal>
          </div>

          <div className="mt-14 sm:mt-20">
            {!wide ? (
              <StackedGallery />
            ) : still ? (
              <AlignedGallery />
            ) : (
              <ScatteredGallery progress={progress} />
            )}
          </div>

          <p className="mt-14 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-ash-dim">{CAPTION.capture}</p>
        </div>
      </div>
    </Section>
  );
}
