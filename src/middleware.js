import { NextResponse } from 'next/server';
import { decrypt } from './lib/session';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Protect administrative dashboard routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session || !session.admin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
