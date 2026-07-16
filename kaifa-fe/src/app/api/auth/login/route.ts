import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setAuthCookies } from '@/features/auth/server/token-refresh';
import type { LoginResponse } from '@/features/auth/types/auth.types';

interface LoginErrorResponse {
  success: false;
  message: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email dan password wajib diisi' },
      { status: 400 },
    );
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: 'Konfigurasi API login belum tersedia' },
      { status: 500 },
    );
  }

  const loginUrl = `${apiBaseUrl.replace(/\/$/, '')}/auth/login`;
  const apiResponse = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  const payload = (await apiResponse.json()) as LoginResponse | LoginErrorResponse;

  if (!apiResponse.ok || !payload.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'message' in payload ? payload.message : 'Login gagal',
      },
      { status: apiResponse.status },
    );
  }

  const response = NextResponse.json(payload, { status: 200 });
  setAuthCookies(response, payload.data);

  return response;
}
