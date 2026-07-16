import type { NextRequest, NextResponse } from 'next/server';
import type { LoginTokenData, RefreshTokenResponse } from '../types/auth.types';

interface FetchWithAuthRefreshParams {
  apiBaseUrl: string;
  endpoint: string;
  init: RequestInit;
  request: NextRequest;
}

export function createApiUrl(endpoint: string, baseUrl: string) {
  return new URL(endpoint, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
}

export function setAuthCookies(response: NextResponse, tokens: LoginTokenData) {
  response.cookies.set('auth-token', tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.access_token_expires_in,
    path: '/',
  });
  response.cookies.set('refresh-token', tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.refresh_token_expires_in,
    path: '/',
  });
}

export async function refreshAuthToken(refreshToken: string): Promise<LoginTokenData> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error('Konfigurasi API refresh token belum tersedia');
  }

  const response = await fetch(createApiUrl('auth/refresh-token', apiBaseUrl), {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const payload = (await response.json().catch(() => null)) as RefreshTokenResponse | null;

  if (!response.ok || !payload || !payload.success) {
    throw new Error(payload && !payload.success ? payload.message : 'Sesi sudah berakhir');
  }

  return payload.data;
}

function withAuthHeader(init: RequestInit, accessToken?: string) {
  return {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
}

export async function fetchWithAuthRefresh({
  apiBaseUrl,
  endpoint,
  init,
  request,
}: FetchWithAuthRefreshParams): Promise<{ response: Response; tokens?: LoginTokenData }> {
  const accessToken = request.cookies.get('auth-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;
  const url = createApiUrl(endpoint, apiBaseUrl);
  const response = await fetch(url, withAuthHeader(init, accessToken));

  if (response.status !== 401 || !refreshToken) {
    return { response };
  }

  const tokens = await refreshAuthToken(refreshToken);
  const retryResponse = await fetch(url, withAuthHeader(init, tokens.access_token));
  return { response: retryResponse, tokens };
}
