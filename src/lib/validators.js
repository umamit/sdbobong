/**
 * src/lib/validators.js
 * Centralized Zod schema definitions for all API route body validation.
 *
 * Usage:
 *   import { ppdbSchema, parseBody } from '@/lib/validators';
 *   const result = await parseBody(request, ppdbSchema);
 *   if (!result.success) return result.error;
 *   const data = result.data;
 */

import { z } from 'zod';
import { NextResponse } from 'next/server';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const phoneID = z
  .string().trim()
  .regex(/^(\+62|62|0)8[0-9]{8,13}$/, 'Nomor HP tidak valid (format: 08xx / +628xx)');

const str = (max = 255) =>
  z.string().trim().min(1, 'Wajib diisi').max(max, `Maksimal ${max} karakter`);

const optStr = (max = 255) =>
  z.string().trim().max(max, `Maksimal ${max} karakter`).optional();

// ─── PPDB Registration ─────────────────────────────────────────────────────────

export const ppdbSchema = z.object({
  nama_lengkap:    str(100),
  nama_panggilan:  str(50),
  nik: z.string().trim()
    .length(16, 'NIK harus 16 digit')
    .regex(/^\d{16}$/, 'NIK hanya boleh berisi angka'),
  tempat_lahir:    str(100),
  tanggal_lahir:   z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
  jenis_kelamin:   z.enum(['Laki-laki', 'Perempuan']),
  agama:           z.enum(['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu']),
  anak_ke:         z.coerce.number().int().min(1).max(20),
  dari_bersaudara: z.coerce.number().int().min(1).max(20),
  alamat:          str(500),
  jalur_ppdb:      z.enum(['Zonasi','Afirmasi','Prestasi','Perpindahan Tugas Orang Tua']),
  nama_ayah:       str(100),
  pekerjaan_ayah:  str(100),
  no_hp_ayah:      phoneID,
  nama_ibu:        str(100),
  pekerjaan_ibu:   str(100),
  no_hp_ibu:       phoneID,
  no_hp:           phoneID,
  nama_wali:       optStr(100),
  pekerjaan_wali:  optStr(100),
});

// ─── Guest Book / Feedback ─────────────────────────────────────────────────────

export const messageSchema = z.object({
  name:    str(100),
  role:    str(100),
  type:    z.enum(['guestbook','feedback'], { message: 'Tipe pesan tidak valid' }),
  message: str(1000),
});

// ─── Admin Login ───────────────────────────────────────────────────────────────

export const adminAuthSchema = z.object({
  email:    z.string().trim().email('Format email tidak valid').max(255),
  password: z.string().min(1, 'Password wajib diisi').max(128),
});

// ─── Guru Login ────────────────────────────────────────────────────────────────

export const guruAuthSchema = z.object({
  email:    z.string().trim().email('Format email tidak valid').max(255),
  password: z.string().min(1, 'Password wajib diisi').max(128),
});

// ─── Change Password ───────────────────────────────────────────────────────────

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi').max(128),
  newPassword: z.string()
    .min(8, 'Minimal 8 karakter')
    .max(128)
    .regex(/[A-Z]/, 'Harus ada 1 huruf kapital')
    .regex(/[0-9]/, 'Harus ada 1 angka'),
});

// ─── AI Chat ───────────────────────────────────────────────────────────────────

export const chatSchema = z.object({
  messages: z.array(z.object({
    role:    z.enum(['user','assistant','system']),
    content: z.string().min(1).max(4000),
  })).min(1).max(50),
});

// ─── Student Record ────────────────────────────────────────────────────────────

export const studentSchema = z.object({
  nisn:        str(10),
  nis:         optStr(10),
  name:        str(100),
  class:       str(10),
  gender:      z.enum(['Laki-laki','Perempuan']),
  birth_place: optStr(100),
  birth_date:  z.string().trim().optional(),
  address:     optStr(500),
  parent_name: optStr(100),
});

// ─── PPDB Status Update ────────────────────────────────────────────────────────

export const ppdbStatusSchema = z.object({
  id:     z.string().min(1),
  nik:    z.string().trim().length(16).regex(/^\d{16}$/),
  status: z.enum([
    'Diterima Sistem',
    'Sedang Diverifikasi',
    'Diterima',
    'Ditolak',
    'Menunggu Dokumen',
  ]),
});

// ─── Universal parseBody helper ────────────────────────────────────────────────

export async function parseBody(request, schema) {
  let body;
  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Request body tidak valid atau bukan JSON.' },
        { status: 400 }
      ),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const issues = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Validasi gagal. Periksa kembali data yang dikirim.', issues },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}
