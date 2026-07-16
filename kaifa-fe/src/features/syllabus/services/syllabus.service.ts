import { cookies } from 'next/headers';
import { englishSyllabi } from '../data/syllabus.mock';
import type {
  GetSyllabusModulesParams,
  GetSyllabusParams,
  SyllabiApiResponse,
  SyllabusModule,
  SyllabusModulesApiResponse,
  SyllabusCatalog,
  SyllabusLanguage,
  SyllabusTranslation,
} from '../types/syllabus.types';

type ApiRecord = Record<string, unknown>;

const languageSubjects: Record<SyllabusLanguage, string> = {
  english: 'English',
  arabic: 'Arabic',
};

function createApiUrl(endpoint: string, baseUrl: string) {
  return new URL(endpoint, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRecord(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
}

function readString(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }
  }

  return undefined;
}

function readNumber(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const numericValue = Number(value);

      if (Number.isFinite(numericValue)) {
        return numericValue;
      }
    }
  }

  return undefined;
}

function readLevel(record: ApiRecord) {
  const value = record.level ?? record.levels ?? record.cefr;
  return Array.isArray(value) || typeof value === 'string' ? value : undefined;
}

function readRecords(value: unknown): ApiRecord[] {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  if (isRecord(value) && Array.isArray(value.data)) {
    return value.data.filter(isRecord);
  }

  return [];
}

function readFirstRecords(...values: unknown[]) {
  for (const value of values) {
    const records = readRecords(value);

    if (records.length > 0) {
      return records;
    }
  }

  return [];
}

function readTopLevelRecords(value: unknown): ApiRecord[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => readTopLevelRecords(item));
  }

  if (isRecord(value)) {
    if (Array.isArray(value.data)) {
      return readTopLevelRecords(value.data);
    }

    return [value];
  }

  return [];
}

function readSyllabusRecords(data: unknown) {
  const records = readTopLevelRecords(data);

  if (records.length > 0) {
    return records;
  }

  if (!isRecord(data)) {
    return [];
  }

  return readFirstRecords(data.syllabi, data.syllabus, data.catalogs, data.items);
}

function normalizeLanguage(
  value: string | undefined,
  fallback: SyllabusLanguage,
): SyllabusLanguage {
  const normalizedValue = value?.toLowerCase();
  return normalizedValue === 'arabic' || normalizedValue === 'english' ? normalizedValue : fallback;
}

function normalizeCefr(level: string[] | string | undefined) {
  if (Array.isArray(level)) {
    return level.filter(Boolean).join('-') || '-';
  }

  return level?.trim() || '-';
}

function normalizeTopics(topicScope?: string[] | string) {
  if (Array.isArray(topicScope)) {
    return topicScope.map((topic) => topic.trim()).filter(Boolean);
  }

  return (
    topicScope
      ?.split(',')
      .map((topic) => topic.trim())
      .filter(Boolean) ?? []
  );
}

function normalizeStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return String(item).trim();
        }

        if (isRecord(item)) {
          return readString(item, ['title', 'name', 'activity', 'term']);
        }

        return undefined;
      })
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTranslations(value: unknown): SyllabusTranslation[] {
  return readRecords(value)
    .map((translation) => {
      const language = readString(translation, ['language', 'locale', 'lang']);

      if (!language) {
        return undefined;
      }

      const activities = normalizeStringList(translation.activities);
      const grammarFocus = normalizeStringList(translation.grammar_focus);
      const topicScopeTerms = normalizeStringList(translation.topic_scope_terms);
      const id = readString(translation, ['id', 'translation_id', 'uuid']);
      const title = readString(translation, ['title', 'name']);
      const description = readString(translation, ['description', 'desc']);
      const topicScope = readString(translation, ['topic_scope', 'topics', 'topic']);

      return {
        language,
        ...(id ? { id } : {}),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(topicScope ? { topic_scope: topicScope } : {}),
        ...(activities.length > 0 ? { activities } : {}),
        ...(grammarFocus.length > 0 ? { grammar_focus: grammarFocus } : {}),
        ...(topicScopeTerms.length > 0 ? { topic_scope_terms: topicScopeTerms } : {}),
      };
    })
    .filter((translation): translation is SyllabusTranslation => Boolean(translation));
}

function normalizeGrade(className?: string) {
  if (!className) {
    return 0;
  }

  const numericClass = Number(className);
  if (Number.isFinite(numericClass)) {
    return numericClass;
  }

  const romanValues: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
  };
  const normalizedClass = className.trim().toUpperCase();

  if (!normalizedClass || !/^[IVXLC]+$/.test(normalizedClass)) {
    return 0;
  }

  return normalizedClass.split('').reduce((total, current, index, values) => {
    const value = romanValues[current] ?? 0;
    const nextValue = romanValues[values[index + 1] ?? ''] ?? 0;
    return nextValue > value ? total - value : total + value;
  }, 0);
}

