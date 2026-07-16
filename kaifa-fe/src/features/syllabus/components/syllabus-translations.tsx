import type { SyllabusTranslation } from '../types/syllabus.types';

interface SyllabusTranslationsProps {
  translations?: SyllabusTranslation[] | undefined;
  compact?: boolean | undefined;
}

export function SyllabusTranslations({ translations, compact = false }: SyllabusTranslationsProps) {
  const titles = translations?.filter((translation) => translation.title);

  if (!titles?.length) {
    return null;
  }

  return (
    <div className={compact ? 'space-y-0.5' : 'space-y-1'}>
      {titles.map((translation, index) => (
        <p
          key={translation.id ?? `${translation.language}-${index}`}
          className="text-xs leading-5 font-medium text-[#8b765a] italic"
        >
          {translation.title}
        </p>
      ))}
    </div>
  );
}
