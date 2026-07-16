import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchWithAuthRefresh, setAuthCookies } from '@/features/auth/server/token-refresh';

interface SpeechToTextResponse {
  success: boolean;
  data?: {
    text?: string;
  };
  message?: string;
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
      { success: false, message: 'Konfigurasi API learning belum tersedia' },
      { status: 500 },
    );
  }

  const { response: apiResponse, tokens } = await fetchWithAuthRefresh({
    apiBaseUrl,
    endpoint: moduleId
      ? `learning/speech/stt?${new URLSearchParams({ module_id: moduleId })}`
      : 'learning/speech/stt',
    request,
    init: {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'audio/webm',
      },
      body: audioBlob,
    },
  });

  const payload = (await apiResponse.json().catch(() => null)) as SpeechToTextResponse | null;

  if (!apiResponse.ok || !payload?.success || !payload.data?.text?.trim()) {
    const response = NextResponse.json(
      { success: false, message: payload?.message ?? 'Gagal mengubah suara menjadi teks' },
      { status: apiResponse.ok ? 500 : apiResponse.status },
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
