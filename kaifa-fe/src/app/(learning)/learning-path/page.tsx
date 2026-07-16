'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NavPendingIndicator } from '@/components/ui/nav-pending-indicator';
import {
  generateLearningPathClient,
  learningQueryKeys,
} from '@/features/learning/services/learning.client';
import type { LearningPathItemTranslation } from '@/features/learning/types/learning.types';
import { getSyllabusClient, syllabusQueryKeys } from '@/features/syllabus/services/syllabus.client';
import type {
  SyllabusLanguage,
  SyllabusTranslation,
} from '@/features/syllabus/types/syllabus.types';
import LearningPathLoading from './loading';

const learningPathCopy = {
  english: {
    backToAssessment: 'Assessment result',
    backToAssessmentTranslation: 'Hasil penilaian',
    badge: 'Learning Path',
    badgeTranslation: 'Jalur belajar',
    unavailableTitle: 'Learning path is not available yet',
    unavailableDescription: 'Complete the assessment for your selected module first.',
    unavailableAction: 'Choose module',
    personalizedBadge: 'Made for you by AI',
    personalizedBadgeTranslation: 'Dibuat khusus untukmu oleh AI',
    heroTitle: 'Your learning path is ready',
    heroTitleTranslation: 'Jalur belajarmu sudah siap',
    stats: {
      level: 'Level',
      score: 'Score',
      step: 'Steps',
      session: 'Sessions',
    },
    statsTranslation: {
      level: 'Level',
      score: 'Skor',
      step: 'Langkah',
      session: 'Sesi',
    },
    sequenceHint: 'Follow the sessions in order so your skills grow step by step.',
    sequenceHintTranslation:
      'Ikuti sesi secara berurutan agar kemampuanmu berkembang langkah demi langkah.',
    targetLabel: 'Target',
    timeLabel: 'min',
    topicLabel: 'Topic',
    startAction: 'Start',
    startActionTranslation: 'Mulai',
  },
  arabic: {
    backToAssessment: 'نتيجة التقييم',
    badge: 'مسار التعلم',
    unavailableTitle: 'مسار التعلم غير متاح بعد',
    unavailableDescription: 'أكمل تقييم الوحدة الفرعية التي اخترتها أولاً.',
    unavailableAction: 'اختر وحدة فرعية',
    personalizedBadge: 'مصمم لك بالذكاء الاصطناعي',
    heroTitle: 'مسار التعلم الخاص بك جاهز',
    stats: {
      level: 'المستوى',
      score: 'الدرجة',
      step: 'الخطوات',
      session: 'الجلسات',
    },
    sequenceHint: 'اتبع الجلسات بالترتيب حتى تتطور مهاراتك خطوة بخطوة.',
    sequenceHintTranslation:
      'Ikuti sesi secara berurutan agar kemampuanmu berkembang langkah demi langkah.',
    targetLabel: 'الهدف',
    timeLabel: 'دقيقة',
    topicLabel: 'الموضوع',
    startAction: 'ابدأ',
    startActionTranslation: 'Mulai',
  },
} satisfies Record<
  SyllabusLanguage,
  {
    backToAssessment: string;
    backToAssessmentTranslation?: string;
    badge: string;
    badgeTranslation?: string;
    unavailableTitle: string;
    unavailableDescription: string;
    unavailableAction: string;
    personalizedBadge: string;
    personalizedBadgeTranslation?: string;
    heroTitle: string;
    heroTitleTranslation?: string;
    stats: {
      level: string;
      score: string;
      step: string;
      session: string;
    };
    statsTranslation?: {
      level: string;
      score: string;
      step: string;
      session: string;
    };
    sequenceHint: string;
    sequenceHintTranslation: string;
    targetLabel: string;
    timeLabel: string;
    topicLabel: string;
    startAction: string;
    startActionTranslation?: string;
  }
>;

