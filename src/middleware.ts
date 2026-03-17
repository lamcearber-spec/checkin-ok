import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/history', '/settings'];
const authPaths = ['/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token');
  const localeCookie = request.cookies.get('NEXT_LOCALE');

  // Locale detection (preserve existing behavior)
  if (!localeCookie) {
    const acceptLang = request.headers.get('accept-language') || '';
    let detectedLocale = 'en';
    if (acceptLang.includes('nl')) detectedLocale = 'nl';
    else if (acceptLang.includes('fr')) detectedLocale = 'fr';
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', detectedLocale, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    if (protectedPaths.some(p => pathname.startsWith(p)) && !token) return NextResponse.redirect(new URL('/auth', request.url));
    if (authPaths.some(p => pathname === p) && token) return NextResponse.redirect(new URL('/', request.url));
    return response;
  }

  if (protectedPaths.some(p => pathname.startsWith(p)) && !token) return NextResponse.redirect(new URL('/auth', request.url));
  if (authPaths.some(p => pathname === p) && token) return NextResponse.redirect(new URL('/', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|.*\..*).*)'],
};
