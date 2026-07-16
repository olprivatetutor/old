import { apiClient } from '@/lib/api/client';
import type { StartAssessmentData } from '../types/assessment.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function startAssessmentClient(moduleId: string): Promise<StartAssessmentData> {
  const payload = await apiClient.post<ApiResponse<StartAssessmentData>>('/api/assessment/start', {
    moduleId,
  });

  if (!payload.success || !payload.data?.reply) {
    throw new Error(payload.message ?? 'Gagal memulai assessment');
  }

  return payload.data;
}
