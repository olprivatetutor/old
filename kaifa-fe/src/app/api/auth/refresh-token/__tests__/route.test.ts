import type * as RefreshRoute from '../route';

class MockResponse {
  readonly cookies = {
    delete: jest.fn(),
    set: jest.fn(),
  };
  readonly ok: boolean;
  readonly status: number;

  constructor(
    private readonly body: unknown,
    init?: ResponseInit,
  ) {
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
  }

  static json(body: unknown, init?: ResponseInit) {
    return new MockResponse(body, init);
  }

  async json() {
    return this.body;
  }
}

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => MockResponse.json(body, init),
  },
}));

const { POST } = jest.requireActual('../route') as typeof RefreshRoute;

function createRequest(body: unknown, refreshToken = 'refresh-token') {
  return {
    json: async () => body,
    cookies: {
      get: (name: string) =>
        name === 'refresh-token' && refreshToken ? { value: refreshToken } : undefined,
    },
  } as Parameters<typeof POST>[0];
}

describe('POST /api/auth/refresh-token', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('refreshes tokens and sets cookies', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce(
      MockResponse.json({
        success: true,
        data: {
          access_token: 'new-access',
          refresh_token: 'new-refresh',
          token_type: 'Bearer',
          access_token_expires_in: 900,
          refresh_token_expires_in: 604800,
        },
      }),
    ) as typeof fetch;

    const response = await POST(createRequest({ refresh_token: 'refresh-from-body' }));

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      },
    });
    expect(global.fetch).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/auth/refresh-token'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refresh_token: 'refresh-from-body' }),
      }),
    );
    expect(response.cookies.set).toHaveBeenCalledWith(
      'auth-token',
      'new-access',
      expect.objectContaining({ httpOnly: true, maxAge: 900 }),
    );
    expect(response.cookies.set).toHaveBeenCalledWith(
      'refresh-token',
      'new-refresh',
      expect.objectContaining({ httpOnly: true, maxAge: 604800 }),
    );
  });

  it('clears cookies when refresh fails', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        MockResponse.json({ success: false, message: 'invalid request body' }, { status: 400 }),
      ) as typeof fetch;

    const response = await POST(createRequest(null));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'invalid request body',
    });
    expect(response.cookies.delete).toHaveBeenCalledWith('auth-token');
    expect(response.cookies.delete).toHaveBeenCalledWith('refresh-token');
  });
});
