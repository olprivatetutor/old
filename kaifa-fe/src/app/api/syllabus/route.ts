import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSyllabus } from '@/features/syllabus/services/syllabus.service';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';

function getLanguage(value: string | null): SyllabusLanguage | null {
  return value === 'english' || value === 'arabic' ? value : null;
}

export async function GET(request: NextRequest) {
  const language = getLanguage(request.nextUrl.searchParams.get('language'));

  if (!language) {
    return NextResponse.json({ message: 'Language tidak valid' }, { status: 400 });
  }

  try {
    const catalog = await getSyllabus({ language });
    return NextResponse.json({ success: true, data: catalog });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Gagal mengambil data silabus' },
      { status: 500 },
    );
  }
}
