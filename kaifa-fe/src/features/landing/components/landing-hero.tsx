import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { label: '2 Bahasa', detail: 'Arab & Inggris' },
  { label: 'Asesmen Suara AI', detail: 'Penilaian pelafalan' },
  { label: 'Learning Path Personal', detail: 'Sesuai progres anak' },
  { label: 'Islami & Ramah Anak', detail: 'Materi sesuai nilai' },
];

export function LandingHero() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-14 sm:px-6 sm:pt-16 sm:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <span className="inline-flex rounded-full bg-[#2f6a43]/10 px-4 py-2 text-sm font-bold text-[#2f6a43] ring-1 ring-[#2f6a43]/20">
            Belajar bahasa Islami bersama AI
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-black tracking-tight text-[#2f2518] sm:text-5xl lg:text-6xl lg:leading-[0.95]">
            Belajar jadi lebih seru, bareng AI.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#75644f] sm:text-lg sm:leading-8">
            Kaifa menemani anak-anak belajar Bahasa Arab &amp; Inggris lewat asesmen suara AI,
            learning path personal, dan latihan interaktif setiap hari.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#2f6a43] px-6 py-3.5 text-base font-bold text-[#fff6df] shadow-[0_7px_0_#245234] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_0_#245234]"
            >
              Mulai Belajar Gratis
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center justify-center rounded-xl border border-[#2f2518]/15 bg-white/60 px-6 py-3.5 text-base font-bold text-[#2f2518] transition-colors hover:bg-white"
            >
              Lihat Fitur
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/60 bg-white/50 px-3 py-3 text-center sm:text-left"
              >
                <dt className="text-xs font-black tracking-tight text-[#2f6a43] sm:text-sm">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-xs text-[#75644f]">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-[#2f6a43] p-8 text-[#fff6df] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem] sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.17),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
          <div className="relative">
            <p className="text-2xl leading-none font-black" lang="ar" dir="rtl">
              مرحبا
            </p>
            <p className="mt-4 max-w-xs text-lg leading-8 text-[#fff6df]/80">
              Setiap hari, pendamping AI siap mendengar, membetulkan, dan menyemangati.
            </p>
          </div>

          <div className="relative mt-10 grid grid-cols-3 gap-3" aria-hidden="true">
            {['icon_headphone', 'icon_microphone', 'icon_target'].map((icon) => (
              <div
                key={icon}
                className="overflow-hidden rounded-3xl bg-[#fff6df] shadow-[0_12px_28px_rgba(24,65,36,0.28),0_3px_8px_rgba(24,65,36,0.18)]"
              >
                <Image
                  src={`/images/${icon}.png`}
                  alt=""
                  width={1254}
                  height={1254}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
