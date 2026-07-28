'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CtaButton } from './primitives';
import { Logo } from './Logo';

const links = [
  { label: 'Beranda', href: '#top' },
  { label: 'Fitur', href: '#features' },
  { label: 'Kurikulum', href: '#kurikulum' },
  { label: 'Cara Kerja', href: '#how' },
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
        <a href="#top" aria-label="Kaifa">
          <Logo />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-ink-muted hover:bg-subtle/70 hover:text-ink rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="text-ink hover:text-secondary rounded-full px-4 py-2 text-[14px] font-semibold transition-colors"
          >
            Masuk
          </Link>
          <CtaButton href="/login" className="h-10 px-5 text-[14px]">
            Daftar Gratis
          </CtaButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          className="border-rule/70 bg-surface/70 text-ink grid h-10 w-10 place-items-center rounded-full border backdrop-blur-xl lg:hidden"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-rule/70 bg-surface/90 mx-auto mt-2 max-w-6xl rounded-3xl border p-4 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-ink-muted hover:bg-subtle hover:text-ink rounded-xl px-3 py-2.5 text-[15px] font-medium"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-ink-muted hover:bg-subtle hover:text-ink rounded-xl px-3 py-2.5 text-[15px] font-medium"
            >
              Masuk
            </Link>
          </div>
          <CtaButton href="/login" className="mt-3 w-full">
            Daftar Gratis
          </CtaButton>
        </div>
      ) : null}
    </header>
  );
}
