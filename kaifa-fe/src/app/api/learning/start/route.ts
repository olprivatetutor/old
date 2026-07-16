import { NextResponse } from 'next/server';
import { startLearningChat } from '@/features/learning/services/learning-path.service';
import type { StartLearningChatParams } from '@/features/learning/types/learning.types';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<StartLearningChatParams> | null;

  if (!body?.moduleId || !body.learningPath || !body.currentStep || !body.level) {
    return NextResponse.json({ message: 'Sesi belajar tidak valid' }, { status: 400 });
  }

  try {
    const params: StartLearningChatParams = {
      moduleId: body.moduleId,
      level: body.level,
      currentStep: body.currentStep,
      learningPath: body.learningPath,
      ...(body.learningPathStepId ? { learningPathStepId: body.learningPathStepId } : {}),
    };
    const session = await startLearningChat(params);
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Gagal membuka sesi belajar' },
      { status: 500 },
    );
  }
}
