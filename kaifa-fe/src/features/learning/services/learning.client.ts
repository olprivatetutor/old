import { apiClient } from '@/lib/api/client';
import type {
  GenerateLearningPathApiData,
  LearningPath,
  StartLearningChatData,
  StartLearningChatParams,
} from '../types/learning.types';
import type { SyllabusModule } from '@/features/syllabus/types/syllabus.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const learningQueryKeys = {
  path: (moduleId: string | undefined, level: string) =>
    ['learning-path', moduleId, level] as const,
  session: (stepId: string | undefined, stepOrder: number | undefined) =>
    ['learning-session', stepId, stepOrder] as const,
};

export async function generateLearningPathClient(
  module: SyllabusModule,
  level: string,
): Promise<LearningPath> {
  const payload = await apiClient.post<ApiResponse<LearningPath>>('/api/learning/generate', {
    module,
    level,
  });

  if (!payload.success || !payload.data) {
    throw new Error(payload.message ?? 'Gagal membuat learning path');
  }

  return payload.data;
}

export async function startLearningChatClient(
  params: StartLearningChatParams,
): Promise<StartLearningChatData> {
  const payload = await apiClient.post<ApiResponse<StartLearningChatData>>(
    '/api/learning/start',
    params,
  );

  if (!payload.success || !payload.data?.reply) {
    throw new Error(payload.message ?? 'Gagal membuka sesi belajar');
  }

  return payload.data;
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
