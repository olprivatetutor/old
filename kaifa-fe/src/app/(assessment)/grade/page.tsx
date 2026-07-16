'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AssessmentGradeResult } from '@/features/assessment/components/assessment-grade-result';
import { getSyllabusClient, syllabusQueryKeys } from '@/features/syllabus/services/syllabus.client';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';

const gradePageCopy = {
  english: {
    backToModules: 'Back to modules',
    backToModulesTranslation: 'Kembali ke modul',
    badge: 'Assessment Result',
    badgeTranslation: 'Hasil penilaian',
    metadataTitle: 'Assessment Result - Kaifa',
    metadataDescription: 'View your language assessment level and result.',
  },
  arabic: {
    backToModules: 'العودة إلى الوحدات الفرعية',
    backToModulesTranslation: 'Kembali ke modul',
    badge: 'نتيجة التقييم',
    badgeTranslation: 'Hasil penilaian',
    metadataTitle: 'نتيجة التقييم - كايفا',
    metadataDescription: 'اعرض مستوى ونتيجة تقييم اللغة الخاصة بك.',
  },
} satisfies Record<
  SyllabusLanguage,
  {
    backToModules: string;
    backToModulesTranslation: string;
    badge: string;
    badgeTranslation: string;
    metadataTitle: string;
    metadataDescription: string;
  }
>;

function getLanguage(value: string | null): SyllabusLanguage | undefined {
  const language = value ?? undefined;
  return language === 'english' || language === 'arabic' ? language : undefined;
}

export default function GradePage() {
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get('language'));
  const pageLanguage = language ?? 'english';
  const copy = gradePageCopy[pageLanguage];
  const unitId = searchParams.get('unit') ?? undefined;
  const moduleId = searchParams.get('module') ?? undefined;
  const { data: catalog = null } = useQuery({
    queryKey: syllabusQueryKeys.catalog(language),
    queryFn: () => getSyllabusClient(language as SyllabusLanguage),
    enabled: Boolean(language),
  });
  const unit = catalog?.units.find((item) => item.unit_id === unitId);
  const selectedModule = unit?.items.find((item) => item.item_id === moduleId);
  const learningHref =
    language && catalog && unit && selectedModule
      ? `/learning-path?language=${language}&unit=${unit.unit_id}&module=${selectedModule.item_id}`
      : '/syllabi';
  const modulesHref =
    language && catalog && unit ? `/modules?language=${language}&unit=${unit.unit_id}` : '/modules';

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4dfbd] px-3 py-4 text-[#2f2518] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.8),transparent_26%),radial-gradient(circle_at_90%_82%,rgba(82,130,91,0.25),transparent_30%),linear-gradient(145deg,rgba(255,249,226,0.65),rgba(226,183,119,0.3))]" />
      <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[28px] border-[#e6bd72]/45 sm:size-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full border-[34px] border-[#7aab83]/30 sm:size-96" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-5 flex items-center justify-between gap-4">
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
              {copy.backToModulesTranslation}
            </span>
          </Link>
          <span className="inline-flex flex-col items-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-xs font-black text-[#49321d] shadow-[0_4px_0_#d3aa70] ring-1 ring-[#e8c890]">
            <span>{copy.badge}</span>
            <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
              {copy.badgeTranslation}
            </span>
          </span>
        </header>

        <AssessmentGradeResult
          language={pageLanguage}
          learningHref={learningHref}
          moduleId={moduleId}
          moduleTitle={selectedModule?.module_title}
        />
      </div>
    </main>
  );
}
