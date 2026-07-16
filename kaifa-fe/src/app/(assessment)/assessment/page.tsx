'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AssessmentChat } from '@/features/assessment/components/assessment-chat';
import { startAssessmentClient } from '@/features/assessment/services/assessment.client';
import { SyllabusTranslations } from '@/features/syllabus/components/syllabus-translations';
import { getSyllabusClient, syllabusQueryKeys } from '@/features/syllabus/services/syllabus.client';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';

const assessmentPageCopy = {
  english: {
    backToModules: 'Back to modules',
    badge: 'Assessment',
    badgeTranslation: 'Penilaian',
    notFoundTitle: 'Assessment module not found',
    notFoundDescription: 'Select a module first so Kaifa can prepare the right practice session.',
    notFoundAction: 'Select learning module',
    startErrorTitle: 'Assessment cannot be started',
    startErrorDescription: 'Please choose a syllabus and module that match your student class.',
    startErrorAction: 'Back to modules',
    sessionLabel: 'Practice session',
    sessionLabelTranslation: 'Sesi latihan',
    sessionTitle: 'Practice with AI',
    sessionTitleTranslation: 'Berlatih dengan AI',
    sessionDescription: 'Answer with confidence. Kaifa will guide you and give feedback.',
    sessionDescriptionTranslation:
      'Jawab dengan percaya diri. Kaifa akan membimbing kamu dan memberikan umpan balik.',
    selectedMaterial: 'Selected material',
    selectedMaterialTranslation: 'Materi terpilih',
    fallbackActivities: ['Listen to AI', 'Answer the question', 'Get feedback'],
  },
  arabic: {
    backToModules: 'العودة إلى الوحدات',
    badge: 'التقييم',
    badgeTranslation: 'Penilaian',
    notFoundTitle: 'وحدة التقييم غير موجودة',
    notFoundDescription: 'اختر وحدة أولاً حتى تتمكن كايفا من إعداد جلسة التدريب المناسبة.',
    notFoundAction: 'اختر وحدة التعلم',
    startErrorTitle: 'تعذر بدء التقييم',
    startErrorDescription: 'يرجى اختيار منهج ووحدة تناسب صف الطالب.',
    startErrorAction: 'العودة إلى الوحدات',
    sessionLabel: 'جلسة تدريب',
    sessionLabelTranslation: 'Sesi latihan',
    sessionTitle: 'تدرّب مع الذكاء الاصطناعي',
    sessionTitleTranslation: 'Berlatih dengan AI',
    sessionDescription: 'أجب بثقة. سترافقك كايفا وتقدم لك ملاحظات.',
    sessionDescriptionTranslation:
      'Jawab dengan percaya diri. Kaifa akan membimbing kamu dan memberikan umpan balik.',
    selectedMaterial: 'المادة المختارة',
    selectedMaterialTranslation: 'Materi terpilih',
    fallbackActivities: ['استمع إلى الذكاء الاصطناعي', 'أجب عن السؤال', 'احصل على ملاحظات'],
  },
} satisfies Record<
  SyllabusLanguage,
  {
    backToModules: string;
    badge: string;
    badgeTranslation: string;
    notFoundTitle: string;
    notFoundDescription: string;
    notFoundAction: string;
    startErrorTitle: string;
    startErrorDescription: string;
    startErrorAction: string;
    sessionLabel: string;
    sessionLabelTranslation: string;
    sessionTitle: string;
    sessionTitleTranslation: string;
    sessionDescription: string;
    sessionDescriptionTranslation: string;
    selectedMaterial: string;
    selectedMaterialTranslation: string;
    fallbackActivities: string[];
  }
>;

function getLanguage(value: string | null): SyllabusLanguage | undefined {
  const language = value ?? undefined;
  return language === 'english' || language === 'arabic' ? language : undefined;
}

const buttonTranslations = {
  backToNodule: 'Kembali ke modul',
};

function formatActivityTitle(activity: string) {
  const trimmedActivity = activity.trim();
  if (!trimmedActivity) return '';

  return `${trimmedActivity.charAt(0).toUpperCase()}${trimmedActivity.slice(1)}`;
}

function createActivitySteps(activities: string[] | undefined, fallbackActivities: string[]) {
  const apiActivities =
    activities?.map((activity) => formatActivityTitle(activity)).filter(Boolean) ?? [];

  return apiActivities.length > 0 ? apiActivities : fallbackActivities;
}

function createTranslatedActivitySteps(
  translations: { activities?: string[] }[] | undefined,
): string[] {
  return (
    translations
      ?.find((translation) => translation.activities?.length)
      ?.activities?.map((activity) => formatActivityTitle(activity))
      .filter(Boolean) ?? []
  );
}

