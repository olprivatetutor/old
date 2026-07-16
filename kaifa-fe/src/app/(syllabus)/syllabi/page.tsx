'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NavPendingIndicator } from '@/components/ui/nav-pending-indicator';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { SyllabusTranslations } from '@/features/syllabus/components/syllabus-translations';
import { getSyllabusClient, syllabusQueryKeys } from '@/features/syllabus/services/syllabus.client';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';
import SyllabiLoading from './loading';

function getLanguage(value: string | null): SyllabusLanguage | undefined {
  const language = value ?? undefined;
  return language === 'english' || language === 'arabic' ? language : undefined;
}

const buttonTranslations = {
  backToLanguage: 'Pilih bahasa',
  logout: 'Keluar',
  loggingOut: 'Sedang keluar...',
};

const syllabiCopy: Record<
  SyllabusLanguage,
  {
    backToLanguage: string;
    logout: string;
    loggingOut: string;
    step: string;
    stepTranslation?: string;
    title: string;
    titleTranslation: string;
    description: string;
    descriptionTranslation: string;
    stats: {
      grade: string;
      gradeTranslation?: string;
      unit: string;
      unitTranslation?: string;
    };
    unavailableTitle: string;
    unavailableDescription: (languageName: string) => string;
    unavailableAction: string;
    availableUnits: string;
    availableUnitsTranslation: string;
    chooseUnitHint: string;
    chooseUnitActionTranslation: string;
    chooseUnitHintTranslation: string;
    unitLabel: (index: number) => string;
    unitLabelTranslation: (index: number) => string;
    moduleCount: (count: number) => string;
    moduleCountTranslation: (count: number) => string;
    chooseUnitAction: string;
    fallbackLanguage: string;
  }
> = {
  english: {
    backToLanguage: 'Select language',
    logout: 'Log out',
    loggingOut: 'Logging out...',
    step: 'Step 1 of 2',
    stepTranslation: 'Langkah 1 dari 2',
    title: 'Select your learning unit',
    titleTranslation: 'Pilih unit pembelajaran kamu',
    description: 'Pick the theme you want to study, then choose a module inside it.',
    descriptionTranslation: 'Pilih tema yang ingin kamu pelajari, lalu pilih modul di dalamnya.',
    stats: {
      grade: 'Grade',
      gradeTranslation: 'Kelas',
      unit: 'Unit',
      unitTranslation: 'Unit',
    },
    unavailableTitle: 'Syllabus is not available yet',
    unavailableDescription: (languageName) =>
      `Syllabus data for ${languageName} is not available yet. Please choose another language.`,
    unavailableAction: 'Back to language selection',
    availableUnits: 'Available units',
    availableUnitsTranslation: 'Unit yang tersedia',
    chooseUnitHint: 'Select one unit to see its modules.',
    chooseUnitHintTranslation: 'Pilih satu unit untuk melihat modulnya.',
    unitLabel: (index) => `Unit ${index}`,
    unitLabelTranslation: (index) => `Unit ${index}`,
    moduleCount: (count) => `${count} ${count === 1 ? 'module' : 'modules'}`,
    moduleCountTranslation: (count) => `${count} modul`,
    chooseUnitAction: 'Select unit',
    chooseUnitActionTranslation: 'Pilih unit',
    fallbackLanguage: 'this language',
  },
  arabic: {
    backToLanguage: 'اختر اللغة',
    logout: 'خروج',
    loggingOut: 'جار الخروج...',
    step: 'الخطوة 1 من 2',
    title: 'اختر وحدة التعلم',
    titleTranslation: 'Pilih unit pembelajaran kamu',
    description: 'اختر الموضوع الذي تريد دراسته، ثم اختر الوحدة الفرعية بداخله.',
    descriptionTranslation: 'Pilih tema yang ingin kamu pelajari, lalu pilih modul di dalamnya.',
    stats: {
      grade: 'الصف الدراسي',
      gradeTranslation: 'Kelas',
      unit: 'الوحدة',
      unitTranslation: 'Unit',
    },
    unavailableTitle: 'المنهج غير متاح بعد',
    unavailableDescription: (languageName) =>
      `بيانات المنهج للغة ${languageName} غير متاحة بعد. يرجى اختيار لغة أخرى.`,
    unavailableAction: 'العودة لاختيار اللغة',
    availableUnits: 'الوحدات المتاحة',
    availableUnitsTranslation: 'Unit yang tersedia',
    chooseUnitHint: 'اختر وحدة واحدة لرؤية الوحدات الفرعية.',
    chooseUnitHintTranslation: 'Pilih satu unit untuk melihat modulnya.',
    unitLabel: (index) => `الوحدة ${index}`,
    unitLabelTranslation: (index) => `Unit ${index}`,
    moduleCount: (count) => `${count} ${count === 1 ? 'وحدة فرعية' : 'وحدات فرعية'}`,
    moduleCountTranslation: (count) => `${count} modul`,
    chooseUnitAction: 'اختر الوحدة',
    chooseUnitActionTranslation: 'Pilih unit',
    fallbackLanguage: 'هذه اللغة',
  },
};

