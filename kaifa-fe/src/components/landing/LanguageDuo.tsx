import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from './primitives';

const cards = [
  {
    title: 'اللغة العربية',
    desc: "Pelajari bahasa Al-Qur'an dan Sunnah dengan cara yang menyenangkan.",
    cta: 'Mulai Belajar العربية',
    img: '/images/landing/ctx-mosque.png',
    alt: 'Ilustrasi masjid',
    tone: 'bg-[color-mix(in_oklab,var(--brand)_8%,var(--surface))] border-primary/20',
    text: 'text-primary',
  },
  {
    title: 'Bahasa Inggris',
    desc: 'Tingkatkan kemampuan bahasa Inggris untuk pendidikan dan dunia global.',
    cta: 'Mulai Belajar Inggris',
    img: '/images/landing/ctx-london.png',
    alt: 'Ilustrasi landmark London',
    tone: 'bg-[color-mix(in_oklab,var(--secondary)_8%,var(--surface))] border-secondary/20',
    text: 'text-secondary',
  },
];

export function LanguageDuo() {
  return (
    <section id="kurikulum" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Dua Bahasa, Satu Tujuan"
          desc="Kuasai Bahasa Arab dan Bahasa Inggris untuk masa depan yang lebih cerah."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={0.08 * i}>
              <article className={`relative h-full overflow-hidden rounded-3xl border p-7 sm:p-9 ${c.tone}`}>
                <Image
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  sizes="(min-width: 640px) 208px, 160px"
                  className="pointer-events-none absolute -right-6 -bottom-4 h-40 w-auto opacity-70 sm:h-52"
                />
                <div className="relative max-w-[62%]">
                  <h3 className={`font-display text-[26px] font-bold tracking-[-0.03em] ${c.text}`}>{c.title}</h3>
                  <p className="text-ink-muted mt-3 text-[14.5px] leading-[1.7]">{c.desc}</p>
                  <a
                    href="/login"
                    className="border-rule/80 bg-surface text-ink hover:border-secondary/40 hover:text-secondary mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
                  >
                    {c.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
