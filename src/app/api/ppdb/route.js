import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { PENDAFTARAN_JSON, loadLocalStatuses, supabase } from '../../../lib/database';
import fs from 'fs';
import path from 'path';

async function checkAuth() {
  try {
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
    const { id, status: newStatus } = await request.json();

    if (!id || !newStatus) {
      return NextResponse.json({ error: "ID dan status wajib ditentukan." }, { status: 400 });
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
          if (String(rId) === String(id) || String(r.nik) === String(id) || String(r.nik_siswa) === String(id)) {
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
    if (supabase) {
      try {
        const { data, error } = await supabase.from("ppdb_sdn_bobong").update({ status: newStatus }).eq("id", id).select();
        if (data && data.length > 0) {
          updatedOk = true;
        } else {
          // Try NIK if ID mismatch
          const { data: dataNik } = await supabase.from("ppdb_sdn_bobong").update({ status: newStatus }).eq("nik_siswa", id).select();
          if (dataNik && dataNik.length > 0) {
            updatedOk = true;
          }
        }
      } catch (e) {
        console.error("Error updating status in Supabase:", e);
      }
    }

    if (updatedOk) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal memperbarui status pendaftaran." }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: "ID pendaftar tidak ditentukan." }, { status: 400 });
    }

    let deletedOk = false;

    // 1. Delete from local JSON
    if (fs.existsSync(PENDAFTARAN_JSON)) {
      try {
        const records = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
        const newRecords = [];
        for (let idx = 0; idx < records.length; idx++) {
          const r = records[idx];
          const rId = r.id || r.nik || r.nik_siswa || String(idx + 1);
          if (String(rId) !== String(id) && String(r.nik) !== String(id) && String(r.nik_siswa) !== String(id)) {
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

    // 2. Delete from Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase.from("ppdb_sdn_bobong").delete().eq("id", id).select();
        if (data && data.length > 0) {
          deletedOk = true;
        } else {
          // Try NIK if ID mismatch
          const { data: dataNik } = await supabase.from("ppdb_sdn_bobong").delete().eq("nik_siswa", id).select();
          if (dataNik && dataNik.length > 0) {
            deletedOk = true;
          }
        }
      } catch (e) {
        console.error("Error deleting from Supabase:", e);
      }
    }

    if (deletedOk) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus data pendaftar." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
