import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { loadTeachers, saveTeachers, handlePhotoUpload, supabase, isSupabaseEnabled } from '../../../lib/database';
import { verifyAdminToken } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';

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

export async function GET() {
  try {
    const teachersList = await loadTeachers();
    return NextResponse.json(teachersList);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat data guru: " + e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const role = formData.get('role')?.toString().trim();
    const details = formData.get('details')?.toString().trim() || "";
    const status = formData.get('status')?.toString().trim();
    const nip = formData.get('nip')?.toString().trim() || "";
    let image = formData.get('image')?.toString().trim();

    // Process photo upload
    const photoFile = formData.get('photo');
    const uploadedUrl = await handlePhotoUpload(photoFile, 'teachers', ['png', 'jpg', 'jpeg']);

    if (uploadedUrl === 'INVALID_TYPE') {
      return NextResponse.json({ error: "Jenis file tidak valid! Hanya file PNG, JPG, dan JPEG yang diperbolehkan." }, { status: 400 });
    } else if (uploadedUrl === 'ERROR') {
      return NextResponse.json({ error: "Gagal mengunggah foto." }, { status: 500 });
    } else if (uploadedUrl && uploadedUrl !== 'NO_FILE') {
      image = uploadedUrl;
    }

    if (!image) {
      image = "/images/teacher_1.png"; // Fallback default illustration
    }

    if (!name || !role || !status) {
      return NextResponse.json({ error: "Kolom Nama, Jabatan, dan Status wajib diisi!" }, { status: 400 });
    }

    const teachersList = await loadTeachers();

    // Periksa duplikat nama guru
    const duplicateTeacher = teachersList.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (duplicateTeacher) {
      return NextResponse.json({ error: "Data guru dengan nama ini sudah terdaftar!" }, { status: 400 });
    }

    // Periksa duplikat jabatan Kepala Sekolah (hanya boleh satu Kepala Sekolah)
    if (role.toLowerCase().includes('kepala sekolah')) {
      const duplicateKepala = teachersList.find(t => (t.role || "").toLowerCase().includes("kepala sekolah"));
      if (duplicateKepala) {
        return NextResponse.json({ error: `Jabatan Kepala Sekolah sudah terdaftar atas nama ${duplicateKepala.name}! Hapus atau edit jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Periksa duplikat jabatan Ketua Komite (hanya boleh satu Komite)
    if (role.toLowerCase().includes('komite')) {
      const duplicateKomite = teachersList.find(t => (t.role || "").toLowerCase().includes("komite"));
      if (duplicateKomite) {
        return NextResponse.json({ error: `Jabatan Komite Sekolah sudah terdaftar atas nama ${duplicateKomite.name}! Hapus atau edit jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Periksa duplikat jabatan Tata Usaha (hanya boleh satu Tata Usaha)
    if (role.toLowerCase().includes('tata usaha') || role.toLowerCase().includes('koordinator tu')) {
      const duplicateTU = teachersList.find(t => (t.role || "").toLowerCase().includes("tata usaha") || (t.role || "").toLowerCase().includes("koordinator tu"));
      if (duplicateTU) {
        return NextResponse.json({ error: `Jabatan Tata Usaha sudah terdaftar atas nama ${duplicateTU.name}! Hapus atau edit jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Periksa duplikat jabatan Bendahara (hanya boleh satu Bendahara)
    if (role.toLowerCase().includes('bendahara')) {
      const duplicateBendahara = teachersList.find(t => (t.role || "").toLowerCase().includes("bendahara"));
      if (duplicateBendahara) {
        return NextResponse.json({ error: `Jabatan Bendahara sudah terdaftar atas nama ${duplicateBendahara.name}! Hapus atau edit jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    const newTeacher = {
      id: `teacher-${Math.floor(Date.now() / 1000)}`,
      name,
      role,
      details,
      status,
      image,
      nip
    };

    if (role.toLowerCase().includes('kepala sekolah')) {
      teachersList.unshift(newTeacher);
    } else {
      teachersList.push(newTeacher);
    }

    const saved = await saveTeachers(teachersList);

    if (saved) {
      await createAuditLog('CREATE_TEACHER', `Menambahkan data guru baru: "${name}" (${role})`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in teachers POST:", cacheErr);
      }
      return NextResponse.json({ success: true, teacher: newTeacher });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data guru ke database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const role = formData.get('role')?.toString().trim();
    const details = formData.get('details')?.toString().trim() || "";
    const status = formData.get('status')?.toString().trim();
    const nip = formData.get('nip')?.toString().trim() || "";
    let image = formData.get('image')?.toString().trim();

    if (!id) {
      return NextResponse.json({ error: "ID guru tidak ditentukan." }, { status: 400 });
    }

    const teachersList = await loadTeachers();
    const teacherIndex = teachersList.findIndex(t => t.id === id);

    if (teacherIndex === -1) {
      return NextResponse.json({ error: "Data guru tidak ditemukan." }, { status: 404 });
    }

    // Process photo upload if any
    const photoFile = formData.get('photo');
    const uploadedUrl = await handlePhotoUpload(photoFile, 'teachers', ['png', 'jpg', 'jpeg']);

    if (uploadedUrl === 'INVALID_TYPE') {
      return NextResponse.json({ error: "Jenis file tidak valid! Hanya file PNG, JPG, dan JPEG yang diperbolehkan." }, { status: 400 });
    } else if (uploadedUrl === 'ERROR') {
      return NextResponse.json({ error: "Gagal mengunggah foto." }, { status: 500 });
    } else if (uploadedUrl && uploadedUrl !== 'NO_FILE') {
      image = uploadedUrl;
    }

    if (!image) {
      image = "/images/teacher_1.png"; // Fallback default illustration
    }

    if (!name || !role || !status) {
      return NextResponse.json({ error: "Kolom Nama, Jabatan, dan Status wajib diisi!" }, { status: 400 });
    }

    // Periksa duplikat nama guru dengan ID lain
    const duplicateTeacher = teachersList.find(t => t.name.toLowerCase() === name.toLowerCase() && t.id !== id);
    if (duplicateTeacher) {
      return NextResponse.json({ error: "Nama guru ini sudah terdaftar pada data guru lain!" }, { status: 400 });
    }

    // Periksa duplikat jabatan Kepala Sekolah dengan ID lain (hanya boleh satu Kepala Sekolah)
    if (role.toLowerCase().includes('kepala sekolah')) {
      const duplicateKepala = teachersList.find(t => (t.role || "").toLowerCase().includes("kepala sekolah") && t.id !== id);
      if (duplicateKepala) {
        return NextResponse.json({ error: `Jabatan Kepala Sekolah sudah terdaftar atas nama ${duplicateKepala.name}! Ganti jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Periksa duplikat jabatan Ketua Komite dengan ID lain (hanya boleh satu Komite)
    if (role.toLowerCase().includes('komite')) {
      const duplicateKomite = teachersList.find(t => (t.role || "").toLowerCase().includes("komite") && t.id !== id);
      if (duplicateKomite) {
        return NextResponse.json({ error: `Jabatan Komite Sekolah sudah terdaftar atas nama ${duplicateKomite.name}! Ganti jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Periksa duplikat jabatan Tata Usaha dengan ID lain (hanya boleh satu Tata Usaha)
    if (role.toLowerCase().includes('tata usaha') || role.toLowerCase().includes('koordinator tu')) {
      const duplicateTU = teachersList.find(t => ((t.role || "").toLowerCase().includes("tata usaha") || (t.role || "").toLowerCase().includes("koordinator tu")) && t.id !== id);
      if (duplicateTU) {
        return NextResponse.json({ error: `Jabatan Tata Usaha sudah terdaftar atas nama ${duplicateTU.name}! Ganti jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Periksa duplikat jabatan Bendahara dengan ID lain (hanya boleh satu Bendahara)
    if (role.toLowerCase().includes('bendahara')) {
      const duplicateBendahara = teachersList.find(t => (t.role || "").toLowerCase().includes("bendahara") && t.id !== id);
      if (duplicateBendahara) {
        return NextResponse.json({ error: `Jabatan Bendahara sudah terdaftar atas nama ${duplicateBendahara.name}! Ganti jabatan beliau terlebih dahulu.` }, { status: 400 });
      }
    }

    // Update details
    teachersList[teacherIndex].name = name;
    teachersList[teacherIndex].role = role;
    teachersList[teacherIndex].details = details;
    teachersList[teacherIndex].status = status;
    teachersList[teacherIndex].image = image;
    teachersList[teacherIndex].nip = nip;

    const saved = await saveTeachers(teachersList);

    if (saved) {
      await createAuditLog('UPDATE_TEACHER', `Memperbarui data guru: "${name}" (${role})`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in teachers PUT:", cacheErr);
      }
      return NextResponse.json({ success: true, teacher: teachersList[teacherIndex] });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan perubahan data guru." }, { status: 500 });
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
      return NextResponse.json({ error: "ID guru tidak ditentukan." }, { status: 400 });
    }

    const teachersList = await loadTeachers();
    const teacherToDelete = teachersList.find(t => t.id === id);
    const teacherName = teacherToDelete ? teacherToDelete.name : id;
    const teacherRole = teacherToDelete ? ` (${teacherToDelete.role})` : '';

    const filteredList = teachersList.filter(t => t.id !== id);

    if (filteredList.length === teachersList.length) {
      if (isSupabaseEnabled() && supabase) {
        try {
          await supabase.from("teachers_sdn_bobong").delete().eq("id", id);
        } catch (dbErr) {
          console.error("Error direct delete from Supabase:", dbErr.message);
        }
      }
      await createAuditLog('DELETE_TEACHER', `Menghapus data guru (langsung dari DB): "${teacherName}"${teacherRole}`, request);
      return NextResponse.json({ success: true, message: "Data guru sudah tidak ada." });
    }

    const saved = await saveTeachers(filteredList);

    if (saved) {
      await createAuditLog('DELETE_TEACHER', `Menghapus data guru: "${teacherName}"${teacherRole}`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in teachers DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus data guru." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
