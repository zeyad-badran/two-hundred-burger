import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // --- SITE PAUSE TOGGLE ---
  // Change to true to completely block all visitors and take the live site offline.
  const isPaused = false;
  if (isPaused) {
    return new NextResponse(
      '<html><head><title>Paused</title><style>body { background: #111; color: #fff; font-family: sans-serif; display: flex; height: 100vh; margin: 0; align-items: center; justify-content: center; text-align: center; padding: 20px; }</style></head><body><div><h1>Website Paused</h1><p>We are currently closed for updates. Check back soon!</p></div></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    );
  }

  const response = NextResponse.next();

  // Apply Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");

  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'private, no-store');
  }

  return response;
}

// Optionally filter which paths this runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
