import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkAuth } from './auth';
import { createAuditLog } from './audit';
import { isSupabaseEnabled } from './database';

/**
 * Common handler for DELETE API requests to reduce duplication.
 */
export async function handleApiDelete({
  request,
  id,
  loadFn,
  saveFn,
  prismaModel,
  auditAction,
  getItemName,
  revalidatePaths = []
}) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const list = await loadFn();
    const itemToDelete = list.find(item => item.id === id);
    const itemName = itemToDelete ? getItemName(itemToDelete) : id;
    
    const filteredList = list.filter(item => item.id !== id);

    if (filteredList.length === list.length) {
      if (isSupabaseEnabled() && prismaModel) {
        try {
          await prismaModel.deleteMany({ where: { id } });
        } catch (dbErr) {
          console.error("Error direct delete from database via Prisma:", dbErr.message || dbErr);
        }
      }
      await createAuditLog(auditAction, `Menghapus (langsung dari DB): "${itemName}"`, request);
      return NextResponse.json({ success: true, message: "Data sudah tidak ada." });
    }

    const saved = await saveFn(filteredList);
    if (saved) {
      await createAuditLog(auditAction, `Menghapus: "${itemName}"`, request);
      for (const p of revalidatePaths) {
        try {
          revalidatePath(p);
        } catch (cacheErr) {
          console.error(`Cache revalidation failed in delete helper for path ${p}:`, cacheErr);
        }
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Gagal menghapus data dari berkas penyimpanan." }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
