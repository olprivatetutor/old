import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout berhasil' }, { status: 200 });
  response.cookies.delete('auth-token');
  response.cookies.delete('refresh-token');
  return response;
}