function createFallbackId(...parts: Array<number | string | undefined>) {
  return parts
    .filter((part) => part !== undefined && String(part).trim())
    .map((part) =>
      String(part)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    )
    .filter(Boolean)
    .join('-');
}

function getSyllabusRecord(data: unknown) {
  const root = Array.isArray(data) ? data.find(isRecord) : data;

  if (!isRecord(root)) {
    return { root: undefined, syllabus: undefined, modules: [] };
  }

  const nestedData = readRecord(root, ['data']);
  const container = nestedData ?? root;
  const syllabus =
    readRecord(container, ['syllabus', 'syllabi', 'syllabus_data', 'catalog']) ?? container;
  const modules = readFirstRecords(
    syllabus.modules,
    container.modules,
    container.items,
    root.modules,
  );

  return { root, syllabus, modules };
}

function normalizeApiModules(modules: ApiRecord[], syllabusId: string): SyllabusModule[] {
  return modules
    .slice()
    .sort(
      (first, second) => (readNumber(first, ['order']) ?? 0) - (readNumber(second, ['order']) ?? 0),
    )
    .map((module, index) => {
      const moduleTitle =
        readString(module, ['title', 'module_title', 'name']) ?? `Modul ${index + 1}`;
      const moduleOrder = readNumber(module, ['order']);
      const moduleStatus = readString(module, ['status']);
      const moduleDescription = readString(module, ['description', 'desc']);
      const topicsValue = module.topic_scope ?? module.topics ?? module.topic ?? module.scope;
      const activities = normalizeStringList(module.activities);
      const grammarFocus = normalizeStringList(module.grammar_focus);
      const topicScopeTerms = normalizeStringList(module.topic_scope_terms);
      const translations = normalizeTranslations(module.translations);
      const vocabularyLoad = readNumber(module, ['vocabulary_load']);
      const estimationDurationMinutes = readNumber(module, ['estimation_duration_minutes']);
      const masteryThreshold = readNumber(module, ['mastery_threshold']);

      return {
        item_id:
          readString(module, ['id', 'module_id', 'uuid']) ??
          createFallbackId(syllabusId, 'module', moduleOrder ?? index + 1, moduleTitle),
        module_title: moduleTitle,
        topics: normalizeTopics(
          Array.isArray(topicsValue) || typeof topicsValue === 'string' ? topicsValue : undefined,
        ),
        ...(activities.length > 0 ? { activities } : {}),
        ...(moduleDescription ? { description: moduleDescription } : {}),
        ...(estimationDurationMinutes !== undefined
          ? { estimation_duration_minutes: estimationDurationMinutes }
          : {}),
        ...(grammarFocus.length > 0 ? { grammar_focus: grammarFocus } : {}),
        ...(masteryThreshold !== undefined ? { mastery_threshold: masteryThreshold } : {}),
        ...(topicScopeTerms.length > 0 ? { topic_scope_terms: topicScopeTerms } : {}),
        ...(translations.length > 0 ? { translations } : {}),
        ...(vocabularyLoad !== undefined ? { vocabulary_load: vocabularyLoad } : {}),
        ...(moduleStatus ? { status: moduleStatus } : {}),
        ...(moduleOrder !== undefined ? { order: moduleOrder } : {}),
      };
    })
    .filter((module) => {
      if (!module.status) {
        return true;
      }

      return module.status === 'available';
    });
}

function normalizeApiSyllabusEntry(data: unknown, requestedLanguage: SyllabusLanguage) {
  const { syllabus, modules } = getSyllabusRecord(data);

  if (!syllabus) {
    throw new Error('Format data silabus tidak valid');
  }

  const language = normalizeLanguage(
    readString(syllabus, ['language', 'subject']),
    requestedLanguage,
  );
  const title =
    readString(syllabus, ['title', 'name', 'unit_title', 'syllabus_title']) ?? 'Unit pembelajaran';
  const syllabusId =
    readString(syllabus, ['id', 'syllabus_id', 'uuid']) ??
    createFallbackId('syllabus', language, title);
  const description = readString(syllabus, ['description', 'desc', 'level_description']);
  const className = readString(syllabus, ['class', 'grade', 'kelas', 'class_name']);
  const cefr = normalizeCefr(readLevel(syllabus));
  const translations = normalizeTranslations(syllabus.translations);

  return {
    id: syllabusId,
    grade: normalizeGrade(className),
    level: description ?? 'Level belum tersedia',
    cefr,
    subject: languageSubjects[language],
    language,
    curriculum: `${languageSubjects[language]} CEFR`,
    ...(translations.length > 0 ? { translations } : {}),
    unit: {
      unit_id: syllabusId,
      unit_title: title,
      items: normalizeApiModules(modules, syllabusId),
      ...(translations.length > 0 ? { translations } : {}),
    },
  };
}

