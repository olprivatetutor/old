import type * as SpeechRoute from '../route';

class MockHeaders {
  private readonly values = new Map<string, string>();

  constructor(init?: Record<string, string>) {
    Object.entries(init ?? {}).forEach(([key, value]) => this.values.set(key.toLowerCase(), value));
  }

  get(key: string) {
    return this.values.get(key.toLowerCase()) ?? null;
  }
}

class MockResponse {
  readonly body: unknown;
  readonly headers: MockHeaders;
  readonly ok: boolean;
  readonly status: number;
  protected jsonBody?: unknown;

  constructor(body?: unknown, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new MockHeaders(init?.headers as Record<string, string> | undefined);
  }

  static json(body: unknown, init?: ResponseInit) {
    const response = new MockResponse(undefined, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers as object) },
    });
    response.jsonBody = body;
    return response;
  }

  async json() {
    return this.jsonBody;
  }
}

class MockNextResponse extends MockResponse {
  readonly cookies = {
    set: jest.fn(),
  };

  static json(body: unknown, init?: ResponseInit) {
    const response = new MockNextResponse(undefined, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers as object) },
    });
    response.jsonBody = body;
    return response;
  }
}

(global as { Response?: unknown }).Response = MockResponse;

jest.mock('next/server', () => ({
  NextResponse: MockNextResponse,
}));

const { POST } = jest.requireActual('../route') as typeof SpeechRoute;

function createRequest(body: unknown, token = 'access-token') {
  return {
    json: async () => body,
    cookies: {
      get: (name: string) => (name === 'auth-token' && token ? { value: token } : undefined),
    },
  } as Parameters<typeof POST>[0];
}

describe('POST /api/assessment/speech/tts', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('proxies speech request and returns audio stream', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce(
      new MockResponse('audio', {
        status: 200,
        headers: { 'Content-Type': 'audio/mpeg' },
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const response = await POST(createRequest({ user_text: 'Hello, welcome.' }));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/assessment/speech/tts'),
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer access-token',
        },
        body: JSON.stringify({ user_text: 'Hello, welcome.' }),
      },
    );
  });

  it('returns validation error when user_text is empty', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';

    const response = await POST(createRequest({ user_text: ' ' }));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Teks wajib diisi',
    });
    expect(response.status).toBe(400);
  });

  it('forwards backend error message', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        MockResponse.json({ success: false, message: 'invalid request body' }, { status: 400 }),
      ) as typeof fetch;

    const response = await POST(createRequest({ user_text: 'Hello' }));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'invalid request body',
    });
    expect(response.status).toBe(400);
  });
});
