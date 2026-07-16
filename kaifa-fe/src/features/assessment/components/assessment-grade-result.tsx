'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { NavPendingIndicator } from '@/components/ui/nav-pending-indicator';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';

interface AssessmentGradeResultProps {
  language: SyllabusLanguage;
  learningHref: string;
  moduleId?: string | undefined;
  moduleTitle?: string | undefined;
}

const latestAssessmentResultStorageKey = 'kaifa:assessment-result:latest';

const gradeResultCopy = {
  english: {
    unavailableTitle: 'Assessment result is not available yet',
    unavailableDescription:
      'Complete the assessment chat first so Kaifa can show the AI result here.',
    unavailableAction: 'Choose assessment',
    completedBadge: 'Assessment completed',
    completedBadgeTranslation: 'Penilaian selesai',
    heroTitle: 'MasyaAllah, great work!',
    levelLabel: 'Your level',
    cefrLevelLabel: 'CEFR level',
    scoreLabel: 'Score',
    summaryLabel: 'Skill summary',
    summaryLabelTranslation: 'Ringkasan kemampuan',
    summaryTitle: 'AI assessment result',
    progressLabel: 'Level progress',
    nextLevel: (level: string) => `Toward level ${level}`,
    strengthsLabel: 'Strengths',
    areasLabel: 'Practice areas',
    recommendationsLabel: 'Recommendations',
    nextStepsLabel: 'Next steps',
    moduleLabel: 'Related module',
    startLearning: 'Start learning',
    startLearningTranslation: 'Mulai belajar',
    detailLabel: 'Result details',
    yes: 'Yes',
    no: 'No',
  },
  arabic: {
    unavailableTitle: 'نتيجة التقييم غير متاحة بعد',
    unavailableDescription: 'أكمل محادثة التقييم أولاً حتى تعرض كايفا نتيجة الذكاء الاصطناعي.',
    unavailableAction: 'اختر التقييم',
    completedBadge: 'اكتمل التقييم',
    completedBadgeTranslation: 'Penilaian selesai',
    heroTitle: 'ما شاء الله، عمل رائع!',
    levelLabel: 'مستواك',
    cefrLevelLabel: 'مستوى CEFR',
    scoreLabel: 'الدرجة',
    summaryLabel: 'ملخص المهارة',
    summaryLabelTranslation: 'Ringkasan kemampuan',
    summaryTitle: 'نتيجة تقييم الذكاء الاصطناعي',
    progressLabel: 'تقدم المستوى',
    nextLevel: (level: string) => `نحو المستوى ${level}`,
    strengthsLabel: 'نقاط القوة',
    areasLabel: 'مجالات التدريب',
    recommendationsLabel: 'التوصيات',
    nextStepsLabel: 'الخطوات التالية',
    moduleLabel: 'الوحدة المرتبطة',
    startLearning: 'ابدأ التعلم',
    startLearningTranslation: 'Mulai belajar',
    detailLabel: 'تفاصيل النتيجة',
    yes: 'نعم',
    no: 'لا',
  },
} satisfies Record<
  SyllabusLanguage,
  {
    unavailableTitle: string;
    unavailableDescription: string;
    unavailableAction: string;
    completedBadge: string;
    completedBadgeTranslation: string;
    heroTitle: string;
    levelLabel: string;
    cefrLevelLabel: string;
    scoreLabel: string;
    summaryLabel: string;
    summaryLabelTranslation: string;
    summaryTitle: string;
    progressLabel: string;
    nextLevel: (level: string) => string;
    strengthsLabel: string;
    areasLabel: string;
    recommendationsLabel: string;
    nextStepsLabel: string;
    moduleLabel: string;
    startLearning: string;
    startLearningTranslation: string;
    detailLabel: string;
    yes: string;
    no: string;
  }
>;

const displayedKnownKeys = new Set([
  'areas',
  'cefr_level',
  'feedback',
  'level',
  'label',
  'level_label',
  'next_level',
  'next_steps',
  'nextSteps',
  'progress',
  'progress_percentage',
  'recommendation',
  'recommendations',
  'score',
  'strengths',
  'summary',
  'title',
  'translations',
]);

