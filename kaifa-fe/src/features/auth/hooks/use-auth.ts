'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { loginService, logoutService } from '../services/auth.service';
import type { LoginCredentials } from '../types/auth.types';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuthenticated, clearAuth, user, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (response) => {
      if (response.success) {
        setAuthenticated();
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/languages');
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/');
    },
  });

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    await loginMutation.mutateAsync(credentials).catch(() => undefined);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isLoading = loginMutation.isPending || logoutMutation.isPending;

  return { user, isAuthenticated, isLoading, error, login, logout };
}
