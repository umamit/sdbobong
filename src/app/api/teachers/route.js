import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { loadTeachers, saveTeachers, handlePhotoUpload, supabase, isSupabaseEnabled } from '../../../lib/database';

async function checkAuth() {
  try {
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
    const newTeacher = {
      id: `teacher-${Math.floor(Date.now() / 1000)}`,
      name,
      role,
      details,
      status,
      image
    };

    if (role.toLowerCase().includes('kepala sekolah')) {
      teachersList.unshift(newTeacher);
    } else {
      teachersList.push(newTeacher);
    }

    const saved = await saveTeachers(teachersList);

    if (saved) {
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

    // Update details
    teachersList[teacherIndex].name = name;
    teachersList[teacherIndex].role = role;
    teachersList[teacherIndex].details = details;
    teachersList[teacherIndex].status = status;
    teachersList[teacherIndex].image = image;

    const saved = await saveTeachers(teachersList);

    if (saved) {
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
    const filteredList = teachersList.filter(t => t.id !== id);

    if (filteredList.length === teachersList.length) {
      if (isSupabaseEnabled() && supabase) {
        try {
          await supabase.from("teachers_sdn_bobong").delete().eq("id", id);
        } catch (dbErr) {
          console.error("Error direct delete from Supabase:", dbErr.message);
        }
      }
      return NextResponse.json({ success: true, message: "Data guru sudah tidak ada." });
    }

    const saved = await saveTeachers(filteredList);

    if (saved) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus data guru." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
