import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchWithAuthRefresh, setAuthCookies } from '@/features/auth/server/token-refresh';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { user_text?: string } | null;
  const userText = body?.user_text?.trim();

  if (!userText) {
    return NextResponse.json({ success: false, message: 'Teks wajib diisi' }, { status: 400 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: 'Konfigurasi API assessment belum tersedia' },
      { status: 500 },
    );
  }

  const { response: apiResponse, tokens } = await fetchWithAuthRefresh({
    apiBaseUrl,
    endpoint: 'assessment/speech/tts',
    request,
    init: {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_text: userText }),
    },
  });

  if (!apiResponse.ok) {
    const error = (await apiResponse.json().catch(() => null)) as { message?: string } | null;

    const response = NextResponse.json(
      { success: false, message: error?.message ?? 'Gagal mengambil suara AI' },
      { status: apiResponse.status },
    );
    if (tokens) setAuthCookies(response, tokens);
    return response;
  }

  const response = new NextResponse(apiResponse.body, {
    status: 200,
    headers: {
      'Content-Type': apiResponse.headers.get('content-type') ?? 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  });
  if (tokens) setAuthCookies(response, tokens);
  return response;
}
