import { Reveal } from '@/components/landing/primitives';

export function PricingCta() {
  return (
    <section className="relative px-4 py-16 sm:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[image:var(--gradient-cta)] p-9 text-center sm:p-12">
          <h2 className="font-display text-primary-foreground mx-auto max-w-2xl text-balance text-[28px] leading-[1.15] font-extrabold tracking-[-0.03em] sm:text-[36px]">
            Mulai Perjalanan Belajar Anda
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-4 max-w-xl text-[15.5px] leading-[1.75]">
            Coba Placement Test, pelajari modul pertama, dan rasakan pengalaman berbicara dengan AI
            Tutor secara gratis.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="bg-accent text-accent-foreground inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-bold shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Mulai Gratis
            </a>
            <a
              href="#paket"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-semibold transition-colors"
            >
              Lihat Semua Paket
            </a>
            <a
              href="#institusi"
              className="text-primary-foreground/80 hover:text-primary-foreground inline-flex h-12 items-center justify-center px-4 text-[14px] font-semibold underline-offset-4 hover:underline"
            >
              Hubungi Tim Kaifa
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
