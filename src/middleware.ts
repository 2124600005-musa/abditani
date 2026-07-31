import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Simple in-memory rate limiter (per-instance, resets on cold start)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // max attempts per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Cleanup old entries every 5 minutes
let lastCleanup = 0;
function cleanupRateLimit() {
  const now = Date.now();
  if (now - lastCleanup < 300000) return;
  lastCleanup = now;
  for (const [key, val] of loginAttempts) {
    if (now > val.resetAt) loginAttempts.delete(key);
  }
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  // CSP - not too restrictive, allows inline styles/scripts needed by Next.js
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.vercel-blob.com https://*.public.blob.vercel-storage.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.vercel-blob.com https://*.public.blob.vercel-storage.com; frame-ancestors 'none';"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

  cleanupRateLimit();

  // Rate limit login attempts
  if (pathname === '/api/auth/login' && request.method === 'POST') {
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
        { status: 429 }
      );
    }
  }

  // Admin API routes need auth
  if (pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const admin = await verifyToken(token);
    if (!admin) return NextResponse.json({ error: 'Token invalid' }, { status: 401 });
  }

  // Admin pages need auth (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
    const admin = await verifyToken(token);
    if (!admin) {
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.delete('token');
      return res;
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/auth/login'],
};
