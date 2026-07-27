'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CtaButton } from './primitives';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how' },
  { label: 'Categories', href: '#categories' },
  { label: 'FAQ', href: '#faq' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5',
          scrolled
            ? 'border-rule/70 bg-surface/75 shadow-[0_18px_50px_-30px_rgba(31,41,55,0.5)] backdrop-blur-2xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-cta)] text-[13px] font-bold text-primary-foreground">
            K
          </span>
          <span className="font-display text-[17px] font-bold tracking-[-0.03em] text-ink">
            Kaifa
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-ink-muted transition-colors hover:bg-subtle/70 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="/login"
            className="rounded-full px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:text-secondary"
          >
            Sign in
          </a>
          <CtaButton href="/login" className="h-10 px-5 text-[14px]">
            Get Started
          </CtaButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-full border border-rule/70 bg-surface/70 text-ink backdrop-blur-xl lg:hidden"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-rule/70 bg-surface/90 p-4 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink-muted hover:bg-subtle hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <CtaButton href="/login" className="mt-3 w-full">
            Get Started
          </CtaButton>
        </div>
      ) : null}
    </header>
  );
}
