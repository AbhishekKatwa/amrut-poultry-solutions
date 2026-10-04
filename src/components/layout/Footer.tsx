import { Phone } from 'lucide-react';
import { BRAND, NAV } from '@/lib/content';
import { LogoMark } from '@/components/layout/Logo';
import { Rule } from '@/components/ui/Surface';
import { ContactNumber } from '@/components/ui/ContactNumber';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-night-950 pb-10 pt-16">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <LogoMark size={30} />
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-bone">
                {BRAND.company}
              </span>
            </div>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-ash">{BRAND.positioning}</p>
            <p className="mt-2 text-[0.8125rem] text-ash-dim">
              Flagship product: {BRAND.product}.
            </p>
            <div className="mt-6">
              <p className="text-eyebrow font-semibold uppercase text-ash-dim">Talk to us</p>
              <ContactNumber className="mt-3 max-w-[17rem]" />
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-12 gap-y-6" aria-label="Footer">
            <div className="flex flex-col gap-3">
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">Company</span>
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="text-[0.875rem] text-ash transition-colors hover:text-bone">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ash-dim">Product</span>
              <a
                href={BRAND.contact.tel}
                className="group inline-flex items-center gap-1.5 text-[0.875rem] text-ash transition-colors hover:text-bone"
              >
                Call to start a trial
                <Phone size={13} className="text-yolk-400" aria-hidden />
              </a>
              <a href="#pricing" className="text-[0.875rem] text-ash transition-colors hover:text-bone">
                Plans and pricing
              </a>
              <a href="#trial" className="text-[0.875rem] text-ash transition-colors hover:text-bone">
                30-day trial
              </a>
            </div>
          </nav>
        </div>

        <Rule className="my-10" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-ash-dim">
            © {new Date().getFullYear()} {BRAND.company}. All rights reserved.
          </p>
          <p className="text-[0.75rem] text-ash-dim">
            Screens shown with illustrative sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
