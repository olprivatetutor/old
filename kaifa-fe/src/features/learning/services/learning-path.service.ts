import { cookies } from 'next/headers';
import type { SyllabusModule } from '@/features/syllabus/types/syllabus.types';
import type {
  GenerateLearningPathApiData,
  GenerateLearningPathApiResponse,
  GenerateLearningPathOptions,
  LearningPath,
  LearningPathItem,
  LearningPathItemTranslation,
  LearningPathTranslation,
  StartLearningChatData,
  StartLearningChatParams,
  StartLearningChatResponse,
} from '../types/learning.types';

const focusCycle = ['Percakapan', 'Kosakata', 'Tata bahasa', 'Praktik'];

const defaultTopics = [
  'Warm-up Conversation',
  'Useful Vocabulary',
  'Building Clear Sentences',
  'Guided Speaking Practice',
];

function createApiUrl(endpoint: string, baseUrl: string) {
  return new URL(endpoint, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
}

async function getAuthHeaders() {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  } catch {
    return undefined;
  }
}

function normalizeLevel(level?: string) {
  return level?.trim() || 'B1';
}

function normalizePathTranslations(
  translations: GenerateLearningPathApiData['translations'] | undefined,
): LearningPathTranslation[] {
  return (
    translations
      ?.map((translation) => {
        const language = translation.language?.trim();

        if (!language) {
          return undefined;
        }

        const id = translation.id?.trim();
        const topicScope = translation.topic_scope?.trim();

        return {
          language,
          ...(id ? { id } : {}),
          ...(topicScope ? { topicScope } : {}),
        };
      })
      .filter((translation): translation is LearningPathTranslation => Boolean(translation)) ?? []
  );
}

function normalizeStepTranslations(
  translations: GenerateLearningPathApiData['steps'][number]['translations'] | undefined,
): LearningPathItemTranslation[] {
  return (
    translations
      ?.map((translation) => {
        const language = translation.language?.trim();

        if (!language) {
          return undefined;
        }

        const id = translation.id?.trim();
        const activity = translation.activity?.trim();
        const title = translation.title?.trim();
        const description = translation.description?.trim();
        const topicScope = translation.topic_scope?.trim();

        return {
          language,
          ...(id ? { id } : {}),
          ...(activity ? { activity } : {}),
          ...(title ? { title } : {}),
          ...(description ? { description } : {}),
          ...(topicScope ? { topicScope } : {}),
        };
      })
      .filter((translation): translation is LearningPathItemTranslation => Boolean(translation)) ??
    []
  );
}

function createItem(topic: string, index: number, level: string): LearningPathItem {
  const focus = focusCycle[index % focusCycle.length] ?? 'Praktik';
  const descriptions: Record<string, string> = {
    Percakapan: 'Bangun kepercayaan diri melalui percakapan terpandu bersama AI.',
    Kosakata: 'Pelajari kosakata penting dan gunakan dalam konteks yang natural.',
    'Tata bahasa': 'Rapikan struktur kalimat agar pesanmu semakin jelas.',
    Praktik: 'Gabungkan seluruh kemampuan melalui simulasi percakapan nyata.',
  };

  return {
    id: `path-${index + 1}`,
    order: index + 1,
    title: topic,
    description:
      descriptions[focus] ?? 'Gabungkan seluruh kemampuan melalui simulasi percakapan nyata.',
    instruction: `Mampu membahas ${topic.toLowerCase()} dengan kalimat level ${level} yang jelas.`,
    objective: `Mampu membahas ${topic.toLowerCase()} dengan kalimat level ${level} yang jelas.`,
    focus,
    activity: focus,
    requiredTime: 10,
    topicScope: topic,
    target: [topic],
    progress: 0,
  };
}

function createFallbackLearningPath(module: SyllabusModule, level: string): LearningPath {
  const sourceTopics = module.topics?.filter((topic) => topic.toLowerCase() !== 'assessment');
  const topics = sourceTopics?.length ? sourceTopics.slice(0, 5) : defaultTopics;

  return {
    id: `lp-local-${module.item_id}`,
    level,
    score: 82,
    summary: `Path ini disusun berdasarkan hasil assessment dan modul “${module.module_title}”. Fokus utamanya adalah memperkuat kosakata, struktur kalimat, dan kelancaran berbicara.`,
    items: topics.map((topic, index) => createItem(topic, index, level)),
    moduleId: module.item_id,
    totalSteps: topics.length,
  };
}

function normalizeApiLearningPath(
  payload: GenerateLearningPathApiResponse,
  module: SyllabusModule,
): LearningPath {
  if (!payload.success || !payload.data) {
    throw new Error(payload.message ?? 'Gagal membuat learning path');
  }

  const steps = payload.data.steps
    .slice()
    .sort((first, second) => first.order - second.order)
    .map((step, index): LearningPathItem => {
      const title = step.title.trim() || `Langkah ${index + 1}`;
      const description = step.description.trim();
      const order = step.order || index + 1;
      const activity = step.activity.trim();
      const target = step.target.filter(Boolean);
      const objective = target.length ? target.join(', ') : description;
      const titleRomanized = step.title_romanized?.trim();
      const descriptionRomanized = step.description_romanized?.trim();
      const activityRomanized = step.activity_romanized?.trim();
      const topicScopeRomanized = step.topic_scope_romanized?.trim();
      const translations = normalizeStepTranslations(step.translations);

      return {
        id: step.id || `path-${order}`,
        order,
        title,
        ...(titleRomanized ? { titleRomanized } : {}),
        instruction: description,
        description: description || 'Ikuti instruksi belajar dari AI untuk langkah ini.',
        ...(descriptionRomanized ? { descriptionRomanized } : {}),
        objective: objective || `Selesaikan ${title.toLowerCase()} dengan runtut.`,
        focus: activity,
        type: activity,
        activity,
        ...(activityRomanized ? { activityRomanized } : {}),
        requiredTime: step.required_time,
        topicScope: step.topic_scope,
        ...(topicScopeRomanized ? { topicScopeRomanized } : {}),
        target,
        progress: step.progress,
        ...(translations.length > 0 ? { translations } : {}),
      };
    });
  const topicScopeRomanized = payload.data.topic_scope_romanized?.trim();
  const translations = normalizePathTranslations(payload.data.translations);

  return {
    id: payload.data.id,
    level: payload.data.level,
    summary:
      payload.data.topic_scope ||
      `Path ini disusun berdasarkan hasil assessment dan modul “${module.module_title}”.`,
    items: steps,
    language: payload.data.language,
    moduleId: payload.data.module_id,
    topicScope: payload.data.topic_scope,
    ...(topicScopeRomanized ? { topicScopeRomanized } : {}),
    totalSteps: payload.data.total_steps,
    ...(translations.length > 0 ? { translations } : {}),
  };
}

