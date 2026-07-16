import { getMeService, loginService, logoutService } from '../auth.service';

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student' as const,
};

describe('loginService', () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockPost.mockClear();
    process.env.NEXT_PUBLIC_API_URL = 'https://api.kaifanesia.com/api';
    document.cookie = 'auth-token=; Max-Age=0; Path=/';
    document.cookie = 'refresh-token=; Max-Age=0; Path=/';
  });

  const loginData = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    token_type: 'Bearer',
    access_token_expires_in: 3600,
    refresh_token_expires_in: 604800,
  };

  it('returns response data on success', async () => {
    const data = { success: true, data: loginData };
    mockPost.mockResolvedValueOnce(data);

    const result = await loginService({ email: 'test@example.com', password: 'password123' });

    expect(result).toEqual(data);
    expect(mockPost).toHaveBeenCalledWith('https://api.kaifanesia.com/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(document.cookie).toContain('auth-token=access-token');
    expect(document.cookie).toContain('refresh-token=refresh-token');
  });

  it('throws error message from response when not ok', async () => {
    mockPost.mockRejectedValueOnce(new Error('Kredensial tidak valid'));

    await expect(loginService({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(
      'Kredensial tidak valid',
    );
  });

  it('throws default message when response has no message', async () => {
    mockPost.mockRejectedValueOnce(new Error('Login gagal'));

    await expect(loginService({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(
      'Login gagal',
    );
  });

  it('throws error message from successful HTTP response with failed payload', async () => {
    mockPost.mockResolvedValueOnce({ success: false, message: 'Email atau password salah' });

    await expect(loginService({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(
      'Email atau password salah',
    );
  });
});

describe('logoutService', () => {
  beforeEach(() => mockPost.mockClear());

  it('calls logout endpoint', async () => {
    mockPost.mockResolvedValueOnce(undefined);
    await logoutService();
    expect(mockPost).toHaveBeenCalledWith('/api/auth/logout');
  });
});

describe('getMeService', () => {
  beforeEach(() => mockGet.mockClear());

  it('returns user data on success', async () => {
    mockGet.mockResolvedValueOnce(mockUser);

    const result = await getMeService();

    expect(result).toEqual(mockUser);
  });

  it('throws when session is invalid', async () => {
    mockGet.mockRejectedValueOnce(new Error('Unauthorized'));

    await expect(getMeService()).rejects.toThrow('Sesi tidak valid');
  });
});