export default function SyllabiPage() {
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get('language'));
  const copy = syllabiCopy[language ?? 'english'];
  const { data: catalog = null, isLoading } = useQuery({
    queryKey: syllabusQueryKeys.catalog(language),
    queryFn: () => getSyllabusClient(language as SyllabusLanguage),
    enabled: Boolean(language),
  });
  const languageName = catalog?.subject ?? language ?? copy.fallbackLanguage;
  const curriculumTranslation = language === 'arabic' ? 'Bahasa Arab CEFR' : 'Bahasa Inggris CEFR';
  const levelTranslation = catalog?.translations?.[0]?.description ?? catalog?.level;

  if (language && isLoading) {
    return <SyllabiLoading />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-3 py-4 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/languages"
            className="inline-flex min-h-11 flex-col items-center justify-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-sm font-black text-[#49321d] shadow-[0_5px_0_#d3aa70] ring-1 ring-[#e8c890] transition hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">←</span>
              <span>{copy.backToLanguage}</span>
            </span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {buttonTranslations.backToLanguage}
            </span>
          </Link>
          <LogoutButton
            label={copy.logout}
            loadingLabel={copy.loggingOut}
            subLabel={buttonTranslations.logout}
            loadingSubLabel={buttonTranslations.loggingOut}
          />
        </header>

        <section className="overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
          <div className="relative overflow-hidden bg-[#2f6a43] px-5 py-7 text-[#fff6df] sm:px-8 sm:py-9 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.17),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex flex-col rounded-full bg-[#fff6df]/15 px-4 py-2 text-center text-xs font-bold ring-1 ring-[#fff6df]/25 sm:text-sm">
                  <span>{copy.step}</span>
                  <span className="text-[10px] leading-4 font-medium text-[#fff6df]/75 italic">
                    {copy.stepTranslation ?? 'Langkah 1 dari 2'}
                  </span>
                </span>
                <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="text-xs leading-5 font-medium text-[#fff6df]/80 italic sm:text-xs">
                  {copy.titleTranslation}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#fff6df]/80 sm:text-base">
                  {copy.description}
                </p>
                <p className="text-xs leading-5 font-medium text-[#fff6df]/80 italic sm:text-xs">
                  {copy.descriptionTranslation}
                </p>
              </div>

              {catalog && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    {
                      label: copy.stats.grade,
                      translation: copy.stats.gradeTranslation,
                      value: String(catalog.grade),
                    },
                    {
                      label: copy.stats.unit,
                      translation: copy.stats.unitTranslation,
                      value: String(catalog.units.length),
                    },
                  ].map(({ label, translation, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-[#fff6df]/12 px-3 py-3 text-center ring-1 ring-[#fff6df]/20 sm:px-5"
                    >
                      <span className="block text-[10px] font-bold tracking-wider text-[#fff6df]/65 uppercase">
                        {label}
                      </span>
                      {translation && (
                        <span className="mt-0.5 block text-[10px] font-medium text-[#fff6df]/70 italic">
                          {translation}
                        </span>
                      )}
                      <span className="mt-1 block text-lg font-black">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-6 min-[380px]:px-5 sm:px-8 sm:py-9 lg:px-10">
            {!catalog ? (
              <div className="mx-auto max-w-xl rounded-3xl border border-[#ead8b7] bg-white/70 px-5 py-10 text-center shadow-sm">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2b84b] text-2xl font-black text-[#49321d] shadow-[0_6px_0_#c88a27]">
                  !
                </div>
                <h2 className="mt-6 text-2xl font-black">{copy.unavailableTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-[#75644f]">
                  {copy.unavailableDescription(languageName)}
                </p>
                <Link
                  href="/languages"
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_#52388d] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
                >
                  {copy.unavailableAction}
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black tracking-[0.16em] text-[#7b62bd] uppercase">
                      {catalog.curriculum} · {catalog.level}
                    </p>
                    <p className="text-xs leading-5 font-medium text-[#8b765a] italic sm:text-xs">
                      {curriculumTranslation} · {levelTranslation}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                      {copy.availableUnits}
                    </h2>
                    <p className="text-xs leading-5 font-medium text-[#8b765a] italic sm:text-xs">
                      {copy.availableUnitsTranslation}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm leading-5 font-medium text-[#8b765a] italic">
                      {copy.chooseUnitHint}
                    </p>
                    <p className="text-xs leading-5 font-medium text-[#8b765a] italic">
                      {copy.chooseUnitHintTranslation}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {catalog.units.map((unit, index) => {
                    const modulesHref = `/modules?language=${language}&unit=${unit.unit_id}`;

                    return (
                      <article
                        key={`${unit.unit_id}-${index}`}
                        className="flex flex-col rounded-3xl border border-[#ead8b7] bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-11 place-items-center rounded-2xl bg-[#2f6a43] text-lg font-black text-[#fff6df]">
                            {index + 1}
                          </span>
                          <span className="rounded-xl bg-[#f4ead6] px-2.5 py-1.5 text-xs font-black text-[#49321d]">
                            <span className="block">{copy.moduleCount(unit.items.length)}</span>
                            <span className="block text-[10px] leading-4 font-medium text-[#7a664e] italic">
                              {copy.moduleCountTranslation(unit.items.length)}
                            </span>
                          </span>
                        </div>

                        <p className="mt-5 text-xs font-black tracking-wider text-[#8b765a] uppercase">
                          {copy.unitLabel(index + 1)}
                        </p>
                        <p className="text-[10px] leading-4 font-medium text-[#8b765a] italic">
                          {copy.unitLabelTranslation(index + 1)}
                        </p>
                        <h3 className="mt-1 text-xl font-black">{unit.unit_title}</h3>
                        <SyllabusTranslations translations={unit.translations} compact />

                        <ul className="mt-5 flex-1 space-y-2 text-xs leading-5 text-[#75644f]">
                          {unit.items.map((item, itemIndex) => (
                            <li key={`${item.item_id}-${itemIndex}`} className="flex gap-2">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#7154b7]" />
                              <span className="min-w-0 flex-1">
                                <span className="text-sm font-semibold text-[#5f4d38]">
                                  {item.module_title}
                                </span>
                                <SyllabusTranslations translations={item.translations} compact />
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={modulesHref}
                          className="mt-6 inline-flex min-h-12 flex-col items-center justify-center rounded-2xl bg-[#2f6a43] px-5 py-3 text-sm font-black text-white shadow-[0_5px_0_#234d31] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#2f6a43]/40 focus-visible:outline-none"
                        >
                          <span>{copy.chooseUnitAction}</span>
                          <span className="text-xs leading-5 font-medium text-[#fff6df]/80 italic sm:text-xs">
                            {copy.chooseUnitActionTranslation}
                          </span>
                          <NavPendingIndicator />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
