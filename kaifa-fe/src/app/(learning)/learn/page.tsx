'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';
import { LearningChat } from '@/features/learning/components/learning-chat';
import {
  generateLearningPathClient,
  learningQueryKeys,
  serializeLearningPathForApi,
  startLearningChatClient,
} from '@/features/learning/services/learning.client';
import type { LearningPathItemTranslation } from '@/features/learning/types/learning.types';
import { getSyllabusClient, syllabusQueryKeys } from '@/features/syllabus/services/syllabus.client';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';

const learnPageCopy = {
  english: {
    backToPath: 'Learning path',
    backToPathTranslation: 'Jalur belajar',
    badge: 'Learn with AI',
    badgeTranslation: 'Belajar dengan AI',
    notFoundTitle: 'Learning session not found',
    notFoundDescription: 'Choose a session from your learning path.',
    notFoundAction: 'Back to learning path',
    focusLabel: 'Session focus',
    focusLabelTranslation: 'Fokus sesi',
    targetLabel: 'Learning target',
    targetLabelTranslation: 'Target belajar',
    levelLabel: 'Level',
    focusGuardTitle: 'AI keeps the topic focused',
    focusGuardTitleTranslation: 'AI menjaga topik tetap fokus',
    focusGuardDescription:
      'If the conversation goes too wide, Kaifa will connect your answer back to this material.',
    focusGuardDescriptionTranslation:
      'Jika percakapan terlalu melebar, Kaifa akan menghubungkan jawabanmu kembali ke materi ini.',
  },
  arabic: {
    backToPath: 'مسار التعلم',
    backToPathTranslation: 'Jalur belajar',
    badge: 'تعلم مع الذكاء الاصطناعي',
    badgeTranslation: 'Belajar dengan AI',
    notFoundTitle: 'جلسة التعلم غير موجودة',
    notFoundDescription: 'اختر جلسة من مسار التعلم الخاص بك.',
    notFoundAction: 'العودة إلى مسار التعلم',
    focusLabel: 'تركيز الجلسة',
    focusLabelTranslation: 'Fokus sesi',
    targetLabel: 'هدف التعلم',
    targetLabelTranslation: 'Target belajar',
    levelLabel: 'المستوى',
    focusGuardTitle: 'يحافظ الذكاء الاصطناعي على تركيز الموضوع',
    focusGuardTitleTranslation: 'AI menjaga topik tetap fokus',
    focusGuardDescription: 'إذا توسعت المحادثة كثيراً، ستربط كايفا إجابتك بهذه المادة مرة أخرى.',
    focusGuardDescriptionTranslation:
      'Jika percakapan terlalu melebar, Kaifa akan menghubungkan jawabanmu kembali ke materi ini.',
  },
} satisfies Record<
  SyllabusLanguage,
  {
    backToPath: string;
    backToPathTranslation: string;
    badge: string;
    badgeTranslation: string;
    notFoundTitle: string;
    notFoundDescription: string;
    notFoundAction: string;
    focusLabel: string;
    focusLabelTranslation: string;
    targetLabel: string;
    targetLabelTranslation: string;
    levelLabel: string;
    focusGuardTitle: string;
    focusGuardTitleTranslation: string;
    focusGuardDescription: string;
    focusGuardDescriptionTranslation: string;
  }
>;

function getLanguage(value: string | null): SyllabusLanguage | undefined {
  const language = value ?? undefined;
  return language === 'english' || language === 'arabic' ? language : undefined;
}

function getStepOrder(value: string | null) {
  const step = Number(value);
  return Number.isInteger(step) && step > 0 ? step : undefined;
}

