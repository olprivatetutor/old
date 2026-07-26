import Link from 'next/link';

export function LandingCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-[#2f6a43] px-6 py-12 text-center text-[#fff6df] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem] sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.17),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
        <div className="relative">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Yuk mulai perjalanan belajar hari ini
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#fff6df]/80 sm:text-lg">
            Gratis untuk mulai. Anak-anak bisa langsung belajar dengan pendamping AI.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#fff6df] px-7 py-3.5 text-base font-black text-[#2f6a43] shadow-[0_7px_0_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_0_rgba(0,0,0,0.18)]"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
