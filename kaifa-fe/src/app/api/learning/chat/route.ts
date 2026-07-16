import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchWithAuthRefresh, setAuthCookies } from '@/features/auth/server/token-refresh';
import type { SendLearningChatResponse } from '@/features/learning/types/learning.types';

interface LearningChatRequestBody {
  learning_path_step_id?: string;
  user_text?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LearningChatRequestBody | null;
  const learningPathStepId = body?.learning_path_step_id?.trim();
  const userText = body?.user_text?.trim();

  if (!learningPathStepId || !userText) {
    return NextResponse.json(
      { success: false, message: 'Data chat belajar belum lengkap' },
      { status: 400 },
    );
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      {
        success: true,
        data: {
          type: 'chat',
          reply: `Thank you. Let's keep practicing: ${userText}`,
          question_number: 1,
        },
      },
      { status: 200 },
    );
  }

  const { response: apiResponse, tokens } = await fetchWithAuthRefresh({
    apiBaseUrl,
    endpoint: 'learning/chat',
    request,
    init: {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        learning_path_step_id: learningPathStepId,
        user_text: userText,
      }),
    },
  });

  const payload = (await apiResponse.json().catch(() => null)) as SendLearningChatResponse | null;

  if (!apiResponse.ok || !payload?.success || !payload.data?.reply) {
    const response = NextResponse.json(
      {
        success: false,
        message: payload?.message ?? 'Gagal mengirim pesan belajar',
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
