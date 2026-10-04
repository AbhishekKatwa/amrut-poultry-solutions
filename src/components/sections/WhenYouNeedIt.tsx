import { WHEN } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Display, Eyebrow, Lede } from '@/components/ui/Type';
import { Glow, Rule } from '@/components/ui/Surface';

/* ============================================================
   §7B — WHEN. The honest trigger list: the moments a diary stops
   being enough. The closing panel argues against buying too early,
   which is what makes the rest of the case credible.
   ============================================================ */

export function WhenYouNeedIt() {
  return (
    <Section id="when" className="border-y border-hairline bg-night-950">
      <Glow from="rgba(217,164,65,0.08)" className="left-1/2 top-10 h-[44vh] w-[72vw] max-w-[940px] -translate-x-1/2" />

      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow tone="bone">When</Eyebrow>
          <Display size="lg" className="mt-6 max-w-[20ch]">
            {WHEN.headline}
          </Display>
          <Lede className="mt-7 max-w-[62ch]">{WHEN.lede}</Lede>
        </Reveal>

        <div className="mt-14 grid gap-x-14 sm:mt-18 md:grid-cols-2">
          {WHEN.triggers.map((t, i) => (
            <Reveal key={t.sign} delay={i * 70} className="flex gap-5 py-6">
              <span className="tnum mt-1.5 shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-yolk-500/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="text-[clamp(1.0625rem,1.8vw,1.375rem)] font-semibold leading-snug tracking-[-0.025em] text-bone">
                  {t.sign}
                </h3>
                <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ash">{t.cost}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the counterpoint — argued against the sale */}
        <Reveal delay={80} className="mt-16 sm:mt-20">
          <div className="relative overflow-hidden rounded-panel border border-hairline bg-night-900/70 px-6 py-8 sm:px-10 sm:py-10">
            <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-yolk-500/45" />
            <div className="grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <Eyebrow tone="bone">{WHEN.notYet.title}</Eyebrow>
                <p className="mt-5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-yolk-300">{WHEN.notYet.note}</p>
              </div>
              <div className="md:col-span-7">
                <Rule />
                <ul className="mt-1">
                  {WHEN.notYet.lines.map((line) => (
                    <li key={line} className="flex items-start gap-3.5 py-3.5">
                      <svg viewBox="0 0 14 14" aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0">
                        <path d="M2 7h10M8.5 3.5 12 7l-3.5 3.5" fill="none" stroke="#6F8A7B" strokeWidth="1.4" />
                      </svg>
                      <span className="text-[0.9375rem] leading-relaxed text-ash">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
