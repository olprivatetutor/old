import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '../auth.store';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student' as const,
};

beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

describe('useAuthStore', () => {
  it('has correct initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('setUser updates user and sets isAuthenticated to true', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(mockUser);
    });
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('setAuthenticated marks session authenticated without user data', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setAuthenticated();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clearAuth resets user and isAuthenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(mockUser);
      result.current.clearAuth();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
