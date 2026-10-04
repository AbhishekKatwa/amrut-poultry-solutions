import { Check, Phone } from 'lucide-react';
import clsx from 'clsx';
import { BRAND, PLANS, PLAN_NOTE } from '@/lib/content';
import { inr } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede, Tag } from '@/components/ui/Type';
import { Glow, Panel, Rule } from '@/components/ui/Surface';
import { TiltCard } from '@/components/ui/TiltCard';

type Plan = (typeof PLANS)[number];

/** True of every tier — a short list, not a feature catalogue. */
const INCLUDED = [
  'Daily operations records',
  'Egg stock and the sale planner',
  'Godown inventory with coverage',
  'Trader ledger and payments',
  'Farm ledger and derived P&L',
  'Users and role-based access',
  'Mobile and desktop use',
];

function PlanPrice({ plan }: { plan: Plan }) {
  if (plan.monthly === null || plan.yearly === null) {
    return (
      <div>
        <p className="text-[clamp(1.875rem,3.1vw,2.375rem)] font-semibold leading-none tracking-[-0.03em] text-bone">
          Custom
        </p>
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ash-dim">
          Scope beyond a single farm — priced to the setup.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="tnum text-[clamp(1.875rem,3.1vw,2.375rem)] font-semibold leading-none tracking-[-0.04em] text-bone">
          {inr(plan.monthly)}
        </span>
        <span className="text-[0.8125rem] font-medium text-ash-dim">/ month</span>
      </div>
      <p className="tnum mt-2.5 text-[0.8125rem] text-ash-dim">
        or {inr(plan.yearly)} per year
      </p>
    </div>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const featured = plan.featured;

  return (
    <Reveal delay={index * 80} direction="up" className="d3 h-full">
      <div
        className="h-full"
        style={{
          transform: featured ? 'translateZ(46px) scale(1.015)' : 'translateZ(0)',
        }}
      >
        <TiltCard className="h-full" lift={featured ? 14 : 8} glare={featured}>
          <Panel
            tone={featured ? 'accent' : 'raised'}
            padded={false}
            className={clsx('flex h-full flex-col p-6 sm:p-7', featured && 'sm:p-8')}
          >
            {featured ? (
              <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-yolk-400 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-night-950 shadow-[0_10px_26px_-12px_rgba(224,176,75,0.8)] sm:left-7">
                MOST POPULAR
              </span>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-ash">{plan.name}</p>
              {featured ? <Tag tone="amber">Growth farms</Tag> : null}
            </div>

            <p className="mt-3 text-[0.875rem] leading-relaxed text-ash-dim">{plan.scope}</p>

            <div className="mt-6">
              <PlanPrice plan={plan} />
            </div>

            <Rule className="my-6" />

            <p className="text-[0.75rem] leading-relaxed text-ash-dim">
              {featured
                ? 'Full access to every module from the first day.'
                : 'The same product, sized to this capacity.'}
            </p>

            <div className="mt-auto pt-7">
              <Button
                href={BRAND.contact.tel}
                variant={featured ? 'primary' : 'secondary'}
                size={featured ? 'lg' : 'md'}
                magnetic={featured}
                icon={featured ? <Phone size={16} /> : undefined}
                ariaLabel={`${featured ? 'Call to start a 30-day trial' : `Call to choose ${plan.name}`}: ${BRAND.contact.display}`}
              >
                {featured ? 'Start 30-day trial' : `Choose ${plan.name}`}
              </Button>
            </div>
          </Panel>
        </TiltCard>
      </div>
    </Reveal>
  );
}

/** §15 — pricing for the flagship product, stated plainly. */
export function Pricing() {
  return (
    <Section id="pricing" width="wide" className="border-y border-hairline bg-night-900">
      <Glow from="rgba(217,164,65,0.11)" className="left-1/2 top-0 h-[42vh] w-[70vw] -translate-x-1/2" />

      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Reveal direction="fade">
            <Eyebrow>{BRAND.product}</Eyebrow>
            <Display className="mt-6 max-w-[22ch]">Priced per farm, on the birds it carries.</Display>
            <Lede className="mt-6 max-w-[52ch]">
              {BRAND.product} is the product of {BRAND.company}. Each plan covers one farm, sized by bird capacity —
              the tiers below are the whole of it.
            </Lede>
          </Reveal>
        </div>

        <Reveal delay={140} className="lg:col-span-5">
          <Panel tone="sunken" className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[0.8125rem] text-ash">{PLAN_NOTE.trial}</span>
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-yolk-400">
                Included
              </span>
            </div>
            <Rule className="my-3" />
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[0.8125rem] text-ash">{PLAN_NOTE.onboarding}</span>
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ash-dim">
                Separate
              </span>
            </div>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ash-dim">{PLAN_NOTE.onboardingNote}</p>
            <Rule className="my-3" />
            <a
              href={BRAND.contact.tel}
              className="flex items-center justify-between gap-4 text-[0.8125rem] text-ash transition-colors hover:text-bone"
            >
              <span>Talk to us before you start</span>
              <span className="tnum font-semibold text-yolk-300">{BRAND.contact.display}</span>
            </a>
          </Panel>
        </Reveal>
      </div>

      {/* cards */}
      <div className="stage mt-14">
        <div className="d3 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>

      {/* what every plan includes */}
      <Reveal delay={120} className="mt-14">
        <Panel tone="outline" padded={false} className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow tone="bone">What every plan includes</Eyebrow>
            <span className="text-[0.75rem] text-ash-dim">Same product in every tier — capacity is what changes.</span>
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[0.875rem] text-ash">
                <Check size={15} className="shrink-0 text-yolk-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </Reveal>
    </Section>
  );
}
