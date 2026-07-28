import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { useAuth } from '../use-auth';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSetAuthenticated = jest.fn();
const mockClearAuth = jest.fn();
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    setAuthenticated: mockSetAuthenticated,
    clearAuth: mockClearAuth,
  }),
}));

const mockLoginService = jest.fn();
const mockLogoutService = jest.fn();
jest.mock('../../services/auth.service', () => ({
  loginService: (...args: unknown[]) => mockLoginService(...args),
  logoutService: (...args: unknown[]) => mockLogoutService(...args),
}));

beforeEach(() => jest.clearAllMocks());

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useAuth', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  describe('login', () => {
    it('marks session authenticated and redirects to languages on success', async () => {
      mockLoginService.mockResolvedValueOnce({
        success: true,
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          token_type: 'Bearer',
          access_token_expires_in: 3600,
          refresh_token_expires_in: 604800,
        },
      });
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password123' });
      });

      expect(mockSetAuthenticated).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/languages');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('sets error message from Error instance on failure', async () => {
      mockLoginService.mockRejectedValueOnce(new Error('Kredensial tidak valid'));
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'wrong' });
      });

      expect(result.current.error).toBe('Kredensial tidak valid');
      expect(result.current.isLoading).toBe(false);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('sets generic error message for non-Error exceptions', async () => {
      mockLoginService.mockRejectedValueOnce('unexpected string error');
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'wrong' });
      });

      expect(result.current.error).toBe('Terjadi kesalahan');
    });
  });

  describe('logout', () => {
    it('calls logoutService, clearAuth, and redirects to login', async () => {
      mockLogoutService.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLogoutService).toHaveBeenCalled();
      expect(mockClearAuth).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
