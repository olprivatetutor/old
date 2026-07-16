import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { User } from '@/features/auth/types/auth.types';

const MOCK_USERS: (User & { tokenId: string })[] = [
  {
    id: '1',
    email: 'demo@kaifa.id',
    name: 'Demo User',
    role: 'student',
    tokenId: 'mock-token-1',
  },
  {
    id: '2',
    email: 'teacher@kaifa.id',
    name: 'Demo Teacher',
    role: 'teacher',
    tokenId: 'mock-token-2',
  },
];

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const found = MOCK_USERS.find((u) => u.tokenId === token);

  if (!found) {
    return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });
  }

  const { tokenId: _tokenId, ...user } = found;
  return NextResponse.json(user, { status: 200 });
}
