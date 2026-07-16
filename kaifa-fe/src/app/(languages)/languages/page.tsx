'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NavPendingIndicator } from '@/components/ui/nav-pending-indicator';
import { LogoutButton } from '@/features/auth/components/logout-button';

const languages = [
  {
    name: 'English',
    label: 'Learn English',
    language: 'english',
    badge: 'EN',
    greeting: 'Hello!',
    description: 'Pelajari percakapan dan kosakata bahasa Inggris.',
    color: 'bg-[#5ba6cf]',
    hoverColor: 'group-hover:bg-[#4b97c0]',
    shadow: 'shadow-[0_7px_0_#347da5]',
    icon: 'Aa',
  },
  {
    name: 'Arabic',
    label: 'Belajar Arab',
    language: 'arabic',
    badge: 'AR',
    greeting: 'مرحبا',
    description: 'Mulai memahami kosakata dan percakapan bahasa Arab.',
    color: 'bg-[#2f6a43]',
    hoverColor: 'group-hover:bg-[#285a39]',
    shadow: 'shadow-[0_7px_0_#245234]',
    icon: 'ع',
  },
];

export default function LanguagesPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-3 py-4 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center sm:min-h-[calc(100dvh-4rem)]">
        <section className="grid w-full overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-[#2f6a43] px-5 py-6 text-[#fff6df] sm:px-8 sm:py-8 lg:flex lg:flex-col lg:justify-between lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.17),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />

            <div className="relative">
              <span className="inline-flex rounded-full bg-[#fff6df]/15 px-4 py-2 text-xs font-bold ring-1 ring-[#fff6df]/25 sm:text-sm">
                Belajar bersama Kaifa
              </span>
              <h1 className="mt-4 max-w-md text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:mt-8 lg:text-6xl lg:leading-[0.95]">
                Mau belajar apa hari ini?
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#fff6df]/80 sm:text-base lg:mt-6 lg:text-lg lg:leading-8">
                {`"Menuntut ilmu itu wajib atas setiap muslim." HR. Ibnu Majah`}
              </p>
            </div>

            <div className="relative mt-6 hidden grid-cols-3 gap-3 lg:grid" aria-hidden="true">
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

          <div className="px-4 py-6 min-[380px]:px-5 min-[380px]:py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="mx-auto max-w-md">
              <header className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <div className="size-12 overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(47,106,67,0.22),0_2px_6px_rgba(47,37,24,0.14)] sm:size-14">
                    <Image
                      src="/kaifa.svg"
                      alt="Kaifa"
                      width={1600}
                      height={1600}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
                <LogoutButton />
              </header>

              <div className="mb-6">
                <p className="text-xs font-black tracking-[0.16em] text-[#7b62bd] uppercase sm:text-sm sm:tracking-[0.18em]">
                  Pilih Pelajaran
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#2f2518] sm:text-4xl">
                  Mulai belajar
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#75644f]">
                  Setiap pelajaran punya materi interaktif yang siap menemani proses belajarmu.
                </p>
              </div>

              <div className="grid gap-4">
                {languages.map((language) => (
                  <Link
                    key={language.name}
                    href={`/syllabi?language=${language.language}`}
                    className="group rounded-3xl border border-[#ead8b7] bg-white/70 p-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`grid size-16 shrink-0 place-items-center rounded-2xl text-3xl font-black text-white transition sm:size-20 sm:text-4xl ${language.color} ${language.hoverColor} ${language.shadow}`}
                      >
                        {language.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-black tracking-wider text-[#8b765a] uppercase">
                          {language.greeting}
                        </span>
                        <span className="mt-1 block text-xl font-black text-[#2f2518] sm:text-2xl">
                          {language.name}
                        </span>
                        <span className="mt-1 hidden text-xs leading-5 text-[#75644f] min-[380px]:block">
                          {language.description}
                        </span>
                      </span>

                      <span className="flex shrink-0 flex-col items-end gap-3">
                        <span className="rounded-xl bg-[#f4ead6] px-2.5 py-1.5 text-xs font-black text-[#49321d]">
                          {language.badge}
                        </span>
                        <span className="grid size-8 place-items-center rounded-full bg-[#7154b7] text-[#fff6df] transition group-hover:translate-x-0.5">
                          <svg
                            viewBox="0 0 20 20"
                            className="size-4"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="m7 4 6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <NavPendingIndicator />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-7 text-center text-xs leading-5 text-[#8b765a]">
                Kamu dapat mengganti pelajaran belajar kapan saja.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
