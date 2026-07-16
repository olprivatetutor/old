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

describe('POST /api/learning/chat', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('proxies learning chat request to backend', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce(
      new MockJsonResponse({
        success: true,
        data: {
          type: 'chat',
          reply: 'Great. Now add your school name.',
          paragraph: 'Short paragraph',
          question_number: 2,
          listening_state: {
            phase: 'asking',
            material_type: 'listening',
            paragraph: 'Short paragraph',
            questions_asked: 2,
            answers: ['I am Ahmad.'],
          },
        },
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const body = {
      learning_path_step_id: 'lp-7f9a1c2d3e4b5a60-step-1',
      user_text: 'I am Ahmad.',
    };

    const response = await POST(createRequest(body));

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        reply: 'Great. Now add your school name.',
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(new URL('https://api.example.com/api/learning/chat'), {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify(body),
    });
  });

  it('returns validation error when body is incomplete', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';

    const response = await POST(createRequest({ module_id: 'mod-eng-ix-01-01' }));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Data chat belajar belum lengkap',
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
      createRequest({
        learning_path_step_id: 'lp-7f9a1c2d3e4b5a60-step-1',
        user_text: 'Hello',
      }),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'invalid request body',
    });
    expect(response.status).toBe(400);
  });
});
