import { apiClient } from '@/lib/api/client';
import type { LoginCredentials, LoginResponse, User } from '../types/auth.types';

function createApiUrl(endpoint: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error('Konfigurasi API login belum tersedia');
  }

  return new URL(endpoint, apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`).toString();
}

function setAuthCookie(name: string, value: string, maxAge: number) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

export async function loginService(credentials: LoginCredentials): Promise<LoginResponse> {
  const data = await apiClient.post<LoginResponse | { success: false; message?: string }>(
    createApiUrl('auth/login'),
    credentials,
  );

  if (!data.success) {
    throw new Error(data.message ?? 'Login gagal');
  }

  setAuthCookie('auth-token', data.data.access_token, data.data.access_token_expires_in);
  setAuthCookie('refresh-token', data.data.refresh_token, data.data.refresh_token_expires_in);

  return data;
}

export async function logoutService(): Promise<void> {
  await apiClient.post('/api/auth/logout');
}

export async function getMeService(): Promise<User> {
  return apiClient.get<User>('/api/auth/me').catch(() => {
    throw new Error('Sesi tidak valid');
  });
}
