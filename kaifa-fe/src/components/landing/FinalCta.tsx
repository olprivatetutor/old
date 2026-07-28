'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './primitives';

export function FinalCta() {
  return (
    <section id="cta" className="relative px-4 py-16 sm:px-6">
      <Reveal>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 overflow-hidden rounded-[32px] bg-[image:var(--gradient-cta)] p-9 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <Image
            src="/images/landing/ctx-mosque.png"
            alt=""
            aria-hidden
            loading="lazy"
            width={1024}
            height={768}
            className="pointer-events-none absolute right-0 -bottom-6 h-40 w-auto opacity-15 sm:h-56"
          />
          <div className="relative max-w-xl">
            <h2 className="font-display text-primary-foreground text-balance text-[30px] leading-[1.1] font-extrabold tracking-[-0.035em] sm:text-[38px]">
              Siap memulai perjalanan belajarmu?
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-[15.5px] leading-[1.75]">
              Bergabung sekarang dan rasakan pengalaman belajar bahasa yang lebih cerdas, interaktif, dan
              bermakna.
            </p>
          </div>
          <div className="relative flex flex-col items-start gap-3 lg:items-center">
            <a
              href="/login"
              className="group bg-accent text-accent-foreground h-13 inline-flex items-center gap-2 rounded-full px-7 text-[15.5px] font-bold shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="text-primary-foreground/70 text-[12.5px]">100% gratis untuk memulai</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