type LearningPathCopy = {
  backToAssessment: string;
  backToAssessmentTranslation?: string;
  badge: string;
  badgeTranslation?: string;
  unavailableTitle: string;
  unavailableDescription: string;
  unavailableAction: string;
  personalizedBadge: string;
  personalizedBadgeTranslation?: string;
  heroTitle: string;
  heroTitleTranslation?: string;
  stats: {
    level: string;
    score: string;
    step: string;
    session: string;
  };
  statsTranslation?: {
    level: string;
    score: string;
    step: string;
    session: string;
  };
  sequenceHint: string;
  sequenceHintTranslation: string;
  targetLabel: string;
  timeLabel: string;
  topicLabel: string;
  startAction: string;
  startActionTranslation?: string;
};

const focusStyles: Record<string, string> = {
  Percakapan: 'bg-[#e8f1e8] text-[#2f6a43]',
  Kosakata: 'bg-[#f2ecff] text-[#7154b7]',
  'Tata bahasa': 'bg-[#fff1d5] text-[#9a681d]',
  Praktik: 'bg-[#fce8e4] text-[#a64438]',
  explanation: 'bg-[#e8f1e8] text-[#2f6a43]',
  practice: 'bg-[#fce8e4] text-[#a64438]',
  vocabulary: 'bg-[#f2ecff] text-[#7154b7]',
  grammar: 'bg-[#fff1d5] text-[#9a681d]',
  speaking: 'bg-[#e8f1e8] text-[#2f6a43]',
  listening: 'bg-[#e8eefc] text-[#355aa6]',
  reading: 'bg-[#fff1d5] text-[#9a681d]',
  writing: 'bg-[#f2ecff] text-[#7154b7]',
};

const defaultFocusStyle = 'bg-[#eef1f4] text-[#4a5565]';

function getLanguage(value: string | null): SyllabusLanguage | undefined {
  const language = value ?? undefined;
  return language === 'english' || language === 'arabic' ? language : undefined;
}

function getStepTranslation(
  translations: LearningPathItemTranslation[] | undefined,
): LearningPathItemTranslation | undefined {
  return translations?.find(
    (translation) =>
      translation.title ||
      translation.description ||
      translation.activity ||
      translation.activities?.length ||
      translation.topicScope ||
      translation.grammar_focus?.length,
  );
}

function getSyllabusTitleTranslation(translations: { title?: string }[] | undefined) {
  return translations?.find((translation) => translation.title)?.title;
}

function getSyllabusGrammarFocusTranslation(translations: SyllabusTranslation[] | undefined) {
  return translations?.find((translation) => translation.grammar_focus?.length)?.grammar_focus;
}

