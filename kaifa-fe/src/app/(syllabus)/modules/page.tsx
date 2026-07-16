'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NavPendingIndicator } from '@/components/ui/nav-pending-indicator';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { SyllabusTranslations } from '@/features/syllabus/components/syllabus-translations';
import { getSyllabusClient, syllabusQueryKeys } from '@/features/syllabus/services/syllabus.client';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';
import ModulesLoading from './loading';

function getLanguage(value: string | null): SyllabusLanguage | undefined {
  const language = value ?? undefined;
  return language === 'english' || language === 'arabic' ? language : undefined;
}

const buttonTranslations = {
  backToLanguage: 'Pilih unit',
  logout: 'Keluar',
  loggingOut: 'Sedang keluar...',
};

function getTranslatedTopics(translations: { topic_scope?: string }[] | undefined) {
  const topicScope = translations?.find((translation) => translation.topic_scope)?.topic_scope;

  return (
    topicScope
      ?.split(',')
      .map((topic) => topic.trim())
      .filter(Boolean) ?? []
  );
}

const modulesCopy: Record<
  SyllabusLanguage,
  {
    backToUnits: string;
    logout: string;
    loggingOut: string;
    step: string;
    stepTranslation: string;
    title: string;
    titleTranslation: string;
    description: (unitTitle?: string) => string;
    descriptionTranslation: (unitTitle?: string) => string;
    curriculumTranslation: string;
    stats: {
      grade: string;
      gradeTranslation?: string;
      module: string;
      moduleTranslation?: string;
    };
    notFoundTitle: string;
    notFoundDescription: string;
    notFoundAction: string;
    gradeLabel: string;
    moduleLabel: (index: number) => string;
    moduleLabelTranslation: (index: number) => string;
    topicCountTranslation: (count: number) => string;
    topicCount: (count: number) => string;
    topicFallback: string;
    assessmentAction: string;
    assessmentActionTranslation?: string;
  }
> = {
  english: {
    backToUnits: 'Select unit',
    logout: 'Log out',
    loggingOut: 'Logging out...',
    step: 'Step 2 of 2',
    stepTranslation: 'Langkah 2 dari 2',
    title: 'Select your learning module',
    titleTranslation: 'Pilih modul pembelajaran kamu',
    description: (unitTitle) =>
      unitTitle
        ? `Select material from "${unitTitle}".`
        : 'Select a unit first to see the available modules.',
    descriptionTranslation: (unitTitle) =>
      unitTitle
        ? `Pilih materi dari "${unitTitle}".`
        : 'Pilih satu unit terlebih dahulu untuk melihat modul yang tersedia.',
    curriculumTranslation: 'Bahasa Inggris CEFR',
    stats: {
      grade: 'Grade',
      gradeTranslation: 'Kelas',
      module: 'Module',
      moduleTranslation: 'Modul',
    },
    notFoundTitle: 'Unit not found',
    notFoundDescription: 'Go back to the unit page and select one of the available units.',
    notFoundAction: 'Back to unit selection',
    gradeLabel: 'Grade',
    moduleLabel: (index) => `Module ${index}`,
    moduleLabelTranslation: (index) => `Modul ${index}`,
    topicCount: (count) => `${count} ${count === 1 ? 'topic' : 'topics'}`,
    topicCountTranslation: (count) => `${count} topik`,
    topicFallback: 'Topic details will be available when the module starts.',
    assessmentAction: 'Start assessment',
    assessmentActionTranslation: 'Mulai penilaian',
  },
  arabic: {
    backToUnits: 'اختر الوحدة',
    logout: 'خروج',
    loggingOut: 'جار الخروج...',
    step: 'الخطوة 2 من 2',
    stepTranslation: 'Langkah 2 dari 2',
    title: 'اختر وحدة التعلم الفرعية',
    titleTranslation: 'Pilih modul pembelajaran kamu',
    description: (unitTitle) =>
      unitTitle
        ? `اختر المادة من وحدة "${unitTitle}".`
        : 'اختر وحدة أولاً لرؤية الوحدات الفرعية المتاحة.',
    descriptionTranslation: (unitTitle) =>
      unitTitle
        ? `Pilih materi dari "${unitTitle}".`
        : 'Pilih satu unit terlebih dahulu untuk melihat modul yang tersedia.',
    curriculumTranslation: 'Bahasa Arab CEFR',
    stats: {
      grade: 'الصف الدراسي',
      gradeTranslation: 'Kelas',
      module: 'الوحدة الفرعية',
      moduleTranslation: 'Modul',
    },
    notFoundTitle: 'الوحدة غير موجودة',
    notFoundDescription: 'ارجع إلى صفحة الوحدات واختر إحدى الوحدات المتاحة.',
    notFoundAction: 'العودة لاختيار الوحدة',
    gradeLabel: 'الصف الدراسي',
    moduleLabel: (index) => `الوحدة الفرعية ${index}`,
    moduleLabelTranslation: (index) => `Modul ${index}`,
    topicCount: (count) => `${count} ${count === 1 ? 'موضوع' : 'موضوعات'}`,
    topicCountTranslation: (count) => `${count} topik`,
    topicFallback: 'ستتوفر تفاصيل الموضوع عند بدء الوحدة الفرعية.',
    assessmentAction: 'ابدأ التقييم',
    assessmentActionTranslation: 'Mulai penilaian',
  },
};

