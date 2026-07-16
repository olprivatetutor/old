import { cookies } from 'next/headers';
import type {
  StartAssessmentData,
  StartAssessmentParams,
  StartAssessmentResponse,
} from '../types/assessment.types';

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

function createFallbackReply(moduleId: string) {
  return `Assalamu'alaikum! Let's begin this assessment for module ${moduleId}. Please introduce yourself.`;
}

export async function startAssessment({
  moduleId,
}: StartAssessmentParams): Promise<StartAssessmentData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return { reply: createFallbackReply(moduleId) };
  }

  const authHeaders = await getAuthHeaders();
  const response = await fetch(createApiUrl('assessment/start', apiUrl), {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders ?? {}),
    },
    body: JSON.stringify({ module_id: moduleId }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Gagal memulai assessment');
  }

  const payload = (await response.json()) as StartAssessmentResponse;

  if (!payload.success || !payload.data?.reply) {
    throw new Error(payload.message ?? 'Gagal memulai assessment');
  }

  return payload.data;
}