function normalizeApiSyllabus(data: unknown, requestedLanguage: SyllabusLanguage): SyllabusCatalog {
  const records = readSyllabusRecords(data);
  const entries = (records.length > 0 ? records : [data]).map((record) =>
    normalizeApiSyllabusEntry(record, requestedLanguage),
  );
  const matchingEntries = entries.filter((entry) => entry.language === requestedLanguage);
  const selectedEntries = matchingEntries.length > 0 ? matchingEntries : entries;
  const primaryEntry = selectedEntries[0];

  if (!primaryEntry) {
    throw new Error('Format data silabus tidak valid');
  }

  return {
    id: primaryEntry.id,
    grade: primaryEntry.grade,
    level: primaryEntry.level,
    cefr: primaryEntry.cefr,
    subject: primaryEntry.subject,
    language: primaryEntry.language,
    curriculum: primaryEntry.curriculum,
    ...(primaryEntry.translations ? { translations: primaryEntry.translations } : {}),
    units: selectedEntries.map((entry) => entry.unit),
  };
}

async function getAuthHeaders() {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  } catch {
    return undefined;
  }
}

function getFallbackSyllabus(language: SyllabusLanguage) {
  return englishSyllabi.find((syllabus) => syllabus.language === language) ?? null;
}

function getFallbackModules(syllabusId: string) {
  const syllabus = englishSyllabi.find(
    (item) => item.id === syllabusId || item.units.some((unit) => unit.unit_id === syllabusId),
  );
  return syllabus?.units.find((unit) => unit.unit_id === syllabusId)?.items ?? [];
}

export async function getSyllabusModules({
  syllabusId,
}: GetSyllabusModulesParams): Promise<SyllabusModule[]> {
  const apiUrl = process.env.SYLLABUS_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return getFallbackModules(syllabusId);
  }

  const url = createApiUrl(`syllabi/${encodeURIComponent(syllabusId)}/modules`, apiUrl);
  const authHeaders = await getAuthHeaders();
  const response = await fetch(url, {
    cache: 'no-store',
    ...(authHeaders ? { headers: authHeaders } : {}),
  }).catch(() => null);

  if (!response) {
    return getFallbackModules(syllabusId);
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Gagal mengambil data modul');
  }

  const payload = (await response.json()) as SyllabusModulesApiResponse;

  if (!payload.success || !payload.data) {
    throw new Error(payload.message ?? 'Gagal mengambil data modul');
  }

  return normalizeApiModules(readRecords(payload.data), syllabusId);
}

export async function getSyllabus({
  language,
}: GetSyllabusParams): Promise<SyllabusCatalog | null> {
  const apiUrl = process.env.SYLLABUS_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    const url = createApiUrl('syllabi', apiUrl);
    url.searchParams.set('language', language);

    const authHeaders = await getAuthHeaders();
    const response = await fetch(url, {
      cache: 'no-store',
      ...(authHeaders ? { headers: authHeaders } : {}),
    }).catch(() => null);

    if (!response) {
      return getFallbackSyllabus(language);
    }

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(error?.message ?? 'Gagal mengambil data silabus');
    }

    const payload = (await response.json()) as SyllabiApiResponse;

    if (!payload.success || !payload.data) {
      throw new Error(payload.message ?? 'Gagal mengambil data silabus');
    }

    const catalog = normalizeApiSyllabus(payload.data, language);

    try {
      const units = await Promise.all(
        catalog.units.map(async (unit) => {
          const shouldFetchModules = catalog.units.length === 1 || unit.items.length === 0;

          if (!shouldFetchModules) {
            return unit;
          }

          try {
            const modules = await getSyllabusModules({
              syllabusId: unit.unit_id,
              language: catalog.language,
            });

            if (modules.length > 0 || unit.items.length === 0) {
              return { ...unit, items: modules };
            }
          } catch (error) {
            if (unit.items.length === 0) {
              throw error;
            }
          }

          return unit;
        }),
      );

      return { ...catalog, units };
    } catch (error) {
      if (catalog.units.some((unit) => unit.items.length === 0)) {
        throw error;
      }
    }

    return catalog;
  }

  return getFallbackSyllabus(language);
}
