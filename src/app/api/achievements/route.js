import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { loadAchievements, saveAchievements, supabase, isSupabaseEnabled } from '../../../lib/database';
import { verifyAdminToken } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAuth() {
  try {
    const cookieStore = await cookies();
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
    const achievementsList = await loadAchievements();
    return NextResponse.json(achievementsList);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat data prestasi: " + e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = body.title?.trim();
    const level = body.level?.trim();
    const year = body.year?.trim();
    const description = body.description?.trim();

    if (!title || !level || !year || !description) {
      return NextResponse.json({ error: "Kolom Judul, Tingkat, Tahun, dan Deskripsi wajib diisi!" }, { status: 400 });
    }

    const achievementsList = await loadAchievements();

    const newAchievement = {
      id: `achievement-${Math.floor(Date.now() / 1000)}`,
      title,
      level,
      year,
      description
    };

    achievementsList.push(newAchievement);

    const saved = await saveAchievements(achievementsList);

    if (saved) {
      await createAuditLog('CREATE_ACHIEVEMENT', `Menambahkan prestasi sekolah baru: "${title}" tingkat ${level}`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in achievements POST:", cacheErr);
      }
      return NextResponse.json({ success: true, achievement: newAchievement });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data prestasi ke database." }, { status: 500 });
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
    const body = await request.json();
    const id = body.id?.trim();
    const title = body.title?.trim();
    const level = body.level?.trim();
    const year = body.year?.trim();
    const description = body.description?.trim();

    if (!id) {
      return NextResponse.json({ error: "ID prestasi tidak ditentukan." }, { status: 400 });
    }

    if (!title || !level || !year || !description) {
      return NextResponse.json({ error: "Kolom Judul, Tingkat, Tahun, dan Deskripsi wajib diisi!" }, { status: 400 });
    }

    const achievementsList = await loadAchievements();
    const achIndex = achievementsList.findIndex(a => a.id === id);

    if (achIndex === -1) {
      return NextResponse.json({ error: "Data prestasi tidak ditemukan." }, { status: 404 });
    }

    achievementsList[achIndex].title = title;
    achievementsList[achIndex].level = level;
    achievementsList[achIndex].year = year;
    achievementsList[achIndex].description = description;

    const saved = await saveAchievements(achievementsList);

    if (saved) {
      await createAuditLog('UPDATE_ACHIEVEMENT', `Memperbarui prestasi sekolah: "${title}" tingkat ${level}`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in achievements PUT:", cacheErr);
      }
      return NextResponse.json({ success: true, achievement: achievementsList[achIndex] });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan perubahan data prestasi." }, { status: 500 });
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
      return NextResponse.json({ error: "ID prestasi tidak ditentukan." }, { status: 400 });
    }

    const achievementsList = await loadAchievements();
    const achievementToDelete = achievementsList.find(a => a.id === id);
    const achievementTitle = achievementToDelete ? achievementToDelete.title : id;
    const achievementLevel = achievementToDelete ? ` (${achievementToDelete.level})` : '';

    const filteredList = achievementsList.filter(a => a.id !== id);

    if (filteredList.length === achievementsList.length) {
      if (isSupabaseEnabled() && supabase) {
        try {
          await supabase.from("achievements_sdn_bobong").delete().eq("id", id);
        } catch (dbErr) {
          console.error("Error direct delete from Supabase:", dbErr.message);
        }
      }
      await createAuditLog('DELETE_ACHIEVEMENT', `Menghapus prestasi sekolah (langsung dari DB): "${achievementTitle}"${achievementLevel}`, request);
      return NextResponse.json({ success: true, message: "Data prestasi sudah tidak ada." });
    }

    const saved = await saveAchievements(filteredList);

    if (saved) {
      await createAuditLog('DELETE_ACHIEVEMENT', `Menghapus prestasi sekolah: "${achievementTitle}"${achievementLevel}`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in achievements DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus data prestasi." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
