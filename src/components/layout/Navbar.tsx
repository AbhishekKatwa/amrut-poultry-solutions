import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { BRAND, NAV } from '@/lib/content';
import { Wordmark } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';

/** Transparent over the hero, then a compact blurred bar. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 28);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,padding] duration-500 ease-out',
        scrolled || open
          ? 'border-b border-hairline bg-night-950/78 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-5 transition-height duration-500 ease-out sm:px-8',
          scrolled ? 'h-14' : 'h-20',
        )}
      >
        <a href="#top" className="rounded-lg" aria-label={`${BRAND.company} — home`}>
          <Wordmark compact={scrolled} />
        </a>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative whitespace-nowrap text-[0.8125rem] font-medium tracking-tight text-ash transition-colors duration-300 hover:text-bone"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={BRAND.contact.tel}
            className="hidden items-center gap-2 whitespace-nowrap text-[0.8125rem] font-medium text-ash transition-colors hover:text-bone xl:inline-flex"
          >
            <Phone size={14} className="text-yolk-400" aria-hidden />
            <span className="tnum">{BRAND.contact.display}</span>
          </a>
          <Button href="#pricing" size="sm" variant="primary" icon={<ArrowUpRight size={14} />}>
            Get Started
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-control text-bone ring-1 ring-hairline-bright transition-colors hover:bg-night-800 lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={clsx(
          'grid overflow-hidden border-t border-hairline transition-[grid-template-rows,opacity] duration-400 ease-out lg:hidden',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col gap-1 px-5 py-5 sm:px-8" aria-label="Mobile">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-panel px-4 py-3.5 text-base font-medium text-bone transition-colors hover:bg-night-800"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-4 flex items-center gap-3">
              <Button
                href={BRAND.contact.tel}
                variant="secondary"
                size="md"
                className="flex-1"
                icon={<Phone size={15} />}
              >
                <span className="tnum">{BRAND.contact.display}</span>
              </Button>
              <Button href="#pricing" size="md" className="flex-1" onClick={() => setOpen(false)}>
                Get Started
              </Button>
            </div>
            <p className="mt-4 px-1 text-[0.75rem] leading-relaxed text-ash-dim">
              {BRAND.company} · {BRAND.positioning}
            </p>
          </nav>
        </div>
      </div>
    </header>
  );
}
