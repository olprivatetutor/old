'use client';

import { Star } from 'lucide-react';
import { SectionHeading, Stagger, StaggerItem } from './primitives';

const testimonials = [
  {
    quote:
      'Kaifa membuat belajar bahasa jadi lebih terarah dan menyenangkan. AI Companion-nya benar-benar seperti guru pribadi yang selalu ada.',
    name: 'Alma',
    role: 'Kelas X',
    initials: 'AA',
    gradient: 'from-primary to-secondary',
  },
  {
    quote:
      'Latihan speaking-nya bikin saya lebih percaya diri. Feedback-nya langsung, jadi tahu bagian mana yang perlu diperbaiki.',
    name: 'Nara',
    role: 'Kelas XII',
    initials: 'NA',
    gradient: 'from-secondary to-brand-blue',
  },
  {
    quote:
      'Sebagai guru, dashboard progress-nya sangat membantu memantau perkembangan siswa tiap minggu.',
    name: 'Ustadz Ramdhan Ali Mantiri',
    role: 'Founder & Pengasuh Mahir Bil Quran - Talaqqi Quran Center',
    initials: 'RA',
    gradient: 'from-brand-blue to-primary',
  },
];

export function Testimonials() {
  return (
    <section className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Kata Mereka tentang Kaifa" />

        <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="border-rule/70 bg-surface/70 flex h-full flex-col rounded-3xl border p-7 backdrop-blur-xl">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="fill-accent text-accent h-4 w-4" />
                  ))}
                </div>
                <blockquote className="text-ink mt-4 flex-1 text-[14.5px] leading-[1.75]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="border-rule/70 mt-6 flex items-center gap-3 border-t pt-5">
                  <span
                    aria-hidden
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-primary-foreground text-[13px] font-bold`}
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="text-ink block text-[14px] font-semibold">{t.name}</span>
                    <span className="text-ink-muted block text-[12.5px]">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
