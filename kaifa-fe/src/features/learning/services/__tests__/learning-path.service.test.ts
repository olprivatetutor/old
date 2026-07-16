import { generateLearningPath, startLearningChat } from '../learning-path.service';

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: jest.fn(() => ({ value: 'access-token' })),
  })),
}));

describe('generateLearningPath', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('creates a personalized path from module topics and excludes assessment', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    const result = await generateLearningPath({
      item_id: 'module-1',
      module_title: 'Introducing Yourself',
      topics: ['Greetings', 'Personal Information', 'Assessment'],
    });

    expect(result.level).toBe('B1');
    expect(result.score).toBe(82);
    expect(result.items).toHaveLength(2);
    expect(result.items.map((item) => item.title)).toEqual(['Greetings', 'Personal Information']);
  });

  it('uses a complete fallback path when the module has no topics', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    const result = await generateLearningPath({
      item_id: 'module-2',
      module_title: 'Formal Communication',
    });

    expect(result.items).toHaveLength(4);
    expect(result.items[0]?.id).toBe('path-1');
  });

  it('posts module id to learning generate endpoint', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'lp-7f9a1c2d3e4b5a60',
          language: 'english',
          module_id: 'mod-eng-ix-01-01',
          level: 'A1',
          topic_scope: 'Greetings and introductions',
          topic_scope_romanized: 'greetings romanized',
          steps: [
            {
              id: 'lp-7f9a1c2d3e4b5a60-step-2',
              order: 2,
              activity: 'practice',
              activity_romanized: 'practice romanized',
              title: 'Practice introductions',
              title_romanized: 'practice title romanized',
              description: 'Introduce yourself in three short sentences.',
              description_romanized: 'practice description romanized',
              required_time: 12,
              topic_scope: 'self-introduction',
              topic_scope_romanized: 'self-introduction romanized',
              target: ['simple present tense'],
              progress: 20,
              translations: [
                {
                  id: 'lp-7f9a1c2d3e4b5a60-step-2-bi',
                  learning_path_step_id: 'lp-7f9a1c2d3e4b5a60-step-2',
                  language: 'bahasa indonesia',
                  activity: 'latihan',
                  title: 'Latihan perkenalan',
                  description: 'Perkenalkan dirimu dalam tiga kalimat pendek.',
                  topic_scope: 'perkenalan diri',
                },
              ],
            },
            {
              id: 'lp-7f9a1c2d3e4b5a60-step-1',
              order: 1,
              activity: 'speaking',
              title: 'Understand greetings',
              description: 'Read common greetings and when to use them.',
              required_time: 10,
              topic_scope: 'greetings',
              target: ['subject pronouns'],
              progress: 0,
            },
          ],
          total_steps: 2,
          translations: [
            {
              id: 'lp-7f9a1c2d3e4b5a60-bi',
              learning_path_id: 'lp-7f9a1c2d3e4b5a60',
              language: 'bahasa indonesia',
              topic_scope: 'Salam dan perkenalan',
            },
          ],
        },
      }),
    });
    global.fetch = fetchMock;

    const result = await generateLearningPath(
      {
        item_id: 'mod-eng-ix-01-01',
        module_title: 'Introducing Yourself',
      },
      { level: 'A1' },
    );

    expect(result).toMatchObject({
      level: 'A1',
      language: 'english',
      moduleId: 'mod-eng-ix-01-01',
      summary: 'Greetings and introductions',
      topicScopeRomanized: 'greetings romanized',
      totalSteps: 2,
      translations: [
        {
          id: 'lp-7f9a1c2d3e4b5a60-bi',
          language: 'bahasa indonesia',
          topicScope: 'Salam dan perkenalan',
        },
      ],
    });
    expect(result.items.map((item) => item.title)).toEqual([
      'Understand greetings',
      'Practice introductions',
    ]);
    expect(result.items[1]).toMatchObject({
      order: 2,
      description: 'Introduce yourself in three short sentences.',
      focus: 'practice',
      type: 'practice',
      activityRomanized: 'practice romanized',
      titleRomanized: 'practice title romanized',
      descriptionRomanized: 'practice description romanized',
      requiredTime: 12,
      topicScope: 'self-introduction',
      topicScopeRomanized: 'self-introduction romanized',
      target: ['simple present tense'],
      progress: 20,
      translations: [
        {
          id: 'lp-7f9a1c2d3e4b5a60-step-2-bi',
          language: 'bahasa indonesia',
          activity: 'latihan',
          title: 'Latihan perkenalan',
          description: 'Perkenalkan dirimu dalam tiga kalimat pendek.',
          topicScope: 'perkenalan diri',
        },
      ],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/learning/generate'),
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

  it('throws backend message when learning generate returns an error payload', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'invalid request body' }),
    });

    await expect(
      generateLearningPath(
        {
          item_id: 'mod-eng-ix-01-01',
          module_title: 'Introducing Yourself',
        },
        { level: 'A1' },
      ),
    ).rejects.toThrow('invalid request body');
  });

  it('posts learning path step id when starting a learning chat session', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          type: 'chat',
          reply: 'Read this paragraph, then answer the first question.',
          paragraph: 'This is a short listening paragraph.',
          question_number: 1,
          assessment: {
            score: 82,
            summary: 'string',
            strengths: ['string'],
            areas: ['string'],
          },
          listening_state: {
            phase: 'asking',
            material_type: 'listening',
            paragraph: 'This is a short listening paragraph.',
            questions_asked: 1,
            answers: [],
          },
        },
      }),
    });
    global.fetch = fetchMock;

    const result = await startLearningChat({
      moduleId: 'mod-eng-ix-01-01',
      level: 'A1',
      currentStep: 1,
      learningPath: {
        language: 'english',
        moduleId: 'mod-eng-ix-01-01',
        level: 'A1',
        summary: 'Greetings and introductions',
        topicScope: 'Greetings and introductions',
        totalSteps: 1,
        items: [
          {
            id: 'lp-7f9a1c2d3e4b5a60-step-1',
            order: 1,
            title: 'Understand greetings',
            instruction: 'Read common greetings and when to use them.',
            description: 'Read common greetings and when to use them.',
            objective: 'Read common greetings and when to use them.',
            focus: 'explanation',
            type: 'explanation',
            activity: 'explanation',
            requiredTime: 10,
            topicScope: 'greetings',
            target: ['subject pronouns'],
            progress: 0,
          },
        ],
      },
    });

    expect(result).toMatchObject({
      type: 'chat',
      reply: 'Read this paragraph, then answer the first question.',
      paragraph: 'This is a short listening paragraph.',
      question_number: 1,
    });
    expect(fetchMock).toHaveBeenCalledWith(new URL('https://api.example.com/api/learning/start'), {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify({
        learning_path_step_id: 'lp-7f9a1c2d3e4b5a60-step-1',
      }),
    });
  });

  it('prefers an explicit learning path step id when starting a learning chat session', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          type: 'chat',
          reply: 'Let us begin.',
          question_number: 1,
        },
      }),
    });
    global.fetch = fetchMock;

    await startLearningChat({
      moduleId: 'mod-eng-ix-01-01',
      level: 'A1',
      currentStep: 1,
      learningPathStepId: 'lp-original-step-1',
      learningPath: {
        language: 'english',
        moduleId: 'mod-eng-ix-01-01',
        level: 'A1',
        summary: 'Greetings and introductions',
        items: [
          {
            id: 'lp-regenerated-step-1',
            order: 1,
            title: 'Understand greetings',
            description: 'Read common greetings and when to use them.',
            objective: 'Read common greetings and when to use them.',
            focus: 'explanation',
          },
        ],
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(new URL('https://api.example.com/api/learning/start'), {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify({
        learning_path_step_id: 'lp-original-step-1',
      }),
    });
  });

  it('throws backend message when learning start chat returns an error payload', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'invalid request body' }),
    });

    await expect(
      startLearningChat({
        moduleId: 'mod-eng-ix-01-01',
        level: 'A1',
        currentStep: 1,
        learningPath: {
          language: 'english',
          moduleId: 'mod-eng-ix-01-01',
          level: 'A1',
          summary: 'Greetings and introductions',
          items: [
            {
              id: 'lp-7f9a1c2d3e4b5a60-step-1',
              order: 1,
              title: 'Understand greetings',
              description: 'Read common greetings and when to use them.',
              objective: 'Read common greetings and when to use them.',
              focus: 'explanation',
            },
          ],
        },
      }),
    ).rejects.toThrow('invalid request body');
  });
});
