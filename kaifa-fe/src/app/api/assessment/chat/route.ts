import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type {
  AssessmentResult,
  SendAssessmentChatResponse,
} from '@/features/assessment/types/assessment.types';
import { fetchWithAuthRefresh, setAuthCookies } from '@/features/auth/server/token-refresh';

type AssessmentChatPayload = SendAssessmentChatResponse &
  Record<string, unknown> & {
    data?: Record<string, unknown> | null;
  };

function readString(source: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function readResult(source: Record<string, unknown> | null | undefined) {
  return source?.result ?? source?.assessment_result ?? source?.assessment;
}

function isAssessmentResult(value: unknown): value is AssessmentResult {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeAssessmentChatPayload(
  payload: AssessmentChatPayload | null,
): SendAssessmentChatResponse | null {
  if (!payload?.success) return payload;

  const data = payload.data && typeof payload.data === 'object' ? payload.data : undefined;
  const reply =
    readString(data, ['reply', 'response', 'ai_response', 'assistant_reply', 'message']) ??
    readString(payload, ['reply', 'response', 'ai_response', 'assistant_reply']);
  const resultValue = readResult(data) ?? readResult(payload);
  const result = isAssessmentResult(resultValue) ? resultValue : undefined;

  if (!reply && !result) return payload;

  return {
    success: true,
    data: {
      reply: reply ?? 'Assessment completed. Preparing your result...',
      ...(result ? { result } : {}),
    },
    ...(payload.message ? { message: payload.message } : {}),
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    module_id?: string;
    user_text?: string;
  } | null;
  const moduleId = body?.module_id?.trim();
  const userText = body?.user_text?.trim();

  if (!moduleId || !userText) {
    return NextResponse.json(
      { success: false, message: 'Module dan teks jawaban wajib diisi' },
      { status: 400 },
    );
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      {
        success: true,
        data: {
          reply: 'Thank you. Please continue with one more detail.',
        },
      },
      { status: 200 },
    );
  }

  const { response: apiResponse, tokens } = await fetchWithAuthRefresh({
    apiBaseUrl,
    endpoint: 'assessment/chat',
    request,
    init: {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ module_id: moduleId, user_text: userText }),
    },
  });

  const payload = normalizeAssessmentChatPayload(
    (await apiResponse.json().catch(() => null)) as AssessmentChatPayload | null,
  );

  if (!apiResponse.ok || !payload?.success || !payload.data?.reply) {
    const response = NextResponse.json(
      {
        success: false,
        message: payload?.message ?? 'Gagal mengirim jawaban assessment',
      },
      { status: apiResponse.ok ? 500 : apiResponse.status },
    );
    if (tokens) setAuthCookies(response, tokens);
    return response;
  }

  const response = NextResponse.json(payload, { status: 200 });
  if (tokens) setAuthCookies(response, tokens);
  return response;
}
