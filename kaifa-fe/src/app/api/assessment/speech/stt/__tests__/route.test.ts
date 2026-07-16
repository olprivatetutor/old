import type * as SpeechToTextRoute from '../route';

class MockJsonResponse {
  readonly ok: boolean;
  readonly status: number;

  constructor(
    private readonly body: unknown,
    init?: ResponseInit,
  ) {
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    return this.body;
  }
}

class MockNextJsonResponse extends MockJsonResponse {
  readonly cookies = {
    set: jest.fn(),
  };
}

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => new MockNextJsonResponse(body, init),
  },
}));

const { POST } = jest.requireActual('../route') as typeof SpeechToTextRoute;

function createRequest(audioBlob: Blob | null, token = 'access-token') {
  return {
    blob: async () => audioBlob,
    cookies: {
      get: (name: string) => (name === 'auth-token' && token ? { value: token } : undefined),
    },
    nextUrl: new URL('https://kaifa.test/api/assessment/speech/stt?module_id=mod-eng-ix-01-01'),
  } as Parameters<typeof POST>[0];
}

describe('POST /api/assessment/speech/stt', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('proxies webm audio request and returns transcript text', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const audioBlob = new Blob(['audio'], { type: 'audio/webm' });
    const fetchMock = jest.fn().mockResolvedValueOnce(
      new MockJsonResponse({
        success: true,
        data: {
          text: 'Hello, welcome to today lesson.',
        },
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const response = await POST(createRequest(audioBlob));

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        text: 'Hello, welcome to today lesson.',
      },
    });
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/assessment/speech/stt?module_id=mod-eng-ix-01-01'),
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'audio/webm',
          Authorization: 'Bearer access-token',
        },
        body: audioBlob,
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('returns validation error when audio body is empty', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';

    const response = await POST(createRequest(new Blob([], { type: 'audio/webm' })));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Audio wajib diisi',
    });
    expect(response.status).toBe(400);
  });

  it('falls back to learning stt when assessment stt fails', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const audioBlob = new Blob(['audio'], { type: 'audio/webm' });
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new MockJsonResponse(
          { success: false, message: 'assessment stt unavailable' },
          { status: 500 },
        ),
      )
      .mockResolvedValueOnce(
        new MockJsonResponse({
          success: true,
          data: {
            text: 'Fallback transcript.',
          },
        }),
      );
    global.fetch = fetchMock as typeof fetch;

    const response = await POST(createRequest(audioBlob));

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        text: 'Fallback transcript.',
      },
    });
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenLastCalledWith(
      new URL('https://api.example.com/api/learning/speech/stt?module_id=mod-eng-ix-01-01'),
      expect.objectContaining({
        body: audioBlob,
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
