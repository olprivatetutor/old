'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CtaButton } from './primitives';
import { Logo } from './Logo';

const links = [
  { label: 'Beranda', href: '/#top', sectionId: 'top' },
  { label: 'Fitur', href: '/#features', sectionId: 'features' },
  { label: 'Kurikulum', href: '/#kurikulum', sectionId: 'kurikulum' },
  { label: 'Harga', href: '/price' },
  { label: 'Cara Kerja', href: '/#how', sectionId: 'how' },
  { label: 'Tentang', href: '/about' },
  { label: 'FAQ', href: '/#faq', sectionId: 'faq' },
];

const sectionIds = links.map((l) => l.sectionId).filter((id): id is string => Boolean(id));

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        tickingRef.current = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (link: (typeof links)[number]) =>
    link.sectionId ? pathname === '/' && activeSection === link.sectionId : pathname === link.href;

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
        <Link href="/#top" aria-label="Kaifa">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={isActive(l) ? 'page' : undefined}
              className={cn(
                'rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors',
                isActive(l)
                  ? 'bg-subtle text-ink'
                  : 'text-ink-muted hover:bg-subtle/70 hover:text-ink',
              )}
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
                aria-current={isActive(l) ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-[15px] font-medium',
                  isActive(l) ? 'bg-subtle text-ink' : 'text-ink-muted hover:bg-subtle hover:text-ink',
                )}
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