function getStepTranslation(
  translations: LearningPathItemTranslation[] | undefined,
): LearningPathItemTranslation | undefined {
  return translations?.find(
    (translation) =>
      translation.title ||
      translation.description ||
      translation.activity ||
      translation.topicScope,
  );
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get('language'));
  const pageLanguage = language ?? 'english';
  const copy = learnPageCopy[pageLanguage];
  const unitId = searchParams.get('unit') ?? undefined;
  const moduleId = searchParams.get('module') ?? undefined;
  const level = searchParams.get('level') ?? 'A1';
  const pathId = searchParams.get('path') ?? undefined;
  const stepOrder = getStepOrder(searchParams.get('step'));
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
        throw new Error(copy.notFoundTitle);
      }

      return generateLearningPathClient(selectedModule, level);
    },
    enabled: Boolean(selectedModule),
    retry: false,
  });
  const selectedPath =
    learningPath?.items.find((item) => item.id === pathId) ??
    learningPath?.items.find((item) => item.order === stepOrder);
  const selectedPathTranslation = getStepTranslation(selectedPath?.translations);
  const moduleTitleTranslation = selectedModule?.translations?.find(
    (translation) => translation.title,
  )?.title;
  const chatLearningPath =
    catalog && selectedModule && learningPath
      ? serializeLearningPathForApi({
          ...learningPath,
          language: pageLanguage,
          moduleId: selectedModule.item_id,
        })
      : null;
  const { data: chatSession = null, isLoading: isChatSessionLoading } = useQuery({
    queryKey: learningQueryKeys.session(pathId ?? selectedPath?.id, selectedPath?.order),
    queryFn: () => {
      if (!catalog || !selectedModule || !learningPath || !selectedPath) {
        throw new Error(copy.notFoundTitle);
      }

      return startLearningChatClient({
        moduleId: selectedModule.item_id,
        level: learningPath.level,
        currentStep: selectedPath.order,
        learningPathStepId: pathId ?? selectedPath.id,
        learningPath: {
          ...learningPath,
          language: pageLanguage,
          moduleId: selectedModule.item_id,
        },
      });
    },
    enabled: Boolean(catalog && selectedModule && learningPath && selectedPath),
    retry: false,
  });
  const pathHref =
    language && catalog && unit && selectedModule
      ? `/learning-path?language=${language}&unit=${unit.unit_id}&module=${selectedModule.item_id}&level=${encodeURIComponent(level)}`
      : '/learning-path';

  if (
    (language && isSyllabusLoading) ||
    (selectedModule && isLearningPathLoading) ||
    (selectedPath && isChatSessionLoading)
  ) {
    return (
      <RouteLoadingRobot
        message="Kaifa AI is opening your learning chat..."
        arabicMessage="كايفا بالذكاء الاصطناعي تفتح محادثة التعلم..."
        tone="green"
      />
    );
  }

  return (
    <main className="relative h-dvh overflow-hidden bg-[#f4dfbd] px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 text-[#2f2518] sm:px-6 sm:py-6 lg:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.22),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.6),rgba(226,183,119,0.28))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col">
        <header className="mb-2 flex shrink-0 items-center justify-between gap-3 sm:mb-5">
          <Link
            href={pathHref}
            aria-label={copy.backToPath}
            className="inline-flex min-h-11 flex-col items-center justify-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-sm font-black text-[#49321d] shadow-[0_5px_0_#d3aa70] ring-1 ring-[#e8c890] transition hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">←</span>
              <span>{copy.backToPath}</span>
            </span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {copy.backToPathTranslation}
            </span>
          </Link>
          <span className="inline-flex flex-col items-center rounded-xl bg-[#fff6df] px-3 py-2 text-[11px] font-black text-[#49321d] ring-1 ring-[#e8c890] sm:rounded-2xl sm:px-4 sm:text-xs">
            <span>{copy.badge}</span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {copy.badgeTranslation}
            </span>
          </span>
        </header>

        {!catalog || !unit || !selectedModule || !selectedPath || !chatLearningPath ? (
          <section className="rounded-3xl border border-white/60 bg-[#fff9e9] px-5 py-16 text-center shadow-[0_24px_70px_rgba(91,58,24,0.24)]">
            <h1 className="text-3xl font-black">{copy.notFoundTitle}</h1>
            <p className="mt-2 text-sm text-[#75644f]">{copy.notFoundDescription}</p>
            <Link
              href={pathHref}
              className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-[#7154b7] px-6 text-sm font-black text-white shadow-[0_5px_0_#52388d]"
            >
              {copy.notFoundAction}
            </Link>
          </section>
        ) : (
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.34fr_0.66fr] lg:grid-rows-1">
            <aside className="hidden h-fit overflow-hidden rounded-[2rem] border border-white/60 bg-[#fff9e9] shadow-[0_18px_50px_rgba(91,58,24,0.18)] lg:block">
              <div className="relative overflow-hidden bg-[#2f6a43] p-7 text-[#fff6df]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
                <div className="relative">
                  <span className="inline-flex flex-col rounded-full bg-[#fff6df]/15 px-3 py-1.5 text-xs font-bold ring-1 ring-[#fff6df]/25">
                    <span>{copy.focusLabel}</span>
                    <span className="text-[10px] leading-4 font-medium text-[#fff6df]/65 italic">
                      {copy.focusLabelTranslation}
                    </span>
                  </span>
                  <h1 className="mt-4 text-3xl leading-tight font-black">{selectedPath.title}</h1>
                  {selectedPathTranslation?.title ? (
                    <p className="mt-1 text-sm leading-5 font-medium text-[#fff6df]/65 italic">
                      {selectedPathTranslation.title}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-6 text-[#fff6df]/75">
                    {selectedPath.description}
                  </p>
                  {selectedPathTranslation?.description ? (
                    <p className="mt-1 text-xs leading-5 font-medium text-[#fff6df]/60 italic">
                      {selectedPathTranslation.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[11px] font-black tracking-[0.16em] text-[#7b62bd] uppercase">
                  <span>{copy.targetLabel}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 font-medium tracking-normal text-[#8b765a] normal-case italic">
                    {copy.targetLabelTranslation}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-6 font-bold text-[#49321d]">
                  {selectedPath.objective}
                </p>
                {selectedPathTranslation?.topicScope ? (
                  <p className="mt-1 text-xs leading-5 font-medium text-[#8b765a] italic">
                    {selectedPathTranslation.topicScope}
                  </p>
                ) : null}
                <div className="mt-5 rounded-2xl bg-[#f4ead6] p-4">
                  <div className="text-xs font-black">
                    <span>
                      {copy.levelLabel} {learningPath?.level ?? 'B1'}
                    </span>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-[#d7e4d7] bg-[#eef5ec] p-4">
                  <p className="text-xs font-black text-[#2f6a43]">
                    <span>{copy.focusGuardTitle}</span>
                    <span className="mt-0.5 block text-[10px] leading-4 font-medium text-[#5e755d] italic">
                      {copy.focusGuardTitleTranslation}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#6f806e]">
                    {copy.focusGuardDescription}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 font-medium text-[#6f806e] italic">
                    {copy.focusGuardDescriptionTranslation}
                  </p>
                </div>
              </div>
            </aside>

            <LearningChat
              initialParagraph={chatSession?.paragraph ?? chatSession?.listening_state?.paragraph}
              initialReply={chatSession?.reply}
              language={pageLanguage}
              learningPath={chatLearningPath}
              moduleTitle={selectedModule.module_title}
              moduleTitleTranslation={moduleTitleTranslation}
              objective={selectedPath.objective}
              stepOrder={selectedPath.order}
              topic={selectedPath.title}
              topicTranslation={selectedPathTranslation?.title}
            />
          </div>
        )}
      </div>
    </main>
  );
}
