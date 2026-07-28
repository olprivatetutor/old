import { Glow, Reveal } from '@/components/landing/primitives';

export function PricingHero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 pb-12 sm:px-6 lg:pt-40 lg:pb-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-mesh)]" />
      <Glow className="bg-brand-blue/25 top-[-8%] left-[-10%] h-[380px] w-[380px]" />
      <Glow className="bg-brand-violet/25 top-[2%] right-[-8%] h-[420px] w-[420px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h1 className="font-display text-ink text-balance text-[32px] leading-[1.12] font-extrabold tracking-[-0.04em] sm:text-[42px] lg:text-[48px]">
            Belajar Lebih Terarah dengan AI Tutor Personal
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-ink-muted mt-5 text-pretty text-[16px] leading-[1.75] sm:text-[17px]">
            Mulai gratis, lalu upgrade sesuai kebutuhan belajar Anda. Setiap paket dirancang untuk
            memberikan pengalaman belajar yang terstruktur, personal, dan terukur.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
