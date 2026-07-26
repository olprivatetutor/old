import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if ((pathname === '/dashboard' || pathname.startsWith('/dashboard/')) && authToken) {
    return NextResponse.redirect(new URL('/languages', request.url));
  }

  if (pathname === '/login' && authToken) {
    return NextResponse.redirect(new URL('/languages', request.url));
  }

  if (!isPublicRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
