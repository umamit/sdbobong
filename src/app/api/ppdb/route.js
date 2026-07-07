import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PENDAFTARAN_JSON, loadLocalStatuses, supabase, isSupabaseEnabled, getAvailableSupabaseColumns, unpackBerkasFromAlamat, loadWebConfig } from '../../../lib/database';
import { prisma } from '../../../lib/prisma';
import { checkAuth } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getAcademicYear(dateStr) {
  if (dateStr && /^\d{4}/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    return `${year}/${year + 1}`;
  }
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
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
        const data = await prisma.pPDB.findMany({
          orderBy: { waktu_daftar: 'desc' }
        });
        if (data) {
          records = data.map(r => {
            const unpacked = unpackBerkasFromAlamat(r.alamat_domisili || "");
            return {
              ...r,
              alamat_domisili: unpacked.cleanAlamat,
              berkas_kk: r.berkas_kk || unpacked.berkas.berkas_kk || "",
              berkas_akta: r.berkas_akta || unpacked.berkas.berkas_akta || "",
              berkas_ktp: r.berkas_ktp || unpacked.berkas.berkas_ktp || "",
              berkas_sptjm: r.berkas_sptjm || unpacked.berkas.berkas_sptjm || "",
              berkas_kip: r.berkas_kip || unpacked.berkas.berkas_kip || "",
              berkas_ijazah: r.berkas_ijazah || unpacked.berkas.berkas_ijazah || "",
              nama_panggilan: r.nama_panggilan || unpacked.berkas.nama_panggilan || "",
              agama: r.agama || unpacked.berkas.agama || "",
              anak_ke: r.anak_ke || unpacked.berkas.anak_ke || "",
              dari_bersaudara: r.dari_bersaudara || unpacked.berkas.dari_bersaudara || "",
              nama_ayah: r.nama_ayah || unpacked.berkas.nama_ayah || "",
              pekerjaan_ayah: r.pekerjaan_ayah || unpacked.berkas.pekerjaan_ayah || "",
              no_hp_ayah: r.no_hp_ayah || unpacked.berkas.no_hp_ayah || "",
              pekerjaan_ibu: r.pekerjaan_ibu || unpacked.berkas.pekerjaan_ibu || "",
              no_hp_ibu: r.no_hp_ibu || unpacked.berkas.no_hp_ibu || "",
              nama_wali: r.nama_wali || unpacked.berkas.nama_wali || "",
              pekerjaan_wali: r.pekerjaan_wali || unpacked.berkas.pekerjaan_wali || "",
              tahun_ajaran: r.tahun_ajaran || unpacked.berkas.tahun_ajaran || ""
            };
          });
        }
      } catch (e) {
        console.error("Error querying Supabase for API GET:", e);
      }
    }

    if (!records || records.length === 0) {
      if (fs.existsSync(PENDAFTARAN_JSON)) {
        try {
          const localData = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
          records = localData.map((r, idx) => ({
            ...r,
            id: r.id || r.nik || r.nik_siswa || String(idx + 1),
            nama_lengkap: r.nama_lengkap || "",
            nama_panggilan: r.nama_panggilan || "",
            nik_siswa: r.nik || r.nik_siswa || "",
            tempat_lahir: r.tempat_lahir || "",
            tanggal_lahir: r.tanggal_lahir || "",
            jenis_kelamin: r.jenis_kelamin || "",
            agama: r.agama || "",
            anak_ke: r.anak_ke !== undefined && r.anak_ke !== null ? String(r.anak_ke) : "",
            dari_bersaudara: r.dari_bersaudara !== undefined && r.dari_bersaudara !== null ? String(r.dari_bersaudara) : "",
            alamat_domisili: r.alamat || r.alamat_domisili || "",
            nama_ayah: r.nama_ayah || "",
            pekerjaan_ayah: r.pekerjaan_ayah || "",
            no_hp_ayah: r.no_hp_ayah || "",
            nama_ibu_kandung: r.nama_ibu || r.nama_ibu_kandung || "",
            pekerjaan_ibu: r.pekerjaan_ibu || "",
            no_hp_ibu: r.no_hp_ibu || "",
            nomor_hp_orangtua: r.no_hp || r.nomor_hp_orangtua || "",
            nama_wali: r.nama_wali || "",
            pekerjaan_wali: r.pekerjaan_wali || "",
            jalur_ppdb: r.jalur_ppdb || "",
            waktu_daftar: r.waktu_daftar || "",
            status: r.status || "Diterima Sistem",
            berkas_kk: r.berkas_kk || "",
            berkas_akta: r.berkas_akta || "",
            berkas_ktp: r.berkas_ktp || "",
            berkas_sptjm: r.berkas_sptjm || "",
            berkas_kip: r.berkas_kip || "",
            berkas_ijazah: r.berkas_ijazah || ""
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
      r.tahun_ajaran = r.tahun_ajaran || getAcademicYear(r.waktu_daftar);
    });

    if (isExport) {
      const headers = [
        "No", "Nama Lengkap", "NIK Siswa", "Tahun Ajaran", "Tempat Lahir", "Tanggal Lahir",
        "Jenis Kelamin", "Nama Ibu Kandung", "Nomor HP Orang Tua", "Alamat Domisili",
        "Jalur PPDB", "Waktu Daftar", "Status"
      ];

      const csvLines = [headers.join(',')];

      records.forEach((r, idx) => {
        const row = [
          idx + 1,
          r.nama_lengkap || '',
          r.nik_siswa || r.nik || '',
          r.tahun_ajaran || '',
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

async function sendWhatsAppNotification(pendaftar, status) {
  try {
    const config = await loadWebConfig();
    const gateway = config.stats?.wa_gateway;
    if (!gateway || !gateway.enabled) {
      console.log("WA notification skipped: Gateway not enabled.");
      return;
    }

    const phone = pendaftar.nomor_hp_orangtua || pendaftar.no_hp_ibu || pendaftar.no_hp_ayah;
    if (!phone) {
      console.log("WA notification skipped: Phone number not found.");
      return;
    }

    // Clean phone number (convert 08... to 628...)
    let cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const parentName = pendaftar.nama_ibu_kandung || pendaftar.nama_ayah || 'Orang Tua/Wali';
    const studentName = pendaftar.nama_lengkap || 'Calon Siswa';
    const pathJalur = pendaftar.jalur_ppdb || 'Zonasi';

    let template = '';
    if (status === 'Terverifikasi') {
      template = gateway.message_template_verified || 
        "Halo *[NAMA_ORANGTUA]*, pendaftaran PPDB putra/putri Anda *[NAMA_SISWA]* (Jalur *[JALUR]*) di SD Negeri Bobong telah diverifikasi dan **DITERIMA**. Silakan datang ke sekolah untuk proses verifikasi dokumen fisik dan daftar ulang.";
    } else if (status === 'Ditolak') {
      template = gateway.message_template_rejected || 
        "Halo *[NAMA_ORANGTUA]*, mohon maaf pendaftaran PPDB putra/putri Anda *[NAMA_SISWA]* di SD Negeri Bobong **DITOLAK**. Silakan hubungi operator sekolah untuk informasi lebih lanjut mengenai kelengkapan berkas.";
    } else {
      return; // Only send notifications for Terverifikasi and Ditolak statuses
    }

    // Replace placeholders
    const message = template
      .replace(/\[NAMA_ORANGTUA\]/g, parentName)
      .replace(/\[NAMA_SISWA\]/g, studentName)
      .replace(/\[JALUR\]/g, pathJalur);

    const gatewayUrl = gateway.url || 'https://api.fonnte.com/send';
    const token = gateway.token || '';
    const provider = gateway.provider || 'fonnte';

    console.log(`Sending WA via ${provider} to ${cleanPhone}...`);

    let bodyData;
    let headers = {
      'Content-Type': 'application/json'
    };

    if (provider === 'fonnte') {
      headers['Authorization'] = token;
      bodyData = JSON.stringify({
        target: cleanPhone,
        message: message
      });
    } else if (provider === 'wablas') {
      headers['Authorization'] = token;
      bodyData = JSON.stringify({
        phone: cleanPhone,
        message: message
      });
    } else {
      // Custom webhook / generic provider
      bodyData = JSON.stringify({
        phone: cleanPhone,
        message: message,
        parent_name: parentName,
        student_name: studentName,
        status: status
      });
    }

    const res = await fetch(gatewayUrl, {
      method: 'POST',
      headers: headers,
      body: bodyData,
      signal: AbortSignal.timeout(8000)
    });

    const resText = await res.text();
    console.log("WA Gateway response status:", res.status, resText);
  } catch (err) {
    console.error("Failed to send WA notification:", err);
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
          const data = await prisma.pPDB.updateMany({
            where: { nik_siswa: String(targetNik).trim() },
            data: { status: newStatus }
          });
          if (data && data.count > 0) {
            supabaseUpdated = true;
          }
        }

        // Try updating by integer ID next if not updated yet
        if (!supabaseUpdated && id && /^\d+$/.test(String(id).trim())) {
          const data = await prisma.pPDB.updateMany({
            where: { id: parseInt(id, 10) },
            data: { status: newStatus }
          });
          if (data && data.count > 0) {
            supabaseUpdated = true;
          }
        }
      } catch (e) {
        console.error("Error updating status via Prisma:", e);
        return NextResponse.json({ error: "Gagal menyinkronkan status ke database: " + e.message }, { status: 500 });
      }
    }

    if (supabaseActive ? supabaseUpdated : updatedOk) {
      await createAuditLog('UPDATE_PPDB_STATUS', `Mengubah status PPDB pendaftar NIK/ID: ${nik || id} menjadi "${newStatus}"`, request);
      
      // WhatsApp notification trigger in background
      if (newStatus === 'Terverifikasi' || newStatus === 'Ditolak') {
        try {
          let pendaftar = null;
          if (fs.existsSync(PENDAFTARAN_JSON)) {
            const records = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
            pendaftar = records.find(r => 
              String(r.id || r.nik || r.nik_siswa) === String(id) ||
              String(r.nik || r.nik_siswa) === String(nik)
            );
          }
          
          if (!pendaftar && supabaseActive) {
            const data = await prisma.pPDB.findUnique({
              where: { nik_siswa: String(nik || id).trim() }
            });
            if (data) {
              pendaftar = data;
            }
          }

          if (pendaftar) {
            sendWhatsAppNotification(pendaftar, newStatus);
          }
        } catch (waErr) {
          console.error("Error preparing WA notification:", waErr);
        }
      }

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
          await prisma.pPDB.deleteMany({
            where: {
              id: { not: 0 }
            }
          });
          supabaseDeleted = true;
        } catch (e) {
          console.error("Error clearing database:", e);
          return NextResponse.json({ error: "Gagal menghapus data di database: " + e.message }, { status: 500 });
        }
      } else {
        supabaseDeleted = true; // skipped database
      }

      if (deletedOk || supabaseDeleted) {
        await createAuditLog('CLEAR_PPDB_ALL', `Mengosongkan seluruh data pendaftar PPDB dari sistem`, request);
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
      await createAuditLog('DELETE_PPDB_RECORD', `Menghapus pendaftar PPDB "${targetName || 'Tak Dikenal'}" (NIK/ID: ${targetNik || id})`, request);
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
      nama_panggilan,
      nik,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      anak_ke,
      dari_bersaudara,
      alamat,
      jalur_ppdb,
      // Data Orang Tua
      nama_ayah,
      pekerjaan_ayah,
      no_hp_ayah,
      nama_ibu,
      pekerjaan_ibu,
      no_hp_ibu,
      no_hp,
      // Data Wali (Opsional)
      nama_wali,
      pekerjaan_wali
    } = body;

    if (
      !nama_lengkap || !nama_panggilan || !nik || !tempat_lahir || !tanggal_lahir || 
      !jenis_kelamin || !agama || !anak_ke || !dari_bersaudara || !alamat || !jalur_ppdb ||
      !nama_ayah || !pekerjaan_ayah || !no_hp_ayah ||
      !nama_ibu || !pekerjaan_ibu || !no_hp_ibu || !no_hp
    ) {
      return NextResponse.json({ error: "Semua kolom formulir wajib diisi!" }, { status: 400 });
    }

    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return NextResponse.json({ error: "NIK harus terdiri dari 16 digit angka!" }, { status: 400 });
    }

    const waktu_daftar = new Date().toISOString().replace('T', ' ').split('.')[0];
    const status = "Diterima Sistem";
    const newId = `ppdb-${Math.floor(Date.now() / 1000)}`;
    const tahun_ajaran = getAcademicYear(waktu_daftar);

    let savedToSupabase = false;

    // 1. Try to save to Supabase dynamically based on existing columns
    if (supabase) {
      try {
        const availableCols = await getAvailableSupabaseColumns();
        
        const colMap = {
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
          status,
          tahun_ajaran,
          
          nama_panggilan,
          agama,
          anak_ke: anak_ke ? parseInt(anak_ke, 10) : null,
          dari_bersaudara: dari_bersaudara ? parseInt(dari_bersaudara, 10) : null,
          nama_ayah,
          pekerjaan_ayah,
          no_hp_ayah,
          pekerjaan_ibu,
          no_hp_ibu,
          nama_wali: nama_wali || "",
          pekerjaan_wali: pekerjaan_wali || ""
        };

        const supabaseData = {};
        for (const [col, val] of Object.entries(colMap)) {
          if (availableCols.includes(col)) {
            supabaseData[col] = val;
          }
        }

        const missingCols = Object.keys(colMap).filter(c => !availableCols.includes(c));
        if (missingCols.length > 0) {
          const extraData = {};
          for (const col of missingCols) {
            extraData[col] = colMap[col];
          }
          supabaseData.alamat_domisili = packBerkasIntoAlamat(alamat, extraData);
        }

        const data = await prisma.pPDB.create({
          data: supabaseData
        });
        savedToSupabase = true;
      } catch (e) {
        console.error("Error saving to Supabase during PPDB POST:", e.message || e);
      }
    }

    // 2. Save/Append to local JSON with ALL new fields
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
        nama_panggilan,
        nik,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        agama,
        anak_ke,
        dari_bersaudara,
        alamat,
        jalur_ppdb,
        nama_ayah,
        pekerjaan_ayah,
        no_hp_ayah,
        nama_ibu,
        pekerjaan_ibu,
        no_hp_ibu,
        no_hp,
        nama_wali: nama_wali || "",
        pekerjaan_wali: pekerjaan_wali || "",
        waktu_daftar,
        status,
        tahun_ajaran
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
