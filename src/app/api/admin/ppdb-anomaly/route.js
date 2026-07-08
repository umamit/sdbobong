import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadMessages } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

/**
 * Detect PPDB anomalies via programmatic rules + optional Groq AI layer.
 * POST body: { records: PPDB[] }
 */
export async function POST(req) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { records } = await req.json();
    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ anomalies: [] });
    }

    // --- Step 1: Programmatic rule-based detection (always runs) ---
    const flagged = [];
    const REGISTRATION_YEAR = 2026;

    for (const r of records) {
      const issues = [];

      // --- Rule 1: Age check (should be 6-9 years old entering SD) ---
      if (r.tanggal_lahir) {
        try {
          const dob = new Date(r.tanggal_lahir);
          const julyStart = new Date(`${REGISTRATION_YEAR}-07-01`);
          const ageInMonths = (julyStart - dob) / (1000 * 60 * 60 * 24 * 30.44);
          const ageYears = ageInMonths / 12;
          if (ageYears < 5.5) {
            issues.push({ type: 'USIA_TERLALU_MUDA', label: '⚠️ Usia terlalu muda', detail: `Usia ~${Math.floor(ageYears)} tahun, di bawah syarat minimal 5,5 tahun.` });
          } else if (ageYears > 9.5) {
            issues.push({ type: 'USIA_TERLALU_TUA', label: '⚠️ Usia di atas batas', detail: `Usia ~${Math.floor(ageYears)} tahun, melebihi batas umum 9 tahun.` });
          }
        } catch (_) { /* skip invalid date */ }
      }

      // --- Rule 2: NIK must be exactly 16 digits ---
      const nik = r.nik_siswa || r.nik || '';
      if (nik && !/^\d{16}$/.test(nik.trim())) {
        issues.push({ type: 'NIK_INVALID', label: '🔴 Format NIK tidak valid', detail: `NIK "${nik}" bukan 16 digit angka.` });
      }

      // --- Rule 3: Phone number format ---
      const hp = r.nomor_hp_orangtua || r.no_hp || '';
      if (hp && !/^(\+62|08)\d{7,13}$/.test(hp.trim().replace(/[\s-]/g, ''))) {
        issues.push({ type: 'HP_INVALID', label: '📵 Format HP tidak valid', detail: `Nomor HP "${hp}" tidak diawali 08 atau +62.` });
      }

      // --- Rule 4: Suspicious or garbage name ---
      const nama = (r.nama_lengkap || '').trim();
      if (nama.length < 3) {
        issues.push({ type: 'NAMA_TERLALU_PENDEK', label: '⚠️ Nama terlalu pendek', detail: `Nama "${nama}" kurang dari 3 karakter.` });
      } else if (/^(test|asdf|xxxx|aaaa|[^a-zA-Z\s.'-]+)$/i.test(nama)) {
        issues.push({ type: 'NAMA_MENCURIGAKAN', label: '🚩 Nama mencurigakan', detail: `Nama "${nama}" terindikasi data palsu atau uji coba.` });
      }

      if (issues.length > 0) {
        flagged.push({
          id: r.id,
          nama_lengkap: r.nama_lengkap || '-',
          nik: nik || '-',
          tanggal_lahir: r.tanggal_lahir || '-',
          status: r.status || '-',
          issues
        });
      }
    }

    // --- Step 2: Duplicate detection (same nama_ibu or same NIK across records) ---
    const nikMap = {};
    const ibuMap = {};
    for (const r of records) {
      const nik = (r.nik_siswa || r.nik || '').trim();
      const namaIbu = (r.nama_ibu_kandung || r.nama_ibu || '').trim().toLowerCase();

      if (nik && nik.length === 16) {
        if (nikMap[nik]) {
          // Duplicate NIK detected
          const existing = flagged.find(f => f.id === r.id);
          const issue = { type: 'DUPLIKAT_NIK', label: '🔴 NIK duplikat', detail: `NIK ini juga digunakan oleh pendaftar lain (${nikMap[nik]}).` };
          if (existing) {
            existing.issues.push(issue);
          } else {
            flagged.push({ id: r.id, nama_lengkap: r.nama_lengkap || '-', nik, tanggal_lahir: r.tanggal_lahir || '-', status: r.status || '-', issues: [issue] });
          }
        } else {
          nikMap[nik] = r.nama_lengkap || r.id;
        }
      }

      if (namaIbu && namaIbu.length > 3) {
        if (ibuMap[namaIbu]) {
          const existing = flagged.find(f => f.id === r.id);
          const issue = { type: 'DUPLIKAT_NAMA_IBU', label: '⚠️ Nama ibu duplikat', detail: `Nama ibu kandung sama dengan pendaftar lain (${ibuMap[namaIbu]}).` };
          if (existing) {
            // Avoid double-adding for same record
            if (!existing.issues.find(i => i.type === 'DUPLIKAT_NAMA_IBU')) {
              existing.issues.push(issue);
            }
          } else {
            flagged.push({ id: r.id, nama_lengkap: r.nama_lengkap || '-', nik: nik || '-', tanggal_lahir: r.tanggal_lahir || '-', status: r.status || '-', issues: [issue] });
          }
        } else {
          ibuMap[namaIbu] = r.nama_lengkap || r.id;
        }
      }
    }

    // --- Step 3: Optional AI layer for additional pattern detection ---
    const groqApiKey = process.env.GROQ_API_KEY;
    let aiSuggestions = [];

    if (groqApiKey && flagged.length > 0) {
      try {
        const preview = flagged.slice(0, 10).map(f => ({
          id: f.id,
          nama: f.nama_lengkap,
          nik: f.nik,
          masalah: f.issues.map(i => i.label).join(', ')
        }));

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `Kamu adalah analis data PPDB sekolah dasar. Berikan satu ringkasan singkat (max 2 kalimat) tentang pola anomali dari daftar berikut dan saran tindakan untuk panitia. Format JSON: { "summary": "ringkasan" }. Hanya JSON valid.`
              },
              {
                role: 'user',
                content: `Data anomali PPDB:\n${JSON.stringify(preview, null, 2)}`
              }
            ],
            temperature: 0.3,
            max_tokens: 200,
            response_format: { type: 'json_object' }
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const txt = groqData.choices?.[0]?.message?.content || '{}';
          const parsed = JSON.parse(txt);
          if (parsed.summary) aiSuggestions = [parsed.summary];
        }
      } catch (aiErr) {
        console.warn('AI anomaly layer skipped:', aiErr.message);
      }
    }

    return NextResponse.json({
      total_checked: records.length,
      total_flagged: flagged.length,
      anomalies: flagged,
      ai_summary: aiSuggestions
    });

  } catch (error) {
    console.error('⚠️ PPDB Anomaly error:', error.message);
    return NextResponse.json({ anomalies: [], total_checked: 0, total_flagged: 0, ai_summary: [] }, { status: 200 });
  }
}