export default function ModulesPage() {
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get('language'));
  const copy = modulesCopy[language ?? 'english'];
  const unitId = searchParams.get('unit') ?? undefined;
  const selectedModule = searchParams.get('module') ?? undefined;
  const { data: catalog = null, isLoading } = useQuery({
    queryKey: syllabusQueryKeys.catalog(language),
    queryFn: () => getSyllabusClient(language as SyllabusLanguage),
    enabled: Boolean(language),
  });
  const unit = catalog?.units.find((item) => item.unit_id === unitId);
  const translatedUnitTitle = unit?.translations?.[0]?.title ?? unit?.unit_title;
  const syllabiHref = language ? `/syllabi?language=${language}` : '/syllabi';

  if (language && isLoading) {
    return <ModulesLoading />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-3 py-4 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <Link
            href={syllabiHref}
            className="inline-flex min-h-11 flex-col items-center justify-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-sm font-black text-[#49321d] shadow-[0_5px_0_#d3aa70] ring-1 ring-[#e8c890] transition hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">←</span>
              <span>{copy.backToUnits}</span>
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
          <div className="relative overflow-hidden bg-[#7154b7] px-5 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.2),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.16))]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex flex-col rounded-full bg-white/15 px-4 py-2 text-xs font-bold ring-1 ring-white/25 sm:text-sm">
                  <span>{copy.step}</span>
                  <span className="text-[10px] leading-4 font-medium text-white/75 italic">
                    {copy.stepTranslation}
                  </span>
                </span>
                <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="text-xs leading-5 font-medium text-[#fff6df]/80 italic sm:text-xs">
                  {copy.titleTranslation}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                  {copy.description(unit?.unit_title)}
                </p>
                <p className="text-xs leading-5 font-medium text-[#fff6df]/80 italic sm:text-xs">
                  {copy.descriptionTranslation(translatedUnitTitle)}
                </p>
              </div>

              {catalog && unit && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-2xl bg-[#fff6df]/12 px-3 py-3 text-center ring-1 ring-[#fff6df]/20 sm:px-5">
                    <span className="block text-[10px] font-bold tracking-wider text-[#fff6df]/65 uppercase">
                      {copy.stats.grade}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-[#fff6df]/70 italic">
                      {copy.stats.gradeTranslation}
                    </span>
                    <span className="mt-1 block text-lg font-black">{catalog.grade}</span>
                  </div>
                  <div className="rounded-2xl bg-[#fff6df]/12 px-3 py-3 text-center ring-1 ring-[#fff6df]/20 sm:px-5">
                    <span className="block text-[10px] font-bold tracking-wider text-[#fff6df]/65 uppercase">
                      {copy.stats.module}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-[#fff6df]/70 italic">
                      {copy.stats.moduleTranslation}
                    </span>
                    <span className="mt-1 block text-lg font-black">{unit.items.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-6 min-[380px]:px-5 sm:px-8 sm:py-9 lg:px-10">
            {!catalog || !unit ? (
              <div className="mx-auto max-w-xl rounded-3xl border border-[#ead8b7] bg-white/70 px-5 py-10 text-center shadow-sm">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2b84b] text-2xl font-black text-[#49321d] shadow-[0_6px_0_#c88a27]">
                  !
                </div>
                <h2 className="mt-6 text-2xl font-black">{copy.notFoundTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-[#75644f]">{copy.notFoundDescription}</p>
                <Link
                  href={syllabiHref}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_#52388d] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
                >
                  {copy.notFoundAction}
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs font-black tracking-[0.16em] text-[#2f6a43] uppercase">
                    {catalog.curriculum} · {copy.gradeLabel} {catalog.grade}
                  </p>
                  <p className="mt-1 text-xs leading-5 font-medium text-[#75644f] italic sm:text-xs">
                    {copy.curriculumTranslation} · {copy.stats.gradeTranslation} {catalog.grade}
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    {unit.unit_title}
                  </h2>
                  <SyllabusTranslations translations={unit.translations} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {unit.items.map((module, index) => {
                    const isSelected = module.item_id === selectedModule;
                    const moduleHref = `/assessment?language=${language}&unit=${unit.unit_id}&module=${module.item_id}`;
                    const translatedTopics = getTranslatedTopics(module.translations);

                    return (
                      <article
                        key={module.item_id}
                        className={`flex flex-col rounded-3xl border px-5 py-6 transition sm:p-7 ${
                          isSelected
                            ? 'border-[#2f6a43] bg-[#e8f1e8] shadow-[0_8px_0_#bed5c1]'
                            : 'border-[#ead8b7] bg-white/70 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-11 place-items-center rounded-2xl bg-[#7154b7] text-lg font-black text-white">
                            {index + 1}
                          </span>
                          <span className="rounded-xl bg-[#f4ead6] px-2.5 py-1.5 text-center text-xs font-black text-[#49321d]">
                            <span className="block">
                              {copy.topicCount(module.topics?.length ?? 0)}
                            </span>
                            <span className="block text-[10px] leading-4 font-medium text-[#7a664e] italic">
                              {copy.topicCountTranslation(module.topics?.length ?? 0)}
                            </span>
                          </span>
                        </div>

                        <p className="mt-5 text-xs font-black tracking-wider text-[#8b765a] uppercase">
                          {copy.moduleLabel(index + 1)}
                        </p>
                        <p className="text-[10px] leading-4 font-medium text-[#8b765a] italic">
                          {copy.moduleLabelTranslation(index + 1)}
                        </p>
                        <h3 className="mt-1 text-xl font-black">{module.module_title}</h3>
                        <SyllabusTranslations translations={module.translations} />

                        {module.topics?.length ? (
                          <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                            {module.topics.map((topic, topicIndex) => (
                              <span
                                key={topic}
                                className="inline-flex flex-col rounded-2xl bg-[#f2ecff] px-2.5 py-1 text-[11px] leading-4 font-bold text-[#65499d]"
                              >
                                <span>{topic}</span>
                                {translatedTopics[topicIndex] && (
                                  <span className="text-[10px] leading-3 font-medium text-[#8f7bb5] italic">
                                    {translatedTopics[topicIndex]}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 flex-1 text-xs leading-5 text-[#75644f]">
                            {copy.topicFallback}
                          </p>
                        )}

                        <Link
                          href={moduleHref}
                          aria-current={isSelected ? 'true' : undefined}
                          className={`mt-6 inline-flex min-h-12 flex-col items-center justify-center rounded-2xl px-5 py-3 text-sm font-black text-white shadow-[0_5px_0_rgba(73,50,29,0.22)] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none ${
                            isSelected ? 'bg-[#2f6a43]' : 'bg-[#7154b7]'
                          }`}
                        >
                          <span>{copy.assessmentAction}</span>
                          <span className="text-xs leading-5 font-medium text-[#fff6df]/80 italic sm:text-xs">
                            {copy.assessmentActionTranslation}
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