export async function generateLearningPath(
  module: SyllabusModule,
  options: GenerateLearningPathOptions = {},
): Promise<LearningPath> {
  const level = normalizeLevel(options.level);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return createFallbackLearningPath(module, level);
  }

  const authHeaders = await getAuthHeaders();
  const response = await fetch(createApiUrl('learning/generate', apiUrl), {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders ?? {}),
    },
    body: JSON.stringify({ module_id: module.item_id }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Gagal membuat learning path');
  }

  const payload = (await response.json()) as GenerateLearningPathApiResponse;
  return normalizeApiLearningPath(payload, module);
}

export function serializeLearningPathForApi(
  learningPath: LearningPath,
): GenerateLearningPathApiData {
  return {
    id: learningPath.id ?? (learningPath.moduleId ? `lp-${learningPath.moduleId}` : 'lp-local'),
    language: learningPath.language ?? 'english',
    module_id: learningPath.moduleId ?? '',
    level: learningPath.level,
    topic_scope: learningPath.topicScope ?? learningPath.summary,
    ...(learningPath.topicScopeRomanized
      ? { topic_scope_romanized: learningPath.topicScopeRomanized }
      : {}),
    steps: learningPath.items.map((item) => ({
      id: item.id,
      order: item.order,
      activity: item.activity ?? item.type ?? item.focus,
      ...(item.activityRomanized ? { activity_romanized: item.activityRomanized } : {}),
      title: item.title,
      ...(item.titleRomanized ? { title_romanized: item.titleRomanized } : {}),
      description: item.description,
      ...(item.descriptionRomanized ? { description_romanized: item.descriptionRomanized } : {}),
      required_time: item.requiredTime ?? 10,
      topic_scope: item.topicScope ?? item.title,
      ...(item.topicScopeRomanized ? { topic_scope_romanized: item.topicScopeRomanized } : {}),
      target: item.target ?? [item.objective],
      progress: item.progress ?? 0,
      ...(item.translations?.length
        ? {
            translations: item.translations.map((translation) => ({
              ...(translation.id ? { id: translation.id } : {}),
              language: translation.language,
              ...(translation.activity ? { activity: translation.activity } : {}),
              ...(translation.title ? { title: translation.title } : {}),
              ...(translation.description ? { description: translation.description } : {}),
              ...(translation.topicScope ? { topic_scope: translation.topicScope } : {}),
            })),
          }
        : {}),
    })),
    total_steps: learningPath.totalSteps ?? learningPath.items.length,
    ...(learningPath.translations?.length
      ? {
          translations: learningPath.translations.map((translation) => ({
            ...(translation.id ? { id: translation.id } : {}),
            language: translation.language,
            ...(translation.topicScope ? { topic_scope: translation.topicScope } : {}),
          })),
        }
      : {}),
  };
}

function createFallbackStartChat({
  currentStep,
  learningPath,
}: StartLearningChatParams): StartLearningChatData {
  const step = learningPath.items.find((item) => item.order === currentStep);
  const topic = step?.title ?? 'this topic';
  const isArabic = learningPath.language === 'arabic';

  return {
    type: 'chat',
    reply: isArabic
      ? `السلام عليكم! سنركز اليوم على “${topic}”. سأساعدك على البقاء ضمن هذا الموضوع وتحسين كل إجابة. للبدء، ماذا تعرف عن هذا الموضوع؟`
      : `Assalamu'alaikum! Today we will focus on “${topic}”. I will help you stay on this topic and improve each answer. To begin, what do you already know about ${topic.toLowerCase()}?`,
    question_number: 1,
  };
}

export async function startLearningChat(
  params: StartLearningChatParams,
): Promise<StartLearningChatData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return createFallbackStartChat(params);
  }

  const step = params.learningPath.items.find((item) => item.order === params.currentStep);
  const learningPathStepId = params.learningPathStepId ?? step?.id;

  if (!learningPathStepId) {
    throw new Error('Gagal membuka sesi belajar');
  }

  const authHeaders = await getAuthHeaders();
  const response = await fetch(createApiUrl('learning/start', apiUrl), {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders ?? {}),
    },
    body: JSON.stringify({ learning_path_step_id: learningPathStepId }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Gagal membuka sesi belajar');
  }

  const payload = (await response.json()) as StartLearningChatResponse;

  if (!payload.success || !payload.data?.reply) {
    throw new Error(payload.message ?? 'Gagal membuka sesi belajar');
  }

  return payload.data;
}
