import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const cleanPass = (password || '').trim();
    const serviceRoleKey = process.env.SUPABASE_KEY || '';

    // Check if login password is the Service Role Key or matches the env admin config
    const isServiceRoleKey = cleanPass === serviceRoleKey && serviceRoleKey.length > 0;
    const isLocalAdmin = email === process.env.ADMIN_USERNAME && cleanPass === process.env.ADMIN_PASSWORD;

    if (isServiceRoleKey || isLocalAdmin) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session_token', serviceRoleKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7200 // 2 hours
      });
      return response;
    }

    // Fallback to Supabase Auth email/password check
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear local admin session token
    response.cookies.set('admin_session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0
    });

    // Also call signOut in Supabase for standard sessions
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}

    return response;
  } catch (e) {
    return NextResponse.json({ error: "Gagal logout: " + e.message }, { status: 500 });
  }
}
