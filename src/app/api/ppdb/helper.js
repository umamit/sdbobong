import { loadWebConfig } from '../../../lib/database';

export function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function getAcademicYear(dateStr) {
  if (dateStr && /^\d{4}/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    return `${year}/${year + 1}`;
  }
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
}

export async function sendWhatsAppNotification(pendaftar, status) {
  try {
    const config = await loadWebConfig();
    const gateway = config.stats?.wa_gateway;
    if (!gateway || !gateway.enabled) {
      return;
    }

    const phone = pendaftar.nomor_hp_orangtua || pendaftar.no_hp_ibu || pendaftar.no_hp_ayah;
    if (!phone) {
      return;
    }

    // Clean phone number (convert 08... to 628...)
    let cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const parentName = pendaftar.nama_ibu_kandung || pendaftar.nama_ayah || 'Orang Tua/Wali';
    const studentName = pendaftar.nama_lengkap || 'Calon Siswa';
    const pathJalur = pendaftar.jalur_ppdb || 'Zonasi';

    let template = '';
    if (status === 'Terverifikasi') {
      template = gateway.message_template_verified || 
        "Halo *[NAMA_ORANGTUA]*, pendaftaran PPDB putra/putri Anda *[NAMA_SISWA]* (Jalur *[JALUR]*) di SD Negeri Bobong telah diverifikasi dan **DITERIMA**. Silakan datang ke sekolah untuk proses verifikasi dokumen fisik dan daftar ulang.";
    } else if (status === 'Ditolak') {
      template = gateway.message_template_rejected || 
        "Halo *[NAMA_ORANGTUA]*, mohon maaf pendaftaran PPDB putra/putri Anda *[NAMA_SISWA]* di SD Negeri Bobong **DITOLAK**. Silakan hubungi operator sekolah untuk informasi lebih lanjut mengenai kelengkapan berkas.";
    } else {
      return; // Only send notifications for Terverifikasi and Ditolak statuses
    }

    // Replace placeholders
    const message = template
      .replace(/\[NAMA_ORANGTUA\]/g, parentName)
      .replace(/\[NAMA_SISWA\]/g, studentName)
      .replace(/\[JALUR\]/g, pathJalur);

    const gatewayUrl = gateway.url || 'https://api.fonnte.com/send';
    const token = gateway.token || '';
    const provider = gateway.provider || 'fonnte';

    let bodyData;
    let headers = {
      'Content-Type': 'application/json'
    };

    if (provider === 'fonnte') {
      headers['Authorization'] = token;
      bodyData = JSON.stringify({
        target: cleanPhone,
        message: message
      });
    } else if (provider === 'wablas') {
      headers['Authorization'] = token;
      bodyData = JSON.stringify({
        phone: cleanPhone,
        message: message
      });
    } else {
      // Custom webhook / generic provider
      bodyData = JSON.stringify({
        phone: cleanPhone,
        message: message,
        parent_name: parentName,
        student_name: studentName,
        status: status
      });
    }

    const res = await fetch(gatewayUrl, {
      method: 'POST',
      headers: headers,
      body: bodyData,
      signal: AbortSignal.timeout(8000)
    });

    await res.text();
  } catch (err) {
    console.error("Failed to send WA notification:", err);
  }
}
