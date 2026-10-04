import { useState } from 'react';
import clsx from 'clsx';
import { Smartphone, Monitor } from 'lucide-react';
import { BRAND, SCREENS, type ScreenName } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede, Tag } from '@/components/ui/Type';
import { PhoneFrame, ScreenFrame } from '@/components/ui/DeviceFrame';
import { Glow } from '@/components/ui/Surface';
import { ProductScreen } from '@/components/product/ProductScreen';
import { useCoarsePointer, usePointerOffset, usePrefersReducedMotion } from '@/lib/motion';

/** §8 — the flagship product, presented as a device you can look through. */
export function Flagship() {
  const [active, setActive] = useState<ScreenName>('dashboard');
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const pointer = usePointerOffset({ disabled: reduced || coarse });
  const current = SCREENS.find((screen) => screen.name === active) ?? SCREENS[0];
  const tilt = `perspective(1400px) rotateY(${(pointer.x * 5).toFixed(2)}deg) rotateX(${(-pointer.y * 3.5).toFixed(2)}deg)`;

  return (
    <Section id="product" width="wide" className="border-y border-hairline bg-night-900">
      <Glow from="rgba(217,164,65,0.13)" className="left-1/2 top-10 h-[45vh] -translate-x-1/2" />

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow tone="amber">Flagship Product</Eyebrow>
            <Display className="mt-6">One system for the numbers that run your farm.</Display>
            <Lede className="mt-6 max-w-[40ch]">
              {BRAND.product} keeps daily operations, stock, sales and money in one record — so the answer to a
              question about your farm is already there.
            </Lede>
          </Reveal>

          <Reveal delay={140} className="mt-9">
            <p className="mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-ash-dim">
              What is inside
            </p>
            <ul className="flex flex-wrap gap-2">
              {SCREENS.map((screen) => (
                <li key={screen.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(screen.name)}
                    onFocus={() => setActive(screen.name)}
                    onClick={() => setActive(screen.name)}
                    aria-pressed={active === screen.name}
                    className={clsx(
                      'rounded-full px-3.5 py-2 text-[0.75rem] font-medium transition-[background-color,color,border-color] duration-300',
                      active === screen.name
                        ? 'bg-yolk-400 text-night-950'
                        : 'border border-hairline text-ash hover:border-hairline-bright hover:text-bone',
                    )}
                  >
                    {screen.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-3 text-[0.8125rem] text-ash">
              <Tag tone="amber">Product capture</Tag>
              <span>{current.caption}</span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-8" direction="scale">
          <div className="stage relative">
            <div
              className="d3 relative transition-transform duration-500 ease-out"
              style={{ transform: reduced ? 'none' : tilt }}
            >
              <ScreenFrame title={current.label} className="aspect-16/10 w-full">
                <div key={active} className="h-full w-full animate-[rise_700ms_cubic-bezier(0.16,1,0.3,1)]">
                  <ProductScreen name={active} chrome />
                </div>
              </ScreenFrame>

              <div className="pointer-events-none absolute -bottom-8 -right-3 w-[136px] sm:w-[168px] lg:-right-8">
                <div className="pointer-events-auto animate-drift-slow">
                  <PhoneFrame title={current.label}>
                    <ProductScreen name={active} chrome={false} device="phone" />
                  </PhoneFrame>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.75rem] text-ash-dim lg:mt-14">
              <span className="inline-flex items-center gap-2">
                <Monitor size={14} className="text-yolk-500" /> Works on the desktop you already run the farm from
              </span>
              <span className="inline-flex items-center gap-2">
                <Smartphone size={14} className="text-yolk-500" /> And on the phone in a supervisor's pocket
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
