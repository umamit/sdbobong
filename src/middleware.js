import { NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Protect administrative dashboard routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const { user, response } = await updateSession(request);

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return response;
  }

  // Refresh session for non-guarded routes
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
