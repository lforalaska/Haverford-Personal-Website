import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for login page
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.next();
  }

  // Protect all /admin/* routes except login
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated(request)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
