import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshAuthToken, setAuthCookies } from '@/features/auth/server/token-refresh';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { refresh_token?: string } | null;
  const refreshToken = body?.refresh_token?.trim() ?? request.cookies.get('refresh-token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: 'Refresh token tidak tersedia' },
      { status: 401 },
    );
  }

  try {
    const tokens = await refreshAuthToken(refreshToken);
    const response = NextResponse.json({ success: true, data: tokens }, { status: 200 });
    setAuthCookies(response, tokens);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Sesi sudah berakhir',
      },
      { status: 401 },
    );
    response.cookies.delete('auth-token');
    response.cookies.delete('refresh-token');
    return response;
  }
}