function getAssessmentStartErrorMessage(error: unknown, fallbackMessage: string) {
  if (!(error instanceof Error) || !error.message.trim()) return fallbackMessage;

  if (error.message.toLowerCase().includes('student class does not match syllabus class')) {
    return fallbackMessage;
  }

  return error.message;
}

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get('language'));
  const pageLanguage = language ?? 'english';
  const copy = assessmentPageCopy[pageLanguage];
  const unitId = searchParams.get('unit') ?? undefined;
  const moduleId = searchParams.get('module') ?? undefined;
  const { data: catalog = null } = useQuery({
    queryKey: syllabusQueryKeys.catalog(language),
    queryFn: () => getSyllabusClient(language as SyllabusLanguage),
    enabled: Boolean(language),
  });
  const unit = catalog?.units.find((item) => item.unit_id === unitId);
  const selectedModule = unit?.items.find((item) => item.item_id === moduleId);
  const topic =
    selectedModule?.topics?.[0] ?? selectedModule?.module_title ?? 'Conversation Practice';
  const modulesHref =
    language && catalog && unit ? `/modules?language=${language}&unit=${unit.unit_id}` : '/modules';
  const gradeHref =
    language && catalog && unit && selectedModule
      ? `/grade?language=${language}&unit=${unit.unit_id}&module=${selectedModule.item_id}`
      : '/grade';
  const activitySteps = createActivitySteps(selectedModule?.activities, copy.fallbackActivities);
  const translatedActivitySteps = createTranslatedActivitySteps(selectedModule?.translations);
  const { data: assessment = null, error: assessmentError } = useQuery({
    queryKey: ['assessment-start', selectedModule?.item_id],
    queryFn: () => startAssessmentClient(selectedModule?.item_id ?? ''),
    enabled: Boolean(selectedModule),
    retry: false,
  });
  const assessmentStartError = assessmentError
    ? getAssessmentStartErrorMessage(assessmentError, copy.startErrorDescription)
    : '';

  return (
    <main className="relative h-dvh overflow-hidden bg-[#f4dfbd] px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 text-[#2f2518] sm:px-6 sm:py-6 lg:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col">
        <header className="mb-2 flex shrink-0 items-center justify-between gap-3 sm:mb-5">
          <Link
            href={modulesHref}
            aria-label={copy.backToModules}
            className="inline-flex min-h-11 flex-col items-center justify-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-sm font-black text-[#49321d] shadow-[0_5px_0_#d3aa70] ring-1 ring-[#e8c890] transition hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">←</span>
              <span>{copy.backToModules}</span>
            </span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {buttonTranslations.backToNodule}
            </span>
          </Link>
          <span className="inline-flex flex-col items-center rounded-xl bg-[#fff6df] px-3 py-2 text-[11px] font-black text-[#49321d] ring-1 ring-[#e8c890] sm:rounded-2xl sm:px-4 sm:text-xs">
            <span>{copy.badge}</span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {copy.badgeTranslation}
            </span>
          </span>
        </header>

        {!catalog || !unit || !selectedModule ? (
          <section className="rounded-3xl border border-white/60 bg-[#fff9e9] px-5 py-16 text-center shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2b84b] text-2xl font-black text-[#49321d] shadow-[0_6px_0_#c88a27]">
              !
            </div>
            <h1 className="mt-6 text-3xl font-black">{copy.notFoundTitle}</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75644f]">
              {copy.notFoundDescription}
            </p>
            <Link
              href="/syllabi"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_#52388d]"
            >
              {copy.notFoundAction}
            </Link>
          </section>
        ) : assessmentStartError ? (
          <section className="rounded-3xl border border-white/60 bg-[#fff9e9] px-5 py-16 text-center shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2b84b] text-2xl font-black text-[#49321d] shadow-[0_6px_0_#c88a27]">
              !
            </div>
            <h1 className="mt-6 text-3xl font-black">{copy.startErrorTitle}</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75644f]">
              {assessmentStartError}
            </p>
            <Link
              href={modulesHref}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_#52388d]"
            >
              {copy.startErrorAction}
            </Link>
          </section>
        ) : (
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.34fr_0.66fr] lg:grid-rows-1">
            <aside className="hidden h-fit overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] shadow-[0_18px_50px_rgba(91,58,24,0.18)] sm:rounded-[2rem] lg:sticky lg:top-0 lg:block">
              <div className="relative overflow-hidden bg-[#2f6a43] px-5 py-7 text-[#fff6df] sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
                <div className="relative">
                  <span className="inline-flex flex-col rounded-full bg-[#fff6df]/15 px-3 py-1.5 text-xs font-bold ring-1 ring-[#fff6df]/25">
                    <span>{copy.sessionLabel}</span>
                    <span className="text-xs leading-4 font-medium text-[#fff6df]/65 italic">
                      {copy.sessionLabelTranslation}
                    </span>
                  </span>
                  <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight">
                    {copy.sessionTitle}
                  </h1>
                  <p className="text-xs leading-5 text-[#fff6df]/65 italic">
                    {copy.sessionTitleTranslation}
                  </p>
                  <p className="mt-4 text-sm leading-6 font-bold text-[#fff6df]/75">
                    {copy.sessionDescription}
                  </p>
                  <p className="text-xs leading-5 text-[#fff6df]/65 italic">
                    {copy.sessionDescriptionTranslation}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-black tracking-[0.16em] text-[#7b62bd] uppercase">
                  {copy.selectedMaterial}
                </p>
                <p className="text-xs leading-5 text-[#8b765a] italic">
                  {copy.selectedMaterialTranslation}
                </p>
                <h2 className="mt-2 text-xl font-black">{selectedModule.module_title}</h2>
                <SyllabusTranslations translations={selectedModule.translations} />
                <p className="mt-1 text-sm leading-6 text-[#75644f]">{unit.unit_title}</p>
                <SyllabusTranslations translations={unit.translations} compact />

                <div className="mt-5 space-y-3">
                  {activitySteps.map((title, index) => (
                    <div key={title} className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f2b84b] text-xs font-black text-[#49321d]">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs leading-4 font-black">{title}</p>
                        {translatedActivitySteps[index] && (
                          <p className="mt-0.5 text-[11px] leading-4 font-medium text-[#8b765a] italic">
                            {translatedActivitySteps[index]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <AssessmentChat
              activitySteps={activitySteps}
              gradeHref={gradeHref}
              initialReply={assessment?.reply}
              language={pageLanguage}
              moduleId={selectedModule.item_id}
              moduleTitle={selectedModule.module_title}
              moduleTranslations={selectedModule.translations}
              topic={topic}
              translatedActivitySteps={translatedActivitySteps}
              unitTitle={unit.unit_title}
              unitTranslations={unit.translations}
            />
          </div>
        )}
      </div>
    </main>
  );
}
