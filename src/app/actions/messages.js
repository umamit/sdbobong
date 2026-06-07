'use server';

import { revalidatePath } from 'next/cache';
import { loadMessages, saveMessages } from '../../lib/database';

export async function submitMessageAction(formData) {
  try {
    const name = formData.name?.trim();
    const role = formData.role?.trim();
    const type = formData.type?.trim(); // 'guestbook' or 'feedback'
    const message = formData.message?.trim();

    if (!name || !role || !type || !message) {
      return { error: "Semua kolom formulir wajib diisi!" };
    }

    if (!['guestbook', 'feedback'].includes(type)) {
      return { error: "Tipe pesan tidak valid!" };
    }

    const allowedRoles = ['Alumni', 'Wali Murid', 'Masyarakat', 'Siswa'];
    if (!allowedRoles.includes(role)) {
      return { error: "Kategori pengirim tidak valid!" };
    }

    const allMessages = await loadMessages();
    const newMsg = {
      id: `msg-${Date.now()}`,
      name,
      role,
      type,
      message,
      status: 'pending', // must be moderated by admin
      date: new Date().toISOString()
    };

    allMessages.unshift(newMsg);
    const saved = await saveMessages(allMessages);

    if (saved) {
      try {
        revalidatePath('/buku-tamu');
      } catch (cacheErr) {
        console.error("Cache revalidation error in server action:", cacheErr);
      }
      return { success: true, message: newMsg };
    } else {
      return { error: "Gagal menyimpan pesan ke database." };
    }
  } catch (e) {
    return { error: "Terjadi kesalahan server: " + e.message };
  }
}
