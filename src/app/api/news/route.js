import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { loadNews, saveNews, handlePhotoUpload, isSupabaseEnabled, supabase } from '../../../lib/database';
import { prisma } from '../../../lib/prisma';
import { checkAuth } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';
import { handleApiDelete } from '../../../lib/api-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function GET() {
  try {
    const newsList = await loadNews(true);
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

    // Set the cover image according to selected cover index or fallback to first photo
    const selectedCoverIndex = parseInt(formData.get('selected_cover_index'), 10);
    if (!isNaN(selectedCoverIndex) && selectedCoverIndex >= 0 && selectedCoverIndex < images.length) {
      image = images[selectedCoverIndex];
    } else if (images.length > 0) {
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
        revalidatePath('/berita');
        revalidatePath(`/berita/${newArticle.id}`);
        revalidatePath('/sitemap.xml');
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

export async function PUT(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();
    const title = formData.get('title')?.toString().trim();
    const date = formData.get('date')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    let image = formData.get('image')?.toString().trim();
    const content = formData.get('content')?.toString().trim();

    if (!id) {
      return NextResponse.json({ error: "ID berita tidak ditentukan." }, { status: 400 });
    }

    if (!title || !date || !category || !content) {
      return NextResponse.json({ error: "Semua kolom berita wajib diisi!" }, { status: 400 });
    }

    const newsList = await loadNews();
    const newsIndex = newsList.findIndex(n => n.id === id);

    if (newsIndex === -1) {
      return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
    }

    // Parse existing images if provided (from image manager)
    let preservedImages = [];
    const existingImagesRaw = formData.get('existingImages')?.toString();
    if (existingImagesRaw) {
      try {
        const parsed = JSON.parse(existingImagesRaw);
        if (Array.isArray(parsed)) preservedImages = parsed;
      } catch (e) {
        preservedImages = [];
      }
    } else {
      preservedImages = newsList[newsIndex].images || [newsList[newsIndex].image].filter(Boolean);
    }

    // Process multiple photo uploads
    const photoFiles = formData.getAll('photos');
    let newlyUploadedImages = [];

    if (photoFiles && photoFiles.length > 0) {
      for (const file of photoFiles) {
        if (file && file instanceof File && file.size > 0) {
          const uploadedUrl = await handlePhotoUpload(file, 'news', ['png', 'jpg', 'jpeg']);
          if (uploadedUrl === 'INVALID_TYPE') {
            return NextResponse.json({ error: "Jenis file tidak valid! Hanya file PNG, JPG, dan JPEG yang diperbolehkan." }, { status: 400 });
          } else if (uploadedUrl === 'ERROR') {
            return NextResponse.json({ error: "Gagal mengunggah salah satu foto." }, { status: 500 });
          } else if (uploadedUrl && uploadedUrl !== 'NO_FILE') {
            newlyUploadedImages.push(uploadedUrl);
          }
        }
      }
    }

    // Combine preserved existing images with newly uploaded images
    const combinedImages = [...preservedImages, ...newlyUploadedImages];
    const selectedCoverImage = formData.get('selected_cover_image')?.toString().trim();
    const selectedCoverIndex = parseInt(formData.get('selected_cover_index'), 10);

    if (combinedImages.length > 0) {
      if (selectedCoverImage && combinedImages.includes(selectedCoverImage)) {
        image = selectedCoverImage;
      } else if (!isNaN(selectedCoverIndex) && selectedCoverIndex >= 0 && selectedCoverIndex < combinedImages.length) {
        image = combinedImages[selectedCoverIndex];
      } else {
        image = combinedImages[0];
      }
      images = combinedImages;
    } else {
      image = image || newsList[newsIndex].image || '/images/news_hari_guru.svg';
      images = [image];
    }

    newsList[newsIndex].title = title;
    newsList[newsIndex].date = date;
    newsList[newsIndex].category = category;
    newsList[newsIndex].image = image;
    newsList[newsIndex].images = images;
    newsList[newsIndex].content = content;

    const saved = await saveNews(newsList);

    if (saved) {
      await createAuditLog('UPDATE_NEWS', `Memperbarui artikel berita sekolah: "${title}"`, request);
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/berita');
        revalidatePath(`/berita/${id}`);
        revalidatePath('/sitemap.xml');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in news PUT:", cacheErr);
      }
      return NextResponse.json({ success: true, article: newsList[newsIndex] });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan perubahan berita." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID berita tidak ditentukan." }, { status: 400 });
    }

    return handleApiDelete({
      request,
      id,
      loadFn: loadNews,
      saveFn: saveNews,
      prismaModel: prisma.news,
      auditAction: 'DELETE_NEWS',
      getItemName: (n) => n.title,
      revalidatePaths: ['/', '/berita', `/berita/${id}`, '/sitemap.xml', '/admin/dashboard']
    });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
