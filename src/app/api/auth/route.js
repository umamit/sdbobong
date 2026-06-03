import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encrypt } from '../../../lib/session';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'sdnbobong2026';

    if (username === adminUser && password === adminPass) {
      // Create session payload
      const sessionToken = await encrypt({ admin: true });

      // Set session cookie
      cookies().set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 2 // 2 hours
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Username atau password salah!" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    cookies().set('admin_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal logout: " + e.message }, { status: 500 });
  }
}
