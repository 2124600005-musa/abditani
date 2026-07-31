import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
