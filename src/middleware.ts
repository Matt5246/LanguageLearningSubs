import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appRoutes, authRoutes } from '@/lib/routes';

const matchesPath = (path: string, routes: string[]) => {
  return routes.some((route) => path.startsWith(route));
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('authjs.session-token')?.value;
  const isAuthenticated = !!token;

  if (isAuthenticated && matchesPath(pathname, authRoutes)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!isAuthenticated && matchesPath(pathname, appRoutes)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}
