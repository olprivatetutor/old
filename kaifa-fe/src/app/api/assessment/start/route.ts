import { NextResponse } from 'next/server';
import type { StartAssessmentParams } from '@/features/assessment/types/assessment.types';
import { startAssessment } from '@/features/assessment/services/assessment.service';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<StartAssessmentParams> | null;

  if (!body?.moduleId) {
    return NextResponse.json({ message: 'Module tidak valid' }, { status: 400 });
  }

  try {
    const assessment = await startAssessment({ moduleId: body.moduleId });
    return NextResponse.json({ success: true, data: assessment });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Gagal memulai assessment' },
      { status: 500 },
    );
  }
}