export default function LearningPathPage() {
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get('language'));
  const pageLanguage = language ?? 'english';
  const copy: LearningPathCopy = learningPathCopy[pageLanguage];
  const unitId = searchParams.get('unit') ?? undefined;
  const moduleId = searchParams.get('module') ?? undefined;
  const level = searchParams.get('level') ?? 'A1';
  const { data: catalog = null, isLoading: isSyllabusLoading } = useQuery({
    queryKey: syllabusQueryKeys.catalog(language),
    queryFn: () => getSyllabusClient(language as SyllabusLanguage),
    enabled: Boolean(language),
  });
  const unit = catalog?.units.find((item) => item.unit_id === unitId);
  const selectedModule = unit?.items.find((item) => item.item_id === moduleId);
  const { data: learningPath = null, isLoading: isLearningPathLoading } = useQuery({
    queryKey: learningQueryKeys.path(selectedModule?.item_id, level),
    queryFn: () => {
      if (!selectedModule) {
        throw new Error(copy.unavailableTitle);
      }

      return generateLearningPathClient(selectedModule, level);
    },
    enabled: Boolean(selectedModule),
    retry: false,
  });
  const gradeHref =
    language && catalog && unit && selectedModule
      ? `/grade?language=${language}&unit=${unit.unit_id}&module=${selectedModule.item_id}`
      : '/grade';
  const unitTitleTranslation = getSyllabusTitleTranslation(unit?.translations);
  const moduleGrammarFocusTranslation = getSyllabusGrammarFocusTranslation(
    selectedModule?.translations,
  );

  if ((language && isSyllabusLoading) || (selectedModule && isLearningPathLoading)) {
    return <LearningPathLoading />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-3 py-4 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.8),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.25),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.65),rgba(226,183,119,0.3))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <Link
            href={gradeHref}
            className="inline-flex min-h-11 flex-col items-center justify-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-sm font-black text-[#49321d] shadow-[0_5px_0_#d3aa70] ring-1 ring-[#e8c890] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">←</span>
              <span>{copy.backToAssessment}</span>
            </span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {copy.backToAssessmentTranslation ??
                learningPathCopy.english.backToAssessmentTranslation}
            </span>
          </Link>
          <span className="inline-flex flex-col items-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-xs font-black text-[#49321d] ring-1 ring-[#e8c890]">
            <span>{copy.badge}</span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {copy.badgeTranslation ?? learningPathCopy.english.badgeTranslation}
            </span>
          </span>
        </header>

        {!learningPath || !catalog || !unit || !selectedModule ? (
          <section className="rounded-3xl border border-white/60 bg-[#fff9e9] px-5 py-16 text-center shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2b84b] text-2xl font-black text-[#49321d] shadow-[0_6px_0_#c88a27]">
              !
            </div>
            <h1 className="mt-6 text-3xl font-black">{copy.unavailableTitle}</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75644f]">
              {copy.unavailableDescription}
            </p>
            <Link
              href={language ? `/syllabi?language=${language}` : '/syllabi'}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_#52388d]"
            >
              {copy.unavailableAction}
            </Link>
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
            <div className="relative overflow-hidden bg-[#7154b7] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.2),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.16))]" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="inline-flex flex-col rounded-full bg-white/15 px-4 py-2 text-xs font-bold ring-1 ring-white/25">
                    <span>{copy.personalizedBadge}</span>
                    <span className="text-[10px] leading-4 font-medium text-white/70 italic">
                      {copy.personalizedBadgeTranslation ??
                        learningPathCopy.english.personalizedBadgeTranslation}
                    </span>
                  </span>
                  <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                    {copy.heroTitle}
                  </h1>
                  <p className="max-w-2xl text-xs leading-5 font-medium text-white/70 italic sm:text-sm">
                    {copy.heroTitleTranslation ?? learningPathCopy.english.heroTitleTranslation}
                  </p>
                  {/* TODO: Waiting translations from API */}
                  {/* <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                    {learningPath.summary}
                  </p>
                  {pathTopicTranslation ? (
                    <p className="max-w-2xl text-xs leading-5 font-medium text-white/65 italic sm:text-sm">
                      {pathTopicTranslation}
                    </p>
                  ) : null} */}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: copy.stats.level,
                      translation:
                        copy.statsTranslation?.level ??
                        learningPathCopy.english.statsTranslation.level,
                      value: learningPath.level,
                    },
                    learningPath.score !== undefined
                      ? {
                          label: copy.stats.score,
                          translation:
                            copy.statsTranslation?.score ??
                            learningPathCopy.english.statsTranslation.score,
                          value: String(learningPath.score),
                        }
                      : {
                          label: copy.stats.step,
                          translation:
                            copy.statsTranslation?.step ??
                            learningPathCopy.english.statsTranslation.step,
                          value: String(learningPath.totalSteps ?? learningPath.items.length),
                        },
                    {
                      label: copy.stats.session,
                      translation:
                        copy.statsTranslation?.session ??
                        learningPathCopy.english.statsTranslation.session,
                      value: String(learningPath.items.length),
                    },
                  ].map(({ label, translation, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-white/12 px-4 py-3 text-center ring-1 ring-white/20"
                    >
                      <span className="block text-[10px] font-bold tracking-wider text-white/65 uppercase">
                        {label}
                      </span>
                      <span className="block text-[10px] font-medium text-white/70 italic">
                        {translation}
                      </span>
                      <span className="mt-1 block text-lg font-black">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 py-7 min-[380px]:px-5 sm:px-8 sm:py-10 lg:px-10">
              <div className="mb-7">
                <p className="text-xs font-black tracking-[0.16em] text-[#2f6a43] uppercase">
                  {unit.unit_title}
                </p>
                {unitTitleTranslation ? (
                  <p className="mt-1 text-xs leading-5 font-medium text-[#8b765a] italic">
                    {unitTitleTranslation}
                  </p>
                ) : null}
                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {selectedModule.module_title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#75644f]">{copy.sequenceHint}</p>
                <p className="text-xs leading-5 font-medium text-[#8b765a] italic">
                  {copy.sequenceHintTranslation}
                </p>
              </div>

              <div className="relative space-y-4 before:absolute before:top-10 before:bottom-10 before:left-6 before:w-1 before:rounded-full before:bg-[#dfcda9] sm:before:left-8">
                {learningPath.items.map((item) => {
                  const learnHref = `/learn?language=${language}&unit=${unit.unit_id}&module=${selectedModule.item_id}&level=${encodeURIComponent(learningPath.level)}&path=${item.id}&step=${item.order}`;
                  const targets = item.target?.length ? item.target : [item.objective];
                  const translation = getStepTranslation(item.translations);
                  const activityTranslation =
                    translation?.activities?.[item.order - 1] ?? translation?.activity;

                  return (
                    <article
                      key={item.id}
                      className="relative grid gap-4 rounded-3xl border border-[#ead8b7] bg-white/75 p-4 pl-[4.5rem] shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:grid-cols-[1fr_auto] sm:items-center sm:p-5 sm:pl-24"
                    >
                      <span className="absolute top-5 left-3 z-10 grid size-12 place-items-center rounded-2xl bg-[#2f6a43] text-lg font-black text-[#fff6df] shadow-[0_5px_0_#245234] sm:left-4 sm:size-14">
                        {item.order}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black ${focusStyles[item.focus] ?? defaultFocusStyle}`}
                          >
                            {item.focus}
                            {activityTranslation ? (
                              <span className="mt-0.5 block text-[9px] leading-3 font-medium italic opacity-75">
                                {activityTranslation}
                              </span>
                            ) : null}
                          </span>
                          {item.requiredTime !== undefined ? (
                            <span className="rounded-full bg-[#f4ead6] px-3 py-1 text-[10px] font-black text-[#74512a]">
                              {item.requiredTime} {copy.timeLabel}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-2 text-lg font-black sm:text-xl">{item.title}</h3>
                        {translation?.title ? (
                          <p className="text-xs leading-5 font-medium text-[#8b765a] italic">
                            {translation.title}
                          </p>
                        ) : null}
                        <p className="mt-3 text-xs leading-5 text-[#75644f] sm:text-sm">
                          {item.description}
                        </p>
                        {translation?.description ? (
                          <p className="mt-0.5 text-[11px] leading-5 font-medium text-[#8b765a] italic sm:text-xs">
                            {translation.description}
                          </p>
                        ) : null}
                        {item.topicScope ? (
                          <div className="mt-3">
                            <p className="text-[11px] leading-5 font-bold text-[#74512a]">
                              {copy.topicLabel}: {item.topicScope}
                            </p>
                            {translation?.topicScope ? (
                              <p className="text-[11px] leading-5 font-medium text-[#9a8162] italic">
                                Topik: {translation.topicScope}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {targets.map((target, index) => (
                            <span
                              key={target}
                              className="inline-flex min-w-[7rem] flex-col items-center justify-center rounded-full bg-[#eef5ec] px-3 py-1 text-center text-[11px] leading-5 font-bold text-[#2f6a43]"
                            >
                              <span className="block leading-4">{target}</span>
                              {moduleGrammarFocusTranslation?.[index] ? (
                                <span className="block text-[9px] leading-3 font-medium text-[#6f806e] italic">
                                  {moduleGrammarFocusTranslation[index]}
                                </span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={learnHref}
                        className="inline-flex min-h-12 flex-col items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_5px_0_#52388d] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
                      >
                        <span>{copy.startAction}</span>
                        <span className="text-[10px] leading-4 font-medium text-white/75 italic">
                          {copy.startActionTranslation}
                        </span>
                        <NavPendingIndicator />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