function createAssessmentResultStorageKey(moduleId: string) {
  return `kaifa:assessment-result:${moduleId}`;
}

function subscribeAssessmentResult() {
  return () => undefined;
}

function readStoredAssessmentResult(moduleId?: string) {
  try {
    return moduleId
      ? window.sessionStorage.getItem(createAssessmentResultStorageKey(moduleId))
      : window.sessionStorage.getItem(latestAssessmentResultStorageKey);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMeaningful(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (isRecord(value)) return Object.keys(value).length > 0;
  return true;
}

function readString(result: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = result?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function readNumber(result: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = result?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function readStringArray(result: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = result?.[key];
    if (Array.isArray(value)) {
      const items = value.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      );
      if (items.length > 0) return items;
    }
  }
  return [];
}

function readTranslations(result: Record<string, unknown> | null | undefined) {
  const value = result?.translations;
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord);
}

function hasDisplayableTranslation(translation: Record<string, unknown>) {
  return Boolean(
    readString(translation, ['title']) ||
    readString(translation, ['summary']) ||
    readStringArray(translation, ['strengths']).length > 0 ||
    readStringArray(translation, ['areas']).length > 0,
  );
}

function getAssessmentTranslation(result: Record<string, unknown> | null | undefined) {
  const translations = readTranslations(result).filter(hasDisplayableTranslation);

  return (
    translations.find((translation) => {
      const language = readString(translation, ['language'])?.toLowerCase();
      return language === 'bahasa indonesia' || language === 'indonesian' || language === 'id';
    }) ?? translations[0]
  );
}

function readList(result: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = result?.[key];
    if (Array.isArray(value) && value.length > 0) return value;
    if (typeof value === 'string' && value.trim()) return [value.trim()];
  }
  return [];
}

function formatKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown, copy: (typeof gradeResultCopy)[SyllabusLanguage]) {
  if (typeof value === 'boolean') return value ? copy.yes : copy.no;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2c.8 5.8 4.2 9.2 10 10-5.8.8-9.2 4.2-10 10-.8-5.8-4.2-9.2-10-10 5.8-.8 9.2-4.2 10-10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ResultValue({
  copy,
  value,
}: {
  copy: (typeof gradeResultCopy)[SyllabusLanguage];
  value: unknown;
}) {
  if (Array.isArray(value)) {
    return (
      <ul className="mt-3 space-y-2">
        {value.map((item, index) => (
          <li key={index} className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-[#49321d]">
            {isRecord(item) || Array.isArray(item) ? (
              <pre className="overflow-x-auto text-xs leading-5 whitespace-pre-wrap">
                {formatValue(item, copy)}
              </pre>
            ) : (
              formatValue(item, copy)
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (isRecord(value)) {
    return (
      <pre className="mt-3 overflow-x-auto rounded-2xl bg-white/70 px-4 py-3 text-xs leading-5 whitespace-pre-wrap text-[#49321d]">
        {formatValue(value, copy)}
      </pre>
    );
  }

  return <p className="mt-2 text-sm leading-6 text-[#49321d]">{formatValue(value, copy)}</p>;
}

export function AssessmentGradeResult({
  language,
  learningHref,
  moduleId,
  moduleTitle,
}: AssessmentGradeResultProps) {
  const copy = gradeResultCopy[language];
  const storedResult = useSyncExternalStore(
    subscribeAssessmentResult,
    () => readStoredAssessmentResult(moduleId),
    () => null,
  );
  const result = useMemo(() => {
    try {
      const parsedResult = storedResult ? (JSON.parse(storedResult) as unknown) : null;
      return isRecord(parsedResult) ? parsedResult : null;
    } catch {
      return null;
    }
  }, [storedResult]);

  const level = readString(result, ['level']);
  const cefrLevel = readString(result, ['cefr_level']);
  const heroLevel = level ?? cefrLevel;
  const assessmentTranslation = getAssessmentTranslation(result);
  const assessmentTitle = readString(result, ['title']);
  const translatedAssessmentTitle = readString(assessmentTranslation, ['title']);
  const levelLabel = readString(result, ['level_label', 'label']);
  const score = readNumber(result, ['score']);
  const summary = readString(result, ['summary']);
  const translatedSummary = readString(assessmentTranslation, ['summary']);
  const feedback = readString(result, ['feedback']);
  const nextLevel = readString(result, ['next_level']);
  const progress = readNumber(result, ['progress_percentage', 'progress']);
  const strengths = readStringArray(result, ['strengths']);
  const translatedStrengths = readStringArray(assessmentTranslation, ['strengths']);
  const areas = readStringArray(result, ['areas']);
  const translatedAreas = readStringArray(assessmentTranslation, ['areas']);
  const titleText = assessmentTitle ?? translatedAssessmentTitle;
  const summaryText = summary ?? translatedSummary;
  const strengthsText = strengths.length > 0 ? strengths : translatedStrengths;
  const areasText = areas.length > 0 ? areas : translatedAreas;
  const recommendations = readList(result, ['recommendations', 'recommendation']);
  const nextSteps = readList(result, ['next_steps', 'nextSteps']);
  const learningPathHref = useMemo(() => {
    if (!heroLevel) {
      return learningHref;
    }

    try {
      const url = new URL(learningHref, 'https://kaifa.local');
      url.searchParams.set('level', heroLevel);
      return `${url.pathname}${url.search}`;
    } catch {
      return learningHref;
    }
  }, [learningHref, heroLevel]);
  const extraEntries = useMemo(
    () =>
      Object.entries(result ?? {}).filter(
        ([key, value]) => !displayedKnownKeys.has(key) && isMeaningful(value),
      ),
    [result],
  );
  const hasScore = typeof score === 'number';
  const hasHeroResult = Boolean(heroLevel || levelLabel || hasScore);
  const normalizedProgress =
    typeof progress === 'number' ? Math.min(Math.max(progress, 0), 100) : undefined;

  if (!result) {
    return (
      <section className="rounded-3xl border border-white/60 bg-[#fff9e9] px-5 py-14 text-center shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2b84b] text-2xl font-black text-[#49321d] shadow-[0_6px_0_#c88a27]">
          !
        </div>
        <h1 className="mt-6 text-3xl font-black">{copy.unavailableTitle}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75644f]">
          {copy.unavailableDescription}
        </p>
        <Link
          href="/syllabi"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_#52388d]"
        >
          {copy.unavailableAction}
        </Link>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/60 bg-[#fff9e9] shadow-[0_24px_70px_rgba(91,58,24,0.24)] sm:rounded-[2rem]">
      <div className="relative overflow-hidden bg-[#2f6a43] px-5 py-8 text-center text-[#fff6df] sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_82%_70%,rgba(242,184,75,0.22),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
        <Sparkle className="absolute top-8 left-[12%] size-6 text-[#f2b84b] sm:size-8" />
        <Sparkle className="absolute right-[14%] bottom-9 size-4 text-[#fff6df]/70 sm:size-6" />
        <div className="relative">
          <span className="inline-flex flex-col rounded-full bg-[#fff6df]/15 px-4 py-2 text-xs font-bold ring-1 ring-[#fff6df]/25 sm:text-sm">
            <span>{copy.completedBadge}</span>
            <span className="text-[10px] leading-4 font-medium text-[#fff6df]/75 italic">
              {copy.completedBadgeTranslation}
            </span>
          </span>
          <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight sm:text-5xl">
            {titleText ?? copy.heroTitle}
          </h1>
          {assessmentTitle && translatedAssessmentTitle && (
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#fff6df]/62 italic">
              {translatedAssessmentTitle}
            </p>
          )}
          {(summaryText || feedback) && (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#fff6df]/78 sm:text-base">
              {summaryText ?? feedback}
            </p>
          )}
          {summary && translatedSummary && (
            <p className="mx-auto mt-1.5 max-w-2xl text-xs leading-5 text-[#fff6df]/58 italic sm:text-sm">
              {translatedSummary}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-7 px-4 py-7 min-[380px]:px-5 sm:px-8 sm:py-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-10 lg:px-10">
        {hasHeroResult && (
          <div className="flex flex-col items-center justify-center">
            {(heroLevel || levelLabel) && (
              <div className="relative grid size-56 place-items-center sm:size-64">
                <div className="absolute inset-5 rotate-[10deg] rounded-[3rem] bg-[#c88a27] shadow-[0_18px_30px_rgba(91,58,24,0.24)]" />
                <div className="absolute inset-5 -rotate-[10deg] rounded-[3rem] bg-[#f2b84b]" />
                <div className="absolute inset-2 bg-[#f7cf70] shadow-xl [clip-path:polygon(50%_0%,61%_11%,76%_6%,82%_21%,98%_25%,91%_41%,100%_55%,86%_65%,87%_82%,69%_84%,58%_100%,44%_89%,28%_97%,20%_80%,3%_75%,11%_59%,0%_45%,15%_34%,13%_17%,31%_17%)]" />
                <div className="absolute inset-9 grid place-items-center rounded-full border-[7px] border-[#fff0bc] bg-[radial-gradient(circle_at_35%_25%,#876ad0,#5c3d9b_72%)] text-center text-white shadow-[inset_0_-9px_0_rgba(46,27,89,0.3),0_7px_0_#a56818]">
                  <div>
                    <span className="block text-[10px] font-black tracking-[0.2em] text-[#eee7ff] uppercase">
                      {copy.levelLabel}
                    </span>
                    {heroLevel && (
                      <span className="mt-1 block text-6xl leading-none font-black sm:text-7xl">
                        {heroLevel}
                      </span>
                    )}
                    {levelLabel && (
                      <span className="mt-1 block px-3 text-xs font-black break-words text-[#f9d986]">
                        {levelLabel}
                      </span>
                    )}
                  </div>
                </div>
                <Sparkle className="absolute top-5 right-8 size-7 text-white" />
                <Sparkle className="absolute bottom-8 left-5 size-5 text-[#fff6df]" />
              </div>
            )}

            {hasScore && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f4ead6] px-5 py-3 ring-1 ring-[#dfcda9]">
                <span className="text-xs font-black tracking-wider text-[#8b765a] uppercase">
                  {copy.scoreLabel}
                </span>
                <span className="text-3xl font-black text-[#2f6a43]">{score}</span>
                <span className="text-sm font-bold text-[#8b765a]">/ 100</span>
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-col justify-center ${hasHeroResult ? '' : 'lg:col-span-2'}`}>
          {(summaryText || feedback) && (
            <>
              <p className="text-xs font-black tracking-[0.16em] text-[#7b62bd] uppercase">
                {copy.summaryLabel}
              </p>
              <p className="text-xs leading-5 font-medium text-[#8b765a] italic">
                {copy.summaryLabelTranslation}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                {titleText ?? copy.summaryTitle}
              </h2>
              {assessmentTitle && translatedAssessmentTitle && (
                <p className="mt-1.5 text-sm leading-6 text-[#8b765a] italic">
                  {translatedAssessmentTitle}
                </p>
              )}
              <p className="mt-3 text-sm leading-7 text-[#75644f]">{summaryText ?? feedback}</p>
              {summary && translatedSummary && (
                <p className="mt-1.5 text-xs leading-6 text-[#9b8b76] italic">
                  {translatedSummary}
                </p>
              )}
            </>
          )}

          {normalizedProgress !== undefined && (
            <div className="mt-6 rounded-3xl border border-[#d7e4d7] bg-[#eef5ec] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-[#2f6a43]">{copy.progressLabel}</p>
                  {nextLevel && (
                    <p className="mt-1 text-[11px] text-[#6f806e]">{copy.nextLevel(nextLevel)}</p>
                  )}
                </div>
                <span className="rounded-xl bg-white px-3 py-2 text-sm font-black text-[#2f6a43] shadow-sm">
                  {normalizedProgress}%
                </span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#c9dbc9]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#2f6a43,#7aab83)] shadow-[0_0_12px_rgba(47,106,67,0.35)]"
                  style={{ width: `${normalizedProgress}%` }}
                />
              </div>
            </div>
          )}

          {(strengthsText.length > 0 || areasText.length > 0) && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {strengthsText.length > 0 && (
                <div className="rounded-3xl bg-[#eef5ec] p-5 ring-1 ring-[#d7e4d7]">
                  <p className="text-xs font-black tracking-[0.16em] text-[#2f6a43] uppercase">
                    {copy.strengthsLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {strengthsText.map((item, index) => (
                      <li key={item} className="text-sm leading-6 text-[#49321d]">
                        {item}
                        {strengths.length > 0 && translatedStrengths[index] && (
                          <span className="mt-0.5 block text-xs leading-5 text-[#7b8d78] italic">
                            {translatedStrengths[index]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {areasText.length > 0 && (
                <div className="rounded-3xl bg-[#fff1d5] p-5 ring-1 ring-[#ecd9af]">
                  <p className="text-xs font-black tracking-[0.16em] text-[#9a681d] uppercase">
                    {copy.areasLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {areasText.map((item, index) => (
                      <li key={item} className="text-sm leading-6 text-[#49321d]">
                        {item}
                        {areas.length > 0 && translatedAreas[index] && (
                          <span className="mt-0.5 block text-xs leading-5 text-[#a89672] italic">
                            {translatedAreas[index]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {(recommendations.length > 0 || nextSteps.length > 0) && (
            <div className="mt-6 grid gap-4">
              {recommendations.length > 0 && (
                <div className="rounded-3xl bg-[#f2ecff] p-5 ring-1 ring-[#ddd0fb]">
                  <p className="text-xs font-black tracking-[0.16em] text-[#7154b7] uppercase">
                    {copy.recommendationsLabel}
                  </p>
                  <ResultValue copy={copy} value={recommendations} />
                </div>
              )}

              {nextSteps.length > 0 && (
                <div className="rounded-3xl bg-[#f4ead6] p-5 ring-1 ring-[#dfcda9]">
                  <p className="text-xs font-black tracking-[0.16em] text-[#8b765a] uppercase">
                    {copy.nextStepsLabel}
                  </p>
                  <ResultValue copy={copy} value={nextSteps} />
                </div>
              )}
            </div>
          )}

          {moduleTitle && (
            <p className="mt-5 text-xs leading-5 text-[#8b765a]">
              {copy.moduleLabel}: <span className="font-black text-[#49321d]">{moduleTitle}</span>
            </p>
          )}

          <Link
            href={learningPathHref}
            className="mt-6 inline-flex min-h-14 flex-col items-center justify-center rounded-2xl bg-[#7154b7] px-6 py-3.5 text-base font-black text-white shadow-[0_7px_0_#52388d] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              {copy.startLearning}
              <span aria-hidden="true">→</span>
            </span>
            <span className="text-[10px] leading-4 font-medium text-white/75 italic">
              {copy.startLearningTranslation}
            </span>
            <NavPendingIndicator />
          </Link>
        </div>
      </div>

      {extraEntries.length > 0 && (
        <div className="border-t border-[#ead8b7] px-4 py-7 min-[380px]:px-5 sm:px-8 sm:py-9 lg:px-10">
          <p className="text-xs font-black tracking-[0.16em] text-[#7b62bd] uppercase">
            {copy.detailLabel}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {extraEntries.map(([key, value]) => (
              <div key={key} className="rounded-3xl bg-[#f4ead6] p-5 ring-1 ring-[#dfcda9]">
                <p className="text-[11px] font-black tracking-[0.14em] text-[#8b765a] uppercase">
                  {formatKey(key)}
                </p>
                <ResultValue copy={copy} value={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
