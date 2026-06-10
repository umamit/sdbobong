'use server';

import { revalidatePath } from 'next/cache';
import { PENDAFTARAN_JSON, supabase, isSupabaseEnabled, getAvailableSupabaseColumns, handlePhotoUpload, packBerkasIntoAlamat } from '../../lib/database';
import fs from 'fs';
import path from 'path';

function getAcademicYear(dateStr) {
  if (dateStr && /^\d{4}/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    return `${year}/${year + 1}`;
  }
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
}

export async function submitPpdbAction(formData) {
  try {
    const nama_lengkap = formData.get('nama_lengkap')?.trim();
    const nama_panggilan = formData.get('nama_panggilan')?.trim();
    const nik = formData.get('nik')?.trim();
    const tempat_lahir = formData.get('tempat_lahir')?.trim();
    const tanggal_lahir = formData.get('tanggal_lahir')?.trim();
    const jenis_kelamin = formData.get('jenis_kelamin')?.trim();
    const agama = formData.get('agama')?.trim();
    const anak_ke = formData.get('anak_ke');
    const dari_bersaudara = formData.get('dari_bersaudara');
    const alamat = formData.get('alamat')?.trim();
    const jalur_ppdb = formData.get('jalur_ppdb')?.trim();
    // Data Orang Tua
    const nama_ayah = formData.get('nama_ayah')?.trim();
    const pekerjaan_ayah = formData.get('pekerjaan_ayah')?.trim();
    const no_hp_ayah = formData.get('no_hp_ayah')?.trim();
    const nama_ibu = formData.get('nama_ibu')?.trim();
    const pekerjaan_ibu = formData.get('pekerjaan_ibu')?.trim();
    const no_hp_ibu = formData.get('no_hp_ibu')?.trim();
    const no_hp = formData.get('no_hp')?.trim();
    // Data Wali (Opsional)
    const nama_wali = formData.get('nama_wali')?.trim() || "";
    const pekerjaan_wali = formData.get('pekerjaan_wali')?.trim() || "";

    if (
      !nama_lengkap || !nama_panggilan || !nik || !tempat_lahir || !tanggal_lahir || 
      !jenis_kelamin || !agama || !anak_ke || !dari_bersaudara || !alamat || !jalur_ppdb ||
      !nama_ayah || !pekerjaan_ayah || !no_hp_ayah ||
      !nama_ibu || !pekerjaan_ibu || !no_hp_ibu || !no_hp
    ) {
      return { error: "Semua kolom formulir wajib diisi!" };
    }

    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return { error: "NIK harus terdiri dari 16 digit angka!" };
    }

    // Phone format validation
    const phoneFields = [
      { val: no_hp_ayah, label: 'Nomor HP Ayah' },
      { val: no_hp_ibu, label: 'Nomor HP Ibu' },
      { val: no_hp, label: 'Nomor HP Utama Kontak' }
    ];

    for (const p of phoneFields) {
      if (!/^08\d{8,12}$/.test(p.val)) {
        return { error: `Format ${p.label} tidak valid (harus dimulai dengan 08 dan berjumlah 10-14 digit)!` };
      }
    }

    // File Extraction & Validation
    const berkas_kk_file = formData.get('berkas_kk');
    const berkas_akta_file = formData.get('berkas_akta');
    const berkas_ktp_file = formData.get('berkas_ktp');
    const berkas_sptjm_file = formData.get('berkas_sptjm');
    const berkas_kip_file = formData.get('berkas_kip');

    const processUpload = async (fileObj, label, required = true) => {
      if (!fileObj || !(fileObj instanceof File) || fileObj.size === 0) {
        if (required) {
          throw new Error(`Berkas ${label} wajib diunggah!`);
        }
        return "";
      }

      if (fileObj.size > 500 * 1024) {
        throw new Error(`Ukuran berkas ${label} melebihi batas 500KB!`);
      }

      const ext = fileObj.name.split('.').pop().toLowerCase();
      if (ext !== 'pdf') {
        throw new Error(`Berkas ${label} harus berformat PDF!`);
      }

      const url = await handlePhotoUpload(fileObj, 'ppdb_berkas', ['pdf']);
      if (url === "ERROR" || url === "INVALID_TYPE" || url === "NO_FILE") {
        throw new Error(`Gagal mengunggah berkas ${label}. Silakan coba lagi.`);
      }
      return url;
    };

    let berkas_kk = "";
    let berkas_akta = "";
    let berkas_ktp = "";
    let berkas_sptjm = "";
    let berkas_kip = "";

    try {
      berkas_kk = await processUpload(berkas_kk_file, "Kartu Keluarga", true);
      berkas_akta = await processUpload(berkas_akta_file, "Akta Kelahiran", true);
      berkas_ktp = await processUpload(berkas_ktp_file, "KTP Orang Tua", true);
      berkas_sptjm = await processUpload(berkas_sptjm_file, "SPTJM", true);
      berkas_kip = await processUpload(berkas_kip_file, "KIP/PKH", false);
    } catch (uploadErr) {
      return { error: uploadErr.message };
    }

    const waktu_daftar = new Date().toISOString().replace('T', ' ').split('.')[0];
    const status = "Diterima Sistem";
    const newId = `ppdb-${Math.floor(Date.now() / 1000)}`;
    const tahun_ajaran = getAcademicYear(waktu_daftar);

    let savedToSupabase = false;

    // 1. Try to save to Supabase dynamically based on existing columns
    if (supabase && isSupabaseEnabled()) {
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
          nama_wali,
          pekerjaan_wali,

          berkas_kk,
          berkas_akta,
          berkas_ktp,
          berkas_sptjm,
          berkas_kip
        };

        const supabaseData = {};
        for (const [col, val] of Object.entries(colMap)) {
          if (availableCols.includes(col)) {
            supabaseData[col] = val;
          }
        }

        // Check if we need to pack berkas into alamat_domisili (fallback for zero-migration)
        const missingBerkasCols = ['berkas_kk', 'berkas_akta', 'berkas_ktp', 'berkas_sptjm', 'berkas_kip'].some(c => !availableCols.includes(c));
        if (missingBerkasCols) {
          const berkasData = {
            berkas_kk,
            berkas_akta,
            berkas_ktp,
            berkas_sptjm,
            berkas_kip
          };
          supabaseData.alamat_domisili = packBerkasIntoAlamat(alamat, berkasData);
        }

        const { error } = await supabase.from("ppdb_sdn_bobong").insert(supabaseData);

        if (error) throw error;
        savedToSupabase = true;
      } catch (e) {
        console.error("Error saving to Supabase during PPDB Server Action:", e.message || e);
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
        nama_wali,
        pekerjaan_wali,
        waktu_daftar,
        status,
        tahun_ajaran,
        berkas_kk,
        berkas_akta,
        berkas_ktp,
        berkas_sptjm,
        berkas_kip
      };

      localRecords.unshift(newRecord);
      fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify(localRecords, null, 4), 'utf-8');
      localSaved = true;
    } catch (e) {
      console.error("Error saving to local JSON during PPDB Server Action:", e);
    }

    if (savedToSupabase || localSaved) {
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in ppdb server action:", cacheErr);
      }
      return { success: true };
    } else {
      return { error: "Gagal menyimpan data pendaftaran ke database." };
    }
  } catch (e) {
    return { error: "Terjadi kesalahan server: " + e.message };
  }
}

