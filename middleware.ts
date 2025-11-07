import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// STATIC DEMO MODE: Middleware auth checks disabled for UI testing
// This middleware normally protects routes but is bypassed for demo

export function middleware(request: NextRequest) {
  // In static demo mode, allow all requests through
  return NextResponse.next();
}

/* 
DISABLED FOR STATIC DEMO - To re-enable authentication middleware later:

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/chat', '/cart', '/orders', '/account'];

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
*/