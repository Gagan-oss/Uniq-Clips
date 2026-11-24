import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_ITEMS, SITE } from '../config/site';
import { BrandMark, cn, useScrollTo } from './MotionPrimitives';

export function Navbar() {
  const scrollTo = useScrollTo();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  function handleNavigate(id: string) {
    const wasOpen = mobileOpen;
    setMobileOpen(false);
    window.setTimeout(() => scrollTo(id), wasOpen ? 220 : 0);
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 motion-reduce:transition-none',
        scrolled
          ? 'border-b border-gold/15 bg-ink/85 py-2.5'
          : 'border-b border-transparent bg-transparent py-5',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-content items-center justify-between gap-6 px-4 sm:px-6"
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('home');
          }}
          className="group flex items-center gap-3 rounded-full whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <BrandMark className="ring-1 ring-gold/30 transition-transform duration-700 group-hover:rotate-[360deg]" />
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-champagne">
            UNIQ <span className="text-gold">CLIPS</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                aria-current={activeId === item.id ? 'location' : undefined}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-[0.8rem] uppercase tracking-[0.16em] whitespace-nowrap shrink-0 transition-colors',
                  activeId === item.id
                    ? 'text-champagne'
                    : 'text-champagne/60 hover:text-champagne',
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-gradient-to-r from-gold via-champagne to-gold transition-transform duration-500',
                    activeId === item.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={SITE.whopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold hidden items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap sm:inline-flex"
          >
            Join Our Community
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-gold/30 bg-ink/80 text-champagne transition-colors hover:border-gold lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation"
          className="border-t border-gold/15 bg-ink/95 px-4 py-6 lg:hidden"
        >
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item.id);
                  }}
                  className={cn(
                    'block rounded-xl px-4 py-3 text-sm uppercase tracking-[0.18em] transition-colors',
                    activeId === item.id
                      ? 'bg-gold/15 text-gold'
                      : 'text-champagne/80 hover:bg-gold/10 hover:text-champagne',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={SITE.whopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em]"
          >
            Join Our Community
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </header>
  );
}
