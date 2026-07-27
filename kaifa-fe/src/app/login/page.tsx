'use client';

import Image from 'next/image';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-3 py-4 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center sm:min-h-[calc(100dvh-4rem)]">
        <section className="grid w-full overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden overflow-hidden bg-[#2f6a43] p-10 text-[#fff6df] lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.17),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
            <div className="relative">
              <span className="inline-flex rounded-full bg-[#fff6df]/15 px-4 py-2 text-sm font-bold ring-1 ring-[#fff6df]/25">
                Belajar bersama Kaifa
              </span>
              <h1 className="mt-8 text-6xl leading-[0.95] font-black tracking-tight">
                Belajar jadi lebih seru, bareng AI.
              </h1>
              <p className="mt-6 max-w-sm text-lg leading-8 text-[#fff6df]/80">
                Materi sesuai jenjang, latihan interaktif, dan pendamping belajar AI.
              </p>
            </div>

            <div className="relative mt-12 grid grid-cols-3 gap-3" aria-hidden="true">
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

          <div className="px-4 py-6 min-[380px]:px-5 min-[380px]:py-8 sm:px-10 sm:py-12 lg:px-14">
            <div className="mx-auto max-w-md">
              <div className="mb-6 text-center sm:mb-8 lg:text-left">
                <div className="mx-auto mb-4 size-14 overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(47,106,67,0.24),0_2px_6px_rgba(47,37,24,0.16)] sm:mb-5 sm:size-16 lg:mx-0">
                  <Image
                    src="/kaifa.svg"
                    alt="Kaifa"
                    width={1600}
                    height={1600}
                    className="size-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-[#7b62bd]">
                  <p className="text-2xl leading-none font-black sm:text-3xl" lang="ar" dir="rtl">
                    السلام عليكم
                  </p>
                  <p className="sm:text-xxs text-[0.68rem] font-black tracking-[0.16em] uppercase sm:tracking-[0.18em]">
                    Assalamu&apos;alaykum
                  </p>
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#2f2518] sm:text-4xl">
                  Selamat datang
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#75644f]">
                  Masuk dengan akun Anda untuk melanjutkan belajar.
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
