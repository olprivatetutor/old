import { startAssessment } from '../assessment.service';

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: jest.fn(() => ({ value: 'access-token' })),
  })),
}));

describe('startAssessment', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('returns fallback reply when API is unavailable', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    await expect(startAssessment({ moduleId: 'mod-eng-ix-01-01' })).resolves.toMatchObject({
      reply: expect.stringContaining('mod-eng-ix-01-01'),
    });
  });

  it('posts module id to assessment start endpoint', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reply: 'Nice to meet you. Can you introduce a friend now?',
          result: {
            level: 'A1',
            score: 82,
            summary: 'string',
            strengths: ['string'],
            areas: ['string'],
          },
        },
      }),
    });
    global.fetch = fetchMock;

    const result = await startAssessment({ moduleId: 'mod-eng-ix-01-01' });

    expect(result).toMatchObject({
      reply: 'Nice to meet you. Can you introduce a friend now?',
      result: {
        level: 'A1',
        score: 82,
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/assessment/start'),
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer access-token',
        },
        body: JSON.stringify({ module_id: 'mod-eng-ix-01-01' }),
      },
    );
  });

  it('throws backend message when API returns an error payload', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'invalid request body' }),
    });

    await expect(startAssessment({ moduleId: 'mod-eng-ix-01-01' })).rejects.toThrow(
      'invalid request body',
    );
  });
});
