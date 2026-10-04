import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';

/**
 * Shared frame for the five business-system sections (§9).
 * Numbered kicker + a short, blunt headline on one side; the visual is the children.
 */
export function PillarShell({
  id,
  index,
  kicker,
  headline,
  lede,
  children,
  foot,
  flip = false,
  width = 'wide',
}: {
  id?: string;
  index: string;
  kicker: string;
  headline: string;
  lede?: ReactNode;
  children: ReactNode;
  foot?: ReactNode;
  flip?: boolean;
  width?: 'default' | 'wide';
}) {
  return (
    <Section id={id} className={clsx('scroll-mt-24')} width={width}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal
          className={clsx('lg:col-span-5', flip ? 'lg:order-2 lg:col-start-8' : 'lg:order-1')}
          direction={flip ? 'right' : 'left'}
        >
          <div className="flex items-baseline gap-4">
            <span className="tnum text-[2.5rem] font-semibold leading-none text-yolk-500/40">{index}</span>
            <Eyebrow>{kicker}</Eyebrow>
          </div>
          <Display className="mt-5">{headline}</Display>
          {lede ? <Lede className="mt-5 max-w-[46ch]">{lede}</Lede> : null}
          {foot ? <div className="mt-7">{foot}</div> : null}
        </Reveal>

        <Reveal
          className={clsx('lg:col-span-7', flip ? 'lg:order-1' : 'lg:order-2')}
          direction={flip ? 'left' : 'right'}
          delay={120}
        >
          <div className="stage">{children}</div>
        </Reveal>
      </div>
    </Section>
  );
}
