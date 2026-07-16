import { getSyllabus, getSyllabusModules } from '../syllabus.service';

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: jest.fn(() => ({ value: 'access-token' })),
  })),
}));

describe('getSyllabus', () => {
  const originalApiUrl = process.env.SYLLABUS_API_URL;
  const originalPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl) {
      process.env.SYLLABUS_API_URL = originalApiUrl;
    } else {
      delete process.env.SYLLABUS_API_URL;
    }
    if (originalPublicApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalPublicApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  it('returns hardcoded Grade 9 English syllabus while API is unavailable', async () => {
    delete process.env.SYLLABUS_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    const result = await getSyllabus({ language: 'english' });

    expect(result?.grade).toBe(9);
    expect(result?.subject).toBe('English');
    expect(result?.language).toBe('english');
    expect(result?.units).toHaveLength(8);
  });

  it('returns null when hardcoded syllabus is unavailable', async () => {
    delete process.env.SYLLABUS_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    await expect(getSyllabus({ language: 'arabic' })).resolves.toBeNull();
  });

  it('uses backend API when SYLLABUS_API_URL is configured', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'syl-eng-ix-01',
            language: 'english',
            title: 'Unit 1 - Personal Identity & Social Interaction',
            description: 'Kelas IX SMP Islam (CEFR A2 to B1)',
            title_romanized: 'As-salamu alaykum',
            description_romanized: 'At-tahiyyat wa at-taaruf',
            class: 'IX',
            level: ['A2', 'B1'],
            icon: '👋',
            translations: [
              {
                id: 'syl-eng-ix-01-bi',
                syllabi_id: 'syl-eng-ix-01',
                language: 'bahasa indonesia',
                title: 'Unit 1 - Identitas Pribadi & Interaksi Sosial',
                description: 'Kelas IX SMP Islam',
              },
            ],
            modules: [
              {
                id: 'mod-eng-ix-01-01',
                syllabus_id: 'syl-eng-ix-01',
                language: 'english',
                title: 'Introducing Yourself',
                description: 'string',
                topic_scope:
                  'Greetings & Islamic Etiquette, Personal Information, Talking About Yourself',
                status: 'available',
                order: 1,
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: 'mod-eng-ix-01-01',
              syllabus_id: 'syl-eng-ix-01',
              language: 'english',
              title: 'Introducing Yourself',
              description: 'string',
              topic_scope:
                'Greetings & Islamic Etiquette, Personal Information, Talking About Yourself',
              translations: [
                {
                  id: 'mod-eng-ix-01-01-bi',
                  module_id: 'mod-eng-ix-01-01',
                  language: 'bahasa indonesia',
                  title: 'Memperkenalkan Diri',
                  description: 'Materi pengenalan diri',
                  topic_scope: 'Salam, Informasi pribadi',
                  activities: ['mendengarkan', 'berbicara'],
                  grammar_focus: ['kata ganti subjek'],
                  topic_scope_terms: ['kelas', 'keluarga'],
                },
              ],
              status: 'available',
              order: 1,
            },
          ],
        }),
      });
    global.fetch = fetchMock;

    const result = await getSyllabus({ language: 'english' });

    expect(result).toMatchObject({
      id: 'syl-eng-ix-01',
      subject: 'English',
      language: 'english',
      cefr: 'A2-B1',
      translations: [
        {
          id: 'syl-eng-ix-01-bi',
          language: 'bahasa indonesia',
          title: 'Unit 1 - Identitas Pribadi & Interaksi Sosial',
          description: 'Kelas IX SMP Islam',
        },
      ],
      units: [
        {
          unit_id: 'syl-eng-ix-01',
          unit_title: 'Unit 1 - Personal Identity & Social Interaction',
          translations: [
            {
              id: 'syl-eng-ix-01-bi',
              language: 'bahasa indonesia',
              title: 'Unit 1 - Identitas Pribadi & Interaksi Sosial',
              description: 'Kelas IX SMP Islam',
            },
          ],
          items: [
            {
              item_id: 'mod-eng-ix-01-01',
              module_title: 'Introducing Yourself',
              translations: [
                {
                  id: 'mod-eng-ix-01-01-bi',
                  language: 'bahasa indonesia',
                  title: 'Memperkenalkan Diri',
                  description: 'Materi pengenalan diri',
                  topic_scope: 'Salam, Informasi pribadi',
                  activities: ['mendengarkan', 'berbicara'],
                  grammar_focus: ['kata ganti subjek'],
                  topic_scope_terms: ['kelas', 'keluarga'],
                },
              ],
              topics: [
                'Greetings & Islamic Etiquette',
                'Personal Information',
                'Talking About Yourself',
              ],
            },
          ],
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/syllabi?language=english'),
      { cache: 'no-store', headers: { Authorization: 'Bearer access-token' } },
    );
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/syllabi/syl-eng-ix-01/modules'),
      { cache: 'no-store', headers: { Authorization: 'Bearer access-token' } },
    );
  });

  it('throws backend message when API returns an error payload', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'invalid request body' }),
    });

    await expect(getSyllabus({ language: 'english' })).rejects.toThrow('invalid request body');
  });

  it('falls back to local syllabus when API fetch fails', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockRejectedValueOnce(new TypeError('fetch failed')) as typeof fetch;

    const result = await getSyllabus({ language: 'english' });

    expect(result).toMatchObject({
      id: 'syllabus-kelas-9',
      language: 'english',
      units: expect.any(Array),
    });
  });

  it('handles API payload without level or modules', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'syl-eng-ix-01',
            language: 'english',
            title: 'Unit 1 - Personal Identity & Social Interaction',
            class: 'IX',
            icon: '👋',
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

    const result = await getSyllabus({ language: 'english' });

    expect(result).toMatchObject({
      cefr: '-',
      grade: 9,
      level: 'Level belum tersedia',
      units: [
        {
          items: [],
        },
      ],
    });
  });

  it('creates stable fallback ids when API omits ids', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            language: 'english',
            title: 'Personal Identity',
            modules: [{ title: 'Introducing Yourself', order: 1 }],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

    const result = await getSyllabus({ language: 'english' });

    expect(result?.id).toBe('syllabus-english-personal-identity');
    expect(result?.units[0]?.unit_id).toBe('syllabus-english-personal-identity');
    expect(result?.units[0]?.items[0]?.item_id).toBe(
      'syllabus-english-personal-identity-module-1-introducing-yourself',
    );
  });

  it('normalizes wrapped syllabus and module payloads', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            syllabus: {
              syllabus_id: 'syl-eng-ix-01',
              language: 'english',
              syllabus_title: 'Unit 1 - Personal Identity & Social Interaction',
              desc: 'Kelas IX SMP Islam (CEFR A2 to B1)',
              grade: 'IX',
              cefr: ['A2', 'B1'],
            },
            modules: [
              {
                module_id: 'mod-eng-ix-01-01',
                module_title: 'Introducing Yourself',
                topics: ['Greetings & Islamic Etiquette', 'Personal Information'],
                status: 'available',
                order: '1',
              },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

    const result = await getSyllabus({ language: 'english' });

    expect(result).toMatchObject({
      id: 'syl-eng-ix-01',
      grade: 9,
      cefr: 'A2-B1',
      level: 'Kelas IX SMP Islam (CEFR A2 to B1)',
      units: [
        {
          unit_title: 'Unit 1 - Personal Identity & Social Interaction',
          items: [
            {
              item_id: 'mod-eng-ix-01-01',
              module_title: 'Introducing Yourself',
              topics: ['Greetings & Islamic Etiquette', 'Personal Information'],
              order: 1,
            },
          ],
        },
      ],
    });
  });

  it('normalizes multiple API syllabi as separate units', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: 'syl-eng-ix-01',
            language: 'english',
            title: 'Unit 1 - Personal Identity',
            class: 'IX',
            level: ['A2', 'B1'],
            modules: [{ id: 'mod-1', title: 'Introducing Yourself', status: 'available' }],
          },
          {
            id: 'syl-eng-ix-02',
            language: 'english',
            title: 'Unit 2 - School Life',
            class: 'IX',
            level: ['A2', 'B1'],
            modules: [{ id: 'mod-2', title: 'School Environment', status: 'available' }],
          },
          {
            id: 'syl-eng-ix-03',
            language: 'english',
            title: 'Unit 3 - Daily Life',
            class: 'IX',
            level: ['A2', 'B1'],
            modules: [{ id: 'mod-3', title: 'Daily Activities', status: 'available' }],
          },
        ],
      }),
    });
    global.fetch = fetchMock;

    const result = await getSyllabus({ language: 'english' });

    expect(result?.units).toEqual([
      {
        unit_id: 'syl-eng-ix-01',
        unit_title: 'Unit 1 - Personal Identity',
        items: [
          {
            item_id: 'mod-1',
            module_title: 'Introducing Yourself',
            status: 'available',
            topics: [],
          },
        ],
      },
      {
        unit_id: 'syl-eng-ix-02',
        unit_title: 'Unit 2 - School Life',
        items: [
          {
            item_id: 'mod-2',
            module_title: 'School Environment',
            status: 'available',
            topics: [],
          },
        ],
      },
      {
        unit_id: 'syl-eng-ix-03',
        unit_title: 'Unit 3 - Daily Life',
        items: [
          {
            item_id: 'mod-3',
            module_title: 'Daily Activities',
            status: 'available',
            topics: [],
          },
        ],
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('selects syllabi that match the requested language when API returns mixed languages', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: 'syl-eng-ix-01',
            language: 'english',
            title: 'English Unit',
            class: 'IX',
            modules: [{ id: 'mod-eng-1', title: 'English Module', status: 'available' }],
          },
          {
            id: 'syl-ar-ix-01',
            language: 'arabic',
            title: 'Arabic Unit',
            class: 'IX',
            modules: [{ id: 'mod-ar-1', title: 'Arabic Module', status: 'available' }],
          },
        ],
      }),
    });

    const result = await getSyllabus({ language: 'arabic' });

    expect(result).toMatchObject({
      id: 'syl-ar-ix-01',
      subject: 'Arabic',
      language: 'arabic',
      units: [
        {
          unit_id: 'syl-ar-ix-01',
          unit_title: 'Arabic Unit',
          items: [
            {
              item_id: 'mod-ar-1',
              module_title: 'Arabic Module',
            },
          ],
        },
      ],
    });
  });

  it('fetches modules from syllabus modules endpoint', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: 'mod-eng-ix-01-01',
            syllabus_id: 'syl-eng-ix-01',
            language: 'english',
            title: 'Introducing Yourself',
            description: 'string',
            topic_scope:
              'Greetings & Islamic Etiquette, Personal Information, Talking About Yourself, Introducing Friends, Assessment',
            activities: ['listening', 'speaking', 'ask questions'],
            vocabulary_load: 40,
            grammar_focus: ['subject pronouns', 'simple present tense'],
            topic_scope_terms: ['classroom', 'family', 'greeting'],
            estimation_duration_minutes: 30,
            mastery_threshold: 80,
            status: 'available',
            order: 1,
          },
        ],
      }),
    });
    global.fetch = fetchMock;

    const result = await getSyllabusModules({
      syllabusId: 'syl-eng-ix-01',
      language: 'english',
    });

    expect(result).toEqual([
      {
        item_id: 'mod-eng-ix-01-01',
        module_title: 'Introducing Yourself',
        activities: ['listening', 'speaking', 'ask questions'],
        description: 'string',
        estimation_duration_minutes: 30,
        grammar_focus: ['subject pronouns', 'simple present tense'],
        mastery_threshold: 80,
        topics: [
          'Greetings & Islamic Etiquette',
          'Personal Information',
          'Talking About Yourself',
          'Introducing Friends',
          'Assessment',
        ],
        topic_scope_terms: ['classroom', 'family', 'greeting'],
        vocabulary_load: 40,
        status: 'available',
        order: 1,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/api/syllabi/syl-eng-ix-01/modules'),
      { cache: 'no-store', headers: { Authorization: 'Bearer access-token' } },
    );
  });

  it('throws backend message when modules endpoint returns an error payload', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'invalid request body' }),
    });

    await expect(
      getSyllabusModules({ syllabusId: 'syl-eng-ix-01', language: 'english' }),
    ).rejects.toThrow('invalid request body');
  });

  it('falls back to local modules when modules endpoint fetch fails', async () => {
    process.env.SYLLABUS_API_URL = 'https://api.example.com/api';
    global.fetch = jest.fn().mockRejectedValueOnce(new TypeError('fetch failed')) as typeof fetch;

    const result = await getSyllabusModules({
      syllabusId: 'unit-9-1',
      language: 'english',
    });

    expect(result.map((module) => module.item_id)).toEqual(['modul-9-1-1', 'modul-9-1-2']);
  });
});
