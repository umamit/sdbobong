import AdminDashboardClient from './AdminDashboardClient';
import { loadWebConfig, loadNews, loadTeachers, syncLocalToSupabase, loadLocalStatuses, PENDAFTARAN_JSON, supabase } from '../../../lib/database';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. Sync local status with Supabase on dashboard access
  await syncLocalToSupabase();

  // 2. Fetch config, news, and teachers
  const config = loadWebConfig();
  const newsList = await loadNews();
  const teachers = await loadTeachers();

  // 3. Load PPDB records
  let records = [];
  let dbStatus = false;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("ppdb_sdn_bobong")
        .select("*")
        .order("waktu_daftar", { ascending: false });
      
      if (!error && data) {
        records = data;
        dbStatus = true;
      }
    } catch (e) {
      console.error("Error querying Supabase for admin dashboard page:", e);
    }
  }

  if (records.length === 0) {
    if (fs.existsSync(PENDAFTARAN_JSON)) {
      try {
        const localData = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
        records = localData.map((r, idx) => ({
          id: r.id || r.nik || r.nik_siswa || String(idx + 1),
          nama_lengkap: r.nama_lengkap || "",
          nik_siswa: r.nik || r.nik_siswa || "",
          tempat_lahir: r.tempat_lahir || "",
          tanggal_lahir: r.tanggal_lahir || "",
          jenis_kelamin: r.jenis_kelamin || "",
          nama_ibu_kandung: r.nama_ibu || r.nama_ibu_kandung || "",
          nomor_hp_orangtua: r.no_hp || r.nomor_hp_orangtua || "",
          alamat_domisili: r.alamat || r.alamat_domisili || "",
          jalur_ppdb: r.jalur_ppdb || "",
          waktu_daftar: r.waktu_daftar || "",
          status: r.status || "Diterima Sistem"
        }));
        records.sort((a, b) => (b.waktu_daftar || "").localeCompare(a.waktu_daftar || ""));
      } catch (e) {
        console.error("Error reading JSON fallback for admin page:", e);
      }
    }
  }

  // 4. Overlay local status
  const localStatuses = loadLocalStatuses();
  records = records.map(r => {
    const r_id = r.id || r.nik_siswa || r.nik;
    const nik = r.nik_siswa || r.nik;
    let status = r.status;
    if (!status || status === "Diterima Sistem") {
      if (nik && localStatuses[String(nik)]) {
        status = localStatuses[String(nik)];
      }
    }
    if (!status) status = "Diterima Sistem";
    return {
      ...r,
      id: r_id,
      status: status
    };
  });

  return (
    <AdminDashboardClient
      initialConfig={config}
      initialNewsList={newsList}
      initialTeachers={teachers}
      initialRecords={records}
      dbStatus={dbStatus}
    />
  );
}
