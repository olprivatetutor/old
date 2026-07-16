import type * as ChatRoute from '../route';

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

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => new MockJsonResponse(body, init),
  },
}));

const { POST } = jest.requireActual('../route') as typeof ChatRoute;

function createRequest(body: unknown, token = 'access-token') {
  return {
    json: async () => body,
    cookies: {
      get: (name: string) => (name === 'auth-token' && token ? { value: token } : undefined),
    },
  } as Parameters<typeof POST>[0];
}

describe('POST /api/assessment/chat', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('proxies chat request to backend', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce(
      new MockJsonResponse({
        success: true,
        data: {
          reply: 'Nice to meet you. Can you introduce a friend now?',
        },
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const response = await POST(
      createRequest({
        module_id: 'mod-eng-ix-01-01',
        user_text: 'My name is Ahmad. Nice to meet you.',
      }),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        reply: 'Nice to meet you. Can you introduce a friend now?',
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(new URL('https://api.example.com/api/assessment/chat'), {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify({
        module_id: 'mod-eng-ix-01-01',
        user_text: 'My name is Ahmad. Nice to meet you.',
      }),
    });
  });

  it('normalizes alternate backend response field names', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce(
      new MockJsonResponse({
        success: true,
        data: {
          ai_response: 'Great answer. Tell me one more thing.',
          assessment_result: {
            level: 'A2',
            score: 72,
            summary: 'Good basic conversation skills.',
            strengths: ['Clear introduction'],
            areas: ['Longer explanations'],
          },
        },
      }),
    ) as typeof fetch;

    const response = await POST(
      createRequest({ module_id: 'mod-eng-ix-01-01', user_text: 'Hello' }),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        reply: 'Great answer. Tell me one more thing.',
        result: {
          level: 'A2',
          score: 72,
        },
      },
    });
    expect(response.status).toBe(200);
  });

  it('preserves assessment result translations', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce(
      new MockJsonResponse({
        success: true,
        data: {
          reply: 'Nice to meet you. Can you introduce a friend now?',
          result: {
            cefr_level: 'A1',
            level: 'A1',
            score: 82,
            title: 'MasyaAllah, You Are Awesome',
            summary: 'You can introduce yourself clearly.',
            strengths: ['Clear greeting'],
            areas: ['Friend introductions'],
            translations: [
              {
                language: 'bahasa indonesia',
                title: 'MasyaAllah, Kamu Hebat',
                summary: 'Kamu bisa memperkenalkan diri dengan jelas.',
                strengths: ['Sapaan jelas'],
                areas: ['Perkenalan teman'],
              },
            ],
          },
        },
      }),
    ) as typeof fetch;

    const response = await POST(
      createRequest({ module_id: 'mod-eng-ix-01-01', user_text: 'Hello' }),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        result: {
          translations: [
            {
              language: 'bahasa indonesia',
              title: 'MasyaAllah, Kamu Hebat',
              summary: 'Kamu bisa memperkenalkan diri dengan jelas.',
              strengths: ['Sapaan jelas'],
              areas: ['Perkenalan teman'],
            },
          ],
        },
      },
    });
    expect(response.status).toBe(200);
  });

  it('accepts completed assessment responses without a reply', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce(
      new MockJsonResponse({
        success: true,
        data: {
          assessment_result: {
            level: 'B1',
            score: 81,
            summary: 'Ready for the next learning path.',
            strengths: ['Confident responses'],
            areas: ['Grammar accuracy'],
          },
        },
      }),
    ) as typeof fetch;

    const response = await POST(
      createRequest({ module_id: 'mod-eng-ix-01-01', user_text: 'I want to improve this year.' }),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        reply: 'Assessment completed. Preparing your result...',
        result: {
          level: 'B1',
          score: 81,
        },
      },
    });
    expect(response.status).toBe(200);
  });

  it('returns validation error when body is incomplete', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';

    const response = await POST(createRequest({ module_id: 'mod-eng-ix-01-01' }));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Module dan teks jawaban wajib diisi',
    });
    expect(response.status).toBe(400);
  });

  it('forwards backend error message', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        new MockJsonResponse({ success: false, message: 'invalid request body' }, { status: 400 }),
      ) as typeof fetch;

    const response = await POST(
      createRequest({ module_id: 'mod-eng-ix-01-01', user_text: 'Hello' }),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'invalid request body',
    });
    expect(response.status).toBe(400);
  });
});
