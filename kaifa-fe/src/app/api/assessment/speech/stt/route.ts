import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { LoginTokenData } from '@/features/auth/types/auth.types';
import { fetchWithAuthRefresh, setAuthCookies } from '@/features/auth/server/token-refresh';

interface SpeechToTextResponse {
  success: boolean;
  data?: {
    text?: string;
  };
  message?: string;
}

const speechToTextProxyTimeoutMs = 15_000;

async function fetchSpeechToText({
  apiBaseUrl,
  audioBlob,
  endpoint,
  request,
}: {
  apiBaseUrl: string;
  audioBlob: Blob;
  endpoint: string;
  request: NextRequest;
}): Promise<{
  payload: SpeechToTextResponse | null;
  response: Response | null;
  tokens: LoginTokenData | undefined;
}> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), speechToTextProxyTimeoutMs);

  try {
    const { response, tokens } = await fetchWithAuthRefresh({
      apiBaseUrl,
      endpoint,
      request,
      init: {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'audio/webm',
        },
        body: audioBlob,
        signal: abortController.signal,
      },
    });
    const payload = (await response.json().catch(() => null)) as SpeechToTextResponse | null;

    return { payload, response, tokens };
  } catch {
    return { payload: null, response: null, tokens: undefined };
  } finally {
    clearTimeout(timeoutId);
  }
}

function isSuccessfulSpeechToText(payload: SpeechToTextResponse | null, response: Response | null) {
  return Boolean(response?.ok && payload?.success && payload.data?.text?.trim());
}

export async function POST(request: NextRequest) {
  const moduleId = request.nextUrl.searchParams.get('module_id')?.trim();
  const audioBlob = await request.blob().catch(() => null);

  if (!audioBlob?.size) {
    return NextResponse.json({ success: false, message: 'Audio wajib diisi' }, { status: 400 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: 'Konfigurasi API assessment belum tersedia' },
      { status: 500 },
    );
  }

  const query = moduleId ? `?${new URLSearchParams({ module_id: moduleId })}` : '';
  const primaryResult = await fetchSpeechToText({
    request,
    apiBaseUrl,
    audioBlob,
    endpoint: `assessment/speech/stt${query}`,
  });

  const result = isSuccessfulSpeechToText(primaryResult.payload, primaryResult.response)
    ? primaryResult
    : await fetchSpeechToText({
        request,
        apiBaseUrl,
        audioBlob,
        endpoint: `learning/speech/stt${query}`,
      });

  const payload = result.payload;
  const apiResponse = result.response;
  const tokens = result.tokens ?? primaryResult.tokens;

  if (!apiResponse?.ok || !payload?.success || !payload.data?.text?.trim()) {
    const response = NextResponse.json(
      {
        success: false,
        message: payload?.message ?? 'Gagal mengubah suara menjadi teks',
      },
      { status: apiResponse?.ok ? 500 : (apiResponse?.status ?? 504) },
    );
    if (tokens) setAuthCookies(response, tokens);
    return response;
  }

  const response = NextResponse.json(
    {
      success: true,
      data: {
        text: payload.data.text.trim(),
      },
    },
    { status: 200 },
  );
  if (tokens) setAuthCookies(response, tokens);
  return response;
}
