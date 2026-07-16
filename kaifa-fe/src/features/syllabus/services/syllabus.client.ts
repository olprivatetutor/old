import { apiClient } from '@/lib/api/client';
import type { SyllabusCatalog, SyllabusLanguage } from '../types/syllabus.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const syllabusQueryKeys = {
  catalog: (language: SyllabusLanguage | undefined) => ['syllabus', language] as const,
};

export async function getSyllabusClient(
  language: SyllabusLanguage,
): Promise<SyllabusCatalog | null> {
  const payload = await apiClient.get<ApiResponse<SyllabusCatalog | null>>('/api/syllabus', {
    params: { language },
  });

  if (!payload.success) {
    throw new Error(payload.message ?? 'Gagal mengambil data silabus');
  }

  return payload.data;
}
