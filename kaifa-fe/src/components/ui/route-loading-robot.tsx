'use client';

import { useSearchParams } from 'next/navigation';

interface RouteLoadingRobotProps {
  message?: string;
  translation?: string;
  arabicMessage?: string;
  tone?: 'green' | 'purple';
}

const messageTranslations: Record<string, string> = {
  'Kaifa AI is preparing your next session...': 'Kaifa AI sedang menyiapkan sesi berikutnya...',
  'Kaifa AI is building your learning path...': 'Kaifa AI sedang menyusun learning path-mu...',
  'Kaifa AI is calculating your grade...': 'Kaifa AI sedang menghitung nilaimu...',
  'Kaifa AI is preparing your assessment...': 'Kaifa AI sedang menyiapkan penilaianmu...',
  'Kaifa AI is mapping your syllabus...': 'Kaifa AI sedang memetakan silabusmu...',
  'Kaifa AI is arranging your modules...': 'Kaifa AI sedang menyusun modul-modulmu...',
  'Kaifa AI is opening your learning chat...': 'Kaifa AI sedang membuka chat belajar-mu...',
};

export function RouteLoadingRobot({
  message = 'Kaifa AI is preparing your next session...',
  translation,
  arabicMessage,
  tone = 'green',
}: RouteLoadingRobotProps) {
  const searchParams = useSearchParams();
  const isArabic = searchParams.get('language') === 'arabic';
  const activeMessage = isArabic && arabicMessage ? arabicMessage : message;
  const activeTranslation = translation ?? (message ? messageTranslations[message] : undefined);
  const isPurple = tone === 'purple';
  const accentClass = isPurple ? 'bg-[#7154b7]' : 'bg-[#2f6a43]';
  const shadowClass = isPurple ? 'shadow-[0_7px_0_#52388d]' : 'shadow-[0_7px_0_#245234]';
  const textClass = isPurple ? 'text-[#7154b7]' : 'text-[#2f6a43]';

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-4 py-6 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <section className="relative mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-4xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] p-5 text-center shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto grid max-w-xl place-items-center">
            <div className="relative grid size-40 place-items-center sm:size-48" aria-hidden="true">
              <span className="kaifa-ai-orbit absolute inset-0 rounded-full border-2 border-dashed border-[#dfcda9]" />
              <span className="kaifa-ai-pulse absolute inset-5 rounded-full bg-[#f2b84b]/25" />

              <div className="kaifa-ai-float relative">
                <div className="mx-auto h-8 w-1.5 rounded-full bg-[#49321d]" />
                <div className="mx-auto size-5 rounded-full bg-[#f2b84b] shadow-[0_0_0_5px_rgba(242,184,75,0.22)]" />
                <div
                  className={`mt-1 w-32 rounded-[1.5rem] border-4 border-[#49321d] ${accentClass} ${shadowClass} p-3 sm:w-36`}
                >
                  <div className="rounded-2xl bg-[#fff6df] px-3 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="kaifa-ai-eye size-4 rounded-full bg-[#49321d]" />
                      <span className="kaifa-ai-eye kaifa-ai-eye-delayed size-4 rounded-full bg-[#49321d]" />
                    </div>
                    <div className="mx-auto mt-4 h-2 w-14 rounded-full bg-[#f2b84b]" />
                  </div>
                </div>
                <div className="mx-auto mt-1 flex w-24 justify-between">
                  <span className="h-7 w-3 rounded-full bg-[#49321d]" />
                  <span className="h-7 w-3 rounded-full bg-[#49321d]" />
                </div>
              </div>

              {[0, 1, 2].map((item) => (
                <span
                  key={item}
                  className={`kaifa-ai-chip absolute rounded-lg ${accentClass}`}
                  style={{ animationDelay: `${item * 0.32}s` }}
                />
              ))}
            </div>

            <h1
              className={`mt-5 max-w-md text-2xl leading-tight font-black sm:text-3xl ${textClass}`}
              dir={isArabic && arabicMessage ? 'rtl' : 'ltr'}
              lang={isArabic && arabicMessage ? 'ar' : 'en'}
            >
              {activeMessage}
            </h1>
            {activeTranslation ? (
              <p className="mt-1 max-w-md text-sm leading-6 font-medium text-[#8b765a] italic">
                {activeTranslation}
              </p>
            ) : null}

            <div className="mt-7 grid w-full gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-[#ead8b7] bg-white/70 p-4"
                >
                  <div className="kaifa-ai-scan h-3 rounded-full bg-[#ead8b7]" />
                  <div className="kaifa-ai-scan mt-3 h-3 w-2/3 rounded-full bg-[#ead8b7]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
