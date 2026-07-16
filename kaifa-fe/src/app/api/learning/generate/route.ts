import { NextResponse } from 'next/server';
import { generateLearningPath } from '@/features/learning/services/learning-path.service';
import type { SyllabusModule } from '@/features/syllabus/types/syllabus.types';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    level?: string;
    module?: SyllabusModule;
  } | null;

  if (!body?.module?.item_id) {
    return NextResponse.json({ message: 'Module tidak valid' }, { status: 400 });
  }

  try {
    const learningPath = await generateLearningPath(
      body.module,
      body.level ? { level: body.level } : {},
    );
    return NextResponse.json({ success: true, data: learningPath });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Gagal membuat learning path' },
      { status: 500 },
    );
  }
}
