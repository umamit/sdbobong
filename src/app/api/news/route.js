import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { loadNews, saveNews, handlePhotoUpload, isSupabaseEnabled, supabase } from '../../../lib/database';
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
    const newsList = await loadNews();
    return NextResponse.json(newsList);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat berita: " + e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString().trim();
    const date = formData.get('date')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    let image = formData.get('image')?.toString().trim();
    const content = formData.get('content')?.toString().trim();

    // Process multiple photo uploads
    const photoFiles = formData.getAll('photos');
    let images = [];

    if (photoFiles && photoFiles.length > 0) {
      for (const file of photoFiles) {
        if (file && file instanceof File && file.size > 0) {
          const uploadedUrl = await handlePhotoUpload(file, 'news', ['png', 'jpg', 'jpeg']);
          if (uploadedUrl === 'INVALID_TYPE') {
            return NextResponse.json({ error: "Jenis file tidak valid! Hanya file PNG, JPG, dan JPEG yang diperbolehkan." }, { status: 400 });
          } else if (uploadedUrl === 'ERROR') {
            return NextResponse.json({ error: "Gagal mengunggah salah satu foto." }, { status: 500 });
          } else if (uploadedUrl && uploadedUrl !== 'NO_FILE') {
            images.push(uploadedUrl);
          }
        }
      }
    }

    // Process fallback single photo upload (for backward compatibility)
    const singlePhoto = formData.get('photo');
    if (singlePhoto && singlePhoto instanceof File && singlePhoto.size > 0) {
      const uploadedUrl = await handlePhotoUpload(singlePhoto, 'news', ['png', 'jpg', 'jpeg']);
      if (uploadedUrl === 'INVALID_TYPE') {
        return NextResponse.json({ error: "Jenis file tidak valid! Hanya file PNG, JPG, dan JPEG yang diperbolehkan." }, { status: 400 });
      } else if (uploadedUrl === 'ERROR') {
        return NextResponse.json({ error: "Gagal mengunggah foto." }, { status: 500 });
      } else if (uploadedUrl && uploadedUrl !== 'NO_FILE') {
        images.unshift(uploadedUrl); // Put single photo at the front as primary cover
      }
    }

    // Set the cover image to the first uploaded photo if we have any
    if (images.length > 0) {
      image = images[0];
    }

    if (!title || !date || !category || !image || !content) {
      return NextResponse.json({ error: "Semua kolom berita wajib diisi!" }, { status: 400 });
    }

    const newsList = await loadNews();

    // Periksa duplikat judul berita
    const duplicateNews = newsList.find(n => n.title.toLowerCase() === title.toLowerCase());
    if (duplicateNews) {
      return NextResponse.json({ error: "Berita dengan judul ini sudah diterbitkan!" }, { status: 400 });
    }

    const newArticle = {
      id: `news-${Math.floor(Date.now() / 1000)}`,
      title,
      date,
      category,
      image,
      images: images.length > 0 ? images : [image],
      content
    };

    newsList.unshift(newArticle);
    const saved = await saveNews(newsList);

    if (saved) {
      await createAuditLog('CREATE_NEWS', `Menerbitkan berita sekolah baru: "${title}"`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in news POST:", cacheErr);
      }
      return NextResponse.json({ success: true, article: newArticle });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan berita baru ke database." }, { status: 500 });
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
      return NextResponse.json({ error: "ID berita tidak ditentukan." }, { status: 400 });
    }

    const newsList = await loadNews();
    const newsToDelete = newsList.find(n => n.id === id);
    const newsTitle = newsToDelete ? newsToDelete.title : id;

    const filteredList = newsList.filter(n => n.id !== id);

    if (filteredList.length === newsList.length) {
      if (isSupabaseEnabled() && supabase) {
        try {
          await supabase.from("news_sdn_bobong").delete().eq("id", id);
        } catch (dbErr) {
          console.error("Error direct delete from Supabase:", dbErr.message);
        }
      }
      await createAuditLog('DELETE_NEWS', `Menghapus artikel berita (langsung dari DB): "${newsTitle}"`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in news DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true, message: "Artikel berita sudah tidak ada." });
    }

    const saved = await saveNews(filteredList);

    if (saved) {
      await createAuditLog('DELETE_NEWS', `Menghapus artikel berita: "${newsTitle}"`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in news DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus berita." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
