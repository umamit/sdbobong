import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '../../../../lib/supabase/server';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_token')?.value;
    const isLocalAdminSession = await verifyAdminToken(token);

    // Get current user in Supabase (if any)
    let supabaseUser = null;
    let supabase = null;
    try {
      supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      supabaseUser = user;
    } catch (e) {}

    // Must be either local admin session or Supabase admin user
    if (!isLocalAdminSession && !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Password saat ini dan password baru wajib diisi!' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal harus 6 karakter!' }, { status: 400 });
    }

    // 1. Case: Local Admin Session (using ADMIN_PASSWORD in .env)
    if (isLocalAdminSession) {
      const expectedOldPassword = process.env.ADMIN_PASSWORD || 'sdnbobong2026';
      
      if (currentPassword !== expectedOldPassword) {
        return NextResponse.json({ error: 'Password saat ini salah!' }, { status: 400 });
      }

      // We need to update .env file
      try {
        const envPath = path.join(process.cwd(), '.env');
        let envContent = '';
        try {
          envContent = await fs.readFile(envPath, 'utf-8');
        } catch (readErr) {
          // Fallback to reading env.example or just create .env if it doesn't exist
          envContent = '';
        }

        let updatedEnvContent = '';
        const passwordRegex = /^ADMIN_PASSWORD=.*$/m;

        if (passwordRegex.test(envContent)) {
          // Replace existing key
          updatedEnvContent = envContent.replace(passwordRegex, `ADMIN_PASSWORD=${newPassword}`);
        } else {
          // Append new key
          updatedEnvContent = envContent + `\nADMIN_PASSWORD=${newPassword}\n`;
        }

        await fs.writeFile(envPath, updatedEnvContent, 'utf-8');
        
        // Also dynamically update current process.env value so that the current running process uses the new password immediately
        process.env.ADMIN_PASSWORD = newPassword;

        return NextResponse.json({ success: true, message: 'Password admin lokal berhasil diperbarui!' });
      } catch (err) {
        return NextResponse.json({ error: 'Gagal memperbarui file konfigurasi di server: ' + err.message }, { status: 500 });
      }
    }

    // 2. Case: Supabase Auth Session
    if (supabaseUser) {
      const email = supabaseUser.email;
      
      // Re-authenticate user to confirm current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword
      });

      if (signInError) {
        return NextResponse.json({ error: 'Password saat ini salah!' }, { status: 400 });
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        return NextResponse.json({ error: 'Gagal memperbarui password di Supabase: ' + updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Password admin Supabase berhasil diperbarui!' });
    }

    return NextResponse.json({ error: 'Terjadi kesalahan pemrosesan.' }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + err.message }, { status: 500 });
  }
}
