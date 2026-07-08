'use server';

import { revalidatePath } from 'next/cache';
import { PENDAFTARAN_JSON, supabase, isSupabaseEnabled, getAvailableSupabaseColumns, handlePhotoUpload, packBerkasIntoAlamat } from '../../lib/database';
import { prisma } from '../../lib/prisma';
import { ppdbSchema } from '../../lib/validators';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
    const website_url = formData.get('website_url')?.trim();
    const nama_lengkap = formData.get('nama_lengkap')?.trim();
    
    // Shadow drop spam bot if honeypot field is filled
    if (website_url) {
      console.warn("Spam bot PPDB submission blocked via honeypot:", nama_lengkap);
      return { success: true, record: { id: `ppdb-${Math.floor(Date.now() / 1000)}`, nama_lengkap, status: 'Diterima Sistem', waktu_daftar: new Date().toISOString() } };
    }

    const nama_panggilan = formData.get('nama_panggilan')?.trim();
    
    // Sanitize NIK: remove all non-digits
    let nik = formData.get('nik')?.trim() || "";
    nik = nik.replace(/\D/g, "");

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
    
    // Sanitize phone numbers helper
    const sanitizePhone = (phone) => {
      if (!phone) return "";
      let cleaned = phone.trim().replace(/[^\d+]/g, "");
      if (cleaned.startsWith("+62")) {
        cleaned = "0" + cleaned.substring(3);
      } else if (cleaned.startsWith("62")) {
        cleaned = "0" + cleaned.substring(2);
      }
      return cleaned.replace(/\D/g, "");
    };

    let no_hp_ayah = sanitizePhone(formData.get('no_hp_ayah'));
    const nama_ibu = formData.get('nama_ibu')?.trim();
    const pekerjaan_ibu = formData.get('pekerjaan_ibu')?.trim();
    let no_hp_ibu = sanitizePhone(formData.get('no_hp_ibu'));
    let no_hp = sanitizePhone(formData.get('no_hp'));
    // Data Wali (Opsional)
    const nama_wali = formData.get('nama_wali')?.trim() || "";
    const pekerjaan_wali = formData.get('pekerjaan_wali')?.trim() || "";

    // ── Zod validation ─────────────────────────────────────────────────────
    const zodResult = ppdbSchema.safeParse({
      nama_lengkap, nama_panggilan, nik, tempat_lahir, tanggal_lahir,
      jenis_kelamin, agama, anak_ke, dari_bersaudara, alamat, jalur_ppdb,
      nama_ayah, pekerjaan_ayah, no_hp_ayah,
      nama_ibu, pekerjaan_ibu, no_hp_ibu,
      no_hp, nama_wali, pekerjaan_wali,
    });

    if (!zodResult.success) {
      const issues = zodResult.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return {
        error: 'Validasi gagal. Periksa kembali data yang dikirim.',
        issues,
      };
    }

    // File Extraction & Validation
    const berkas_kk_file = formData.get('berkas_kk');
    const berkas_akta_file = formData.get('berkas_akta');
    const berkas_ijazah_file = formData.get('berkas_ijazah');

    const processUpload = async (fileObj, label, required = true) => {
      if (!fileObj || !(fileObj instanceof File) || fileObj.size === 0) {
        if (required) {
          throw new Error(`Berkas ${label} wajib diunggah!`);
        }
        return "";
      }

      if (fileObj.size > 350 * 1024) {
        throw new Error(`Ukuran berkas ${label} melebihi batas maksimal 350KB!`);
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
    let berkas_ijazah = "";

    try {
      berkas_kk = await processUpload(berkas_kk_file, "Kartu Keluarga", true);
      berkas_akta = await processUpload(berkas_akta_file, "Akta Kelahiran", true);
      berkas_ijazah = await processUpload(berkas_ijazah_file, "Ijazah TK/PAUD", false);
    } catch (uploadErr) {
      return { error: uploadErr.message };
    }

    const waktu_daftar = new Date().toISOString().replace('T', ' ').split('.')[0];
    const status = "Diterima Sistem";
    const newId = `ppdb-${crypto.randomUUID()}`;
    const tahun_ajaran = getAcademicYear(waktu_daftar);

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
      berkas_ijazah
    };

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
          berkas_ijazah
        };

        const supabaseData = {};
        for (const [col, val] of Object.entries(colMap)) {
          if (availableCols.includes(col)) {
            supabaseData[col] = val;
          }
        }

        // Check if we need to pack missing fields into alamat_domisili (fallback for zero-migration)
        const missingCols = Object.keys(colMap).filter(c => !availableCols.includes(c));
        if (missingCols.length > 0) {
          const extraData = {};
          for (const col of missingCols) {
            extraData[col] = colMap[col];
          }
          supabaseData.alamat_domisili = packBerkasIntoAlamat(alamat, extraData);
        }

        await prisma.pPDB.create({
          data: supabaseData
        });
        savedToSupabase = true;
      } catch (e) {
        console.error("Error saving to Supabase via Prisma during PPDB Server Action:", e.message || e);
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
      return { success: true, record: newRecord };
    } else {
      return { error: "Gagal menyimpan data pendaftaran ke database." };
    }
  } catch (e) {
    return { error: "Terjadi kesalahan server: " + e.message };
  }
}

