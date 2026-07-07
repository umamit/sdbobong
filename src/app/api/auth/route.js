import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { createAdminToken } from '../../../lib/auth';
import { loadWebConfig, saveWebConfig } from '../../../lib/database';
import { createAuditLog, getClientIp } from '../../../lib/audit';
import { adminAuthSchema, parseBody } from '../../../lib/validators';

export async function POST(request) {
  try {
    const parsed = await parseBody(request, adminAuthSchema);
    if (!parsed.success) return parsed.error;
    const { email, password } = parsed.data;

    const cleanPass = password.trim();
    const serviceRoleKey = process.env.SUPABASE_KEY || '';

    // Track login IP
    const ip = getClientIp(request);

    // Load web configuration
    const config = await loadWebConfig();
    if (!config.suspicious_attempts) config.suspicious_attempts = [];

    // 1. Check if IP is in the manual blacklist
    if (config.manual_blacklist && Array.isArray(config.manual_blacklist)) {
      const blacklistRecord = config.manual_blacklist.find(b => b.ip === ip);
      if (blacklistRecord) {
        // Log blocked access attempt
        await createAuditLog(
          'SECURITY_BLACKLIST_BYPASS_ATTEMPT',
          `IP daftar hitam ${ip} mencoba masuk. Alasan blokir: ${blacklistRecord.reason || 'Tanpa alasan'}.`,
          request
        );
        return NextResponse.json({
          error: `Akses ditolak. IP Anda (${ip}) telah diblokir secara permanen oleh administrator. Alasan: ${blacklistRecord.reason || 'Pelanggaran keamanan'}.`
        }, { status: 403 });
      }
    }

    // 2. Load dynamic security settings
    const maxAttempts = (config.security_settings && typeof config.security_settings.max_attempts === 'number')
      ? config.security_settings.max_attempts
      : 5;
    const blockDurationMin = (config.security_settings && typeof config.security_settings.block_duration_min === 'number')
      ? config.security_settings.block_duration_min
      : 5;
    const blockDuration = blockDurationMin * 60 * 1000; // in milliseconds

    // Check if IP is currently blocked (attempts >= maxAttempts)
    let ipRecord = config.suspicious_attempts.find(a => a.ip === ip && a.resolved !== true);
    if (ipRecord && ipRecord.attempts >= maxAttempts) {
      const timeElapsed = Date.now() - new Date(ipRecord.lastAttempt || ipRecord.timestamp).getTime();
      
      if (timeElapsed < blockDuration) {
        const remainingTimeSec = Math.ceil((blockDuration - timeElapsed) / 1000);
        
        // Log block check bypass attempt
        await createAuditLog(
          'SECURITY_BLOCK_BYPASS_ATTEMPT',
          `IP terblokir sementara ${ip} mencoba masuk kembali (tersisa ${remainingTimeSec} detik).`,
          request
        );

        return NextResponse.json({ 
          error: `IP Anda (${ip}) diblokir sementara demi keamanan selama ${remainingTimeSec} detik karena mendeteksi ${maxAttempts}+ kegagalan login berturut-turut.` 
        }, { status: 429 });
      } else {
        // Exceeded block duration, reset counter and resolved status
        ipRecord.attempts = 0;
        ipRecord.resolved = true;
        await saveWebConfig(config);
      }
    }

    // Check if login password is the Service Role Key or matches the env admin config
    const isServiceRoleKey = cleanPass === serviceRoleKey && serviceRoleKey.length > 0;
    const isLocalAdmin = email === process.env.ADMIN_USERNAME && cleanPass === process.env.ADMIN_PASSWORD;

    if (isServiceRoleKey || isLocalAdmin) {
      const response = NextResponse.json({ success: true });
      const secureToken = await createAdminToken();
      response.cookies.set('admin_session_token', secureToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600 // 1 hour
      });

      // Successful local admin log
      await createAuditLog('LOGIN', `Admin berhasil login (Metode: Lokal / Env)`, request);

      // Reset block status on successful login
      if (ipRecord) {
        ipRecord.attempts = 0;
        ipRecord.resolved = true;
        await saveWebConfig(config);
      }

      return response;
    }

    // Fallback to Supabase Auth email/password check
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Login failed logic
      if (!ipRecord) {
        ipRecord = {
          id: `suspicious-${Date.now()}`,
          ip,
          timestamp: new Date().toISOString(),
          lastAttempt: new Date().toISOString(),
          attempts: 1,
          userAgent: request.headers.get('user-agent') || 'Unknown Device',
          resolved: false
        };
        config.suspicious_attempts.push(ipRecord);
      } else {
        ipRecord.attempts = (ipRecord.attempts || 0) + 1;
        ipRecord.lastAttempt = new Date().toISOString();
        ipRecord.userAgent = request.headers.get('user-agent') || 'Unknown Device';
        ipRecord.resolved = false;
      }

      // Log status level based on attempts count
      if (ipRecord.attempts >= maxAttempts) {
        await createAuditLog(
          'SECURITY_IP_BLOCKED', 
          `IP ${ip} telah DIBLOKIR sementara (${blockDurationMin} menit) setelah gagal masuk ${ipRecord.attempts} kali.`, 
          request
        );
      } else if (ipRecord.attempts >= 3) {
        await createAuditLog(
          'SUSPICIOUS_LOGIN_ATTEMPT', 
          `Percobaan masuk mencurigakan (${ipRecord.attempts} kali gagal berturut-turut) dari IP ${ip}`, 
          request
        );
      } else {
        await createAuditLog(
          'FAILED_LOGIN', 
          `Gagal melakukan login admin menggunakan email: ${email || 'Tanpa Email'} (${ipRecord.attempts} kali gagal)`, 
          request
        );
      }

      await saveWebConfig(config);

      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Successful Supabase login
    const response = NextResponse.json({ success: true });
    
    // Set local admin session token cookie for unified API auth access
    const secureToken = await createAdminToken();
    response.cookies.set('admin_session_token', secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 // 1 hour
    });

    
    await createAuditLog('LOGIN', `Admin berhasil login (Metode: Supabase Auth - ${email})`, request);

    // Reset block status on successful login
    if (ipRecord) {
      ipRecord.attempts = 0;
      ipRecord.resolved = true;
      await saveWebConfig(config);
    }

    return response;
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear local admin session token
    response.cookies.set('admin_session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0
    });

    // Write audit log for manual logout
    await createAuditLog('LOGOUT', `Admin keluar dari sistem (Sesi diakhiri secara manual)`, request);

    // Also call signOut in Supabase for standard sessions
    try {
      const supabase = createClient();
      await supabase.signOut();
    } catch (e) {}

    return response;
  } catch (e) {
    return NextResponse.json({ error: "Gagal logout: " + e.message }, { status: 500 });
  }
}
