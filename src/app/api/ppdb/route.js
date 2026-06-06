import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { PENDAFTARAN_JSON, loadLocalStatuses, supabase, isSupabaseEnabled } from '../../../lib/database';
import { verifyAdminToken } from '../../../lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_session_token')?.value;
    if (await verifyAdminToken(token)) {
      return true;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const isExport = searchParams.get('export') === 'true';

    let records = [];

    // Fetch records
    if (supabase) {
      try {
        const { data, error } = await supabase.from("ppdb_sdn_bobong").select("*").order("waktu_daftar", { ascending: false });
        if (error) throw error;
        if (data) records = data;
      } catch (e) {
        console.error("Error querying Supabase for API GET:", e);
      }
    }

    if (!records || records.length === 0) {
      if (fs.existsSync(PENDAFTARAN_JSON)) {
        try {
          const localData = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
          records = localData.map((r, idx) => ({
            id: r.id || r.nik || r.nik_siswa || String(idx + 1),
            nama_lengkap: r.nama_lengkap || "",
            nik_siswa: r.nik || r.nik_siswa || "",
            tempat_lahir: r.tempat_lahir || "",
            tanggal_lahir: r.tanggal_lahir || "",
            jenis_kelamin: r.jenis_kelamin || "",
            nama_ibu_kandung: r.nama_ibu || r.nama_ibu_kandung || "",
            nomor_hp_orangtua: r.no_hp || r.nomor_hp_orangtua || "",
            alamat_domisili: r.alamat || r.alamat_domisili || "",
            jalur_ppdb: r.jalur_ppdb || "",
            waktu_daftar: r.waktu_daftar || "",
            status: r.status || "Diterima Sistem"
          }));
          records.sort((a, b) => (b.waktu_daftar || "").localeCompare(a.waktu_daftar || ""));
        } catch (e) {
          console.error("Error reading JSON fallback for GET:", e);
        }
      }
    }

    const localStatuses = loadLocalStatuses();

    // Map the status and ensure NIK ID mapping matches
    records.forEach(r => {
      const r_id = r.id || r.nik_siswa || r.nik;
      r.id = r_id;

      const nik = r.nik_siswa || r.nik;
      let status = r.status;
      if (!status || status === "Diterima Sistem") {
        if (nik && localStatuses[String(nik)]) {
          status = localStatuses[String(nik)];
        }
      }
      if (!status) status = "Diterima Sistem";
      r.status = status;
    });

    if (isExport) {
      const headers = [
        "No", "Nama Lengkap", "NIK Siswa", "Tempat Lahir", "Tanggal Lahir",
        "Jenis Kelamin", "Nama Ibu Kandung", "Nomor HP Orang Tua", "Alamat Domisili",
        "Jalur PPDB", "Waktu Daftar", "Status"
      ];

      const csvLines = [headers.join(',')];

      records.forEach((r, idx) => {
        const row = [
          idx + 1,
          r.nama_lengkap || '',
          r.nik_siswa || r.nik || '',
          r.tempat_lahir || '',
          r.tanggal_lahir || '',
          r.jenis_kelamin || '',
          r.nama_ibu_kandung || '',
          r.nomor_hp_orangtua || '',
          r.alamat_domisili || '',
          r.jalur_ppdb || '',
          r.waktu_daftar || '',
          r.status || 'Diterima Sistem'
        ];
        csvLines.push(row.map(escapeCSV).join(','));
      });

      const csvContent = csvLines.join('\n');
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=ppdb_sdn_bobong_${dateStr}.csv`
        }
      });
    }

    return NextResponse.json(records);
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, nik, status: newStatus } = await request.json();

    if (!id || !newStatus) {
      return NextResponse.json({ error: "ID/NIK dan status wajib ditentukan." }, { status: 400 });
    }

    let updatedOk = false;

    // 1. Update local JSON
    if (fs.existsSync(PENDAFTARAN_JSON)) {
      try {
        const records = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
        let found = false;
        for (let idx = 0; idx < records.length; idx++) {
          const r = records[idx];
          const rId = r.id || r.nik || r.nik_siswa || String(idx + 1);
          const rNik = r.nik || r.nik_siswa;
          if (
            String(rId) === String(id) ||
            String(rNik) === String(nik) ||
            (nik && String(rNik) === String(nik)) ||
            (id && String(rNik) === String(id))
          ) {
            r.status = newStatus;
            found = true;
            break;
          }
        }
        if (found) {
          fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify(records, null, 4), 'utf-8');
          updatedOk = true;
        }
      } catch (e) {
        console.error("Error updating local JSON status:", e);
      }
    }

    // 2. Update Supabase
    const supabaseActive = isSupabaseEnabled();
    let supabaseUpdated = false;

    if (supabaseActive) {
      try {
        // Try updating by NIK first (since NIK is unique and stable)
        const targetNik = nik || id;
        if (targetNik && /^\d{16}$/.test(String(targetNik).trim())) {
          const { data, error } = await supabase.from("ppdb_sdn_bobong").update({ status: newStatus }).eq("nik_siswa", String(targetNik).trim()).select();
          if (error) throw error;
          if (data && data.length > 0) {
            supabaseUpdated = true;
          }
        }

        // Try updating by integer ID next if not updated yet
        if (!supabaseUpdated && id && /^\d+$/.test(String(id).trim())) {
          const { data, error } = await supabase.from("ppdb_sdn_bobong").update({ status: newStatus }).eq("id", parseInt(id, 10)).select();
          if (error) throw error;
          if (data && data.length > 0) {
            supabaseUpdated = true;
          }
        }
      } catch (e) {
        console.error("Error updating status in Supabase:", e);
        return NextResponse.json({ error: "Gagal menyinkronkan status ke Supabase: " + e.message }, { status: 500 });
      }
    }

    if (supabaseActive ? supabaseUpdated : updatedOk) {
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in ppdb PUT:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal memperbarui status pendaftaran di database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const nik = searchParams.get('nik');
    const clearAll = searchParams.get('all') === 'true';
    const scope = searchParams.get('scope') || 'both'; // 'both', 'local', 'supabase'

    if (clearAll) {
      let deletedOk = false;
      if (scope === 'both' || scope === 'local') {
        try {
          fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify([], null, 4), 'utf-8');
          deletedOk = true;
        } catch (e) {
          console.error("Error clearing local JSON:", e);
        }
      } else {
        deletedOk = true; // skipped local
      }

      const supabaseActive = isSupabaseEnabled();
      let supabaseDeleted = false;

      if (supabaseActive && (scope === 'both' || scope === 'supabase')) {
        try {
          const { error } = await supabase.from("ppdb_sdn_bobong").delete().neq("id", 0);
          if (error) throw error;
          supabaseDeleted = true;
        } catch (e) {
          console.error("Error clearing Supabase:", e);
          return NextResponse.json({ error: "Gagal menghapus data di Supabase: " + e.message }, { status: 500 });
        }
      } else {
        supabaseDeleted = true; // skipped supabase
      }

      if (deletedOk || supabaseDeleted) {
        try {
          revalidatePath('/', 'layout');
        } catch (cacheErr) {
          console.error("Cache revalidation failed in ppdb DELETE all:", cacheErr);
        }
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Gagal mengosongkan data." }, { status: 500 });
      }
    }

    if (!id) {
      return NextResponse.json({ error: "ID pendaftar tidak ditentukan." }, { status: 400 });
    }

    let targetNik = nik || '';
    let targetName = '';

    // Find the record details from local JSON before deleting
    if (fs.existsSync(PENDAFTARAN_JSON)) {
      try {
        const records = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
        const record = records.find((r, idx) => {
          const rId = r.id || r.nik || r.nik_siswa || String(idx + 1);
          const rNik = r.nik || r.nik_siswa;
          return String(rId) === String(id) || String(rNik) === String(nik);
        });
        if (record) {
          if (!targetNik) targetNik = record.nik || record.nik_siswa || '';
          targetName = record.nama_lengkap || '';
        }
      } catch (e) {
        console.error("Error reading record details from local JSON:", e);
      }
    }

    let deletedOk = false;

    // 1. Delete from local JSON
    if (scope === 'both' || scope === 'local') {
      if (fs.existsSync(PENDAFTARAN_JSON)) {
        try {
          const records = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
          const newRecords = [];
          for (let idx = 0; idx < records.length; idx++) {
            const r = records[idx];
            const rId = r.id || r.nik || r.nik_siswa || String(idx + 1);
            const rNik = r.nik || r.nik_siswa;
            if (
              String(rId) !== String(id) &&
              String(rNik) !== String(nik) &&
              (!nik || String(rNik) !== String(nik)) &&
              (!id || String(rNik) !== String(id))
            ) {
              newRecords.push(r);
            }
          }
          if (newRecords.length < records.length) {
            fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify(newRecords, null, 4), 'utf-8');
            deletedOk = true;
          }
        } catch (e) {
          console.error("Error deleting from local JSON:", e);
        }
      }
    } else {
      deletedOk = true; // skipped local
    }

    // 2. Delete from Supabase
    const supabaseActive = isSupabaseEnabled();
    let supabaseDeleted = false;

    if (supabaseActive && (scope === 'both' || scope === 'supabase')) {
      try {
        // Try deleting by NIK first
        if (targetNik && targetNik.trim() !== '') {
          const { data, error } = await supabase
            .from("ppdb_sdn_bobong")
            .delete()
            .eq("nik_siswa", String(targetNik).trim())
            .select();
          if (error) throw error;
          if (data && data.length > 0) {
            supabaseDeleted = true;
          }
        }

        // Try deleting by integer ID next
        if (!supabaseDeleted && id && /^\d+$/.test(String(id).trim())) {
          const { data, error } = await supabase
            .from("ppdb_sdn_bobong")
            .delete()
            .eq("id", parseInt(id, 10))
            .select();
          if (error) throw error;
          if (data && data.length > 0) {
            supabaseDeleted = true;
          }
        }

        // Fallback to name if not deleted yet
        if (!supabaseDeleted && targetName && targetName.trim() !== '') {
          const { data, error } = await supabase
            .from("ppdb_sdn_bobong")
            .delete()
            .eq("nama_lengkap", targetName.trim())
            .select();
          if (error) throw error;
          if (data && data.length > 0) {
            supabaseDeleted = true;
          }
        }
      } catch (e) {
        console.error("Error deleting from Supabase:", e);
        return NextResponse.json({ error: "Gagal menghapus data di Supabase: " + e.message }, { status: 500 });
      }
    } else {
      supabaseDeleted = true; // skipped supabase
    }

    if (deletedOk || supabaseDeleted) {
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in ppdb DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus data pendaftar di database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nama_lengkap,
      nik,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      nama_ibu,
      no_hp,
      alamat,
      jalur_ppdb
    } = body;

    if (!nama_lengkap || !nik || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !nama_ibu || !no_hp || !alamat || !jalur_ppdb) {
      return NextResponse.json({ error: "Semua kolom formulir wajib diisi!" }, { status: 400 });
    }

    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return NextResponse.json({ error: "NIK harus terdiri dari 16 digit angka!" }, { status: 400 });
    }

    const waktu_daftar = new Date().toISOString().replace('T', ' ').split('.')[0];
    const status = "Diterima Sistem";
    const newId = `ppdb-${Math.floor(Date.now() / 1000)}`;

    let savedToSupabase = false;

    // 1. Try to save to Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase.from("ppdb_sdn_bobong").insert({
          nama_lengkap,
          nik_siswa: nik,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          nama_ibu_kandung: nama_ibu,
          alamat_domisili: alamat,
          nomor_hp_orangtua: no_hp,
          jalur_ppdb,
          waktu_daftar,
          status
        }).select();

        if (error) throw error;
        savedToSupabase = true;
      } catch (e) {
        console.error("Error saving to Supabase during PPDB POST:", e.message || e);
      }
    }

    // 2. Save/Append to local JSON
    let localSaved = false;
    try {
      let localRecords = [];
      if (fs.existsSync(PENDAFTARAN_JSON)) {
        localRecords = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
      }
      
      // Prevent duplicate NIK in local list
      localRecords = localRecords.filter(r => String(r.nik).trim() !== String(nik).trim());

      const newRecord = {
        id: newId,
        nama_lengkap,
        nik,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        nama_ibu,
        no_hp,
        alamat,
        jalur_ppdb,
        waktu_daftar,
        status
      };

      localRecords.unshift(newRecord);
      fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify(localRecords, null, 4), 'utf-8');
      localSaved = true;
    } catch (e) {
      console.error("Error saving to local JSON during PPDB POST:", e);
    }

    if (savedToSupabase || localSaved) {
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in ppdb POST:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data pendaftaran." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
