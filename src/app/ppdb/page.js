import { supabase, syncLocalToSupabase, loadLocalStatuses, PENDAFTARAN_JSON, anonymizeName, cleanAddress, formatWaktuDaftar, loadWebConfig } from '../../lib/database';
import fs from 'fs';
import PPDBPortal from '../../components/PPDBPortal';

export const revalidate = 0; // Dynamic server page

export default async function PPDBPage() {
  // Try to sync database records on page load
  try {
    await syncLocalToSupabase();
  } catch (e) {
    console.error("Database sync failed on load:", e);
  }

  let records = [];

  // Fetch data from Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("ppdb_sdn_bobong")
        .select("nama_lengkap, jalur_ppdb, alamat_domisili, waktu_daftar, nik_siswa, status");
      if (error) throw error;
      if (data) records = data;
    } catch (e) {
      console.warn("Supabase query with status failed, attempting without status column:", e.message || e);
      try {
        const { data, error } = await supabase
          .from("ppdb_sdn_bobong")
          .select("nama_lengkap, jalur_ppdb, alamat_domisili, waktu_daftar, nik_siswa");
        if (error) throw error;
        if (data) records = data;
      } catch (e2) {
        console.error("Error querying Supabase completely for PPDB:", e2.message || e2);
      }
    }
  }

  // Fallback to local JSON file if empty or query failed
  if (records.length === 0) {
    if (fs.existsSync(PENDAFTARAN_JSON)) {
      try {
        const localData = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
        records = localData.map(r => ({
          nama_lengkap: r.nama_lengkap || "",
          nik_siswa: r.nik || r.nik_siswa || "",
          jalur_ppdb: r.jalur_ppdb || "",
          alamat_domisili: r.alamat || r.alamat_domisili || "",
          waktu_daftar: r.waktu_daftar || "",
          status: r.status || "Diterima Sistem"
        }));
      } catch (e) {
        console.error("Error reading pendaftaran JSON fallback:", e);
      }
    }
  }

  // Sort pendaftaran list (newest first)
  records.sort((a, b) => {
    const dateA = a.waktu_daftar || "";
    const dateB = b.waktu_daftar || "";
    return dateB.localeCompare(dateA);
  });

  const localStatuses = loadLocalStatuses();

  // Process and filter records for public display
  const pendaftarList = [];
  for (const r of records) {
    const nik = r.nik_siswa || r.nik;
    let status = r.status;

    // Overlay status cache
    if (!status || status === "Diterima Sistem") {
      if (nik && localStatuses[String(nik)]) {
        status = localStatuses[String(nik)];
      }
    }
    if (!status) status = "Diterima Sistem";

    // Hide rejected applications from public view
    if (status === "Ditolak") continue;

    pendaftarList.push({
      nama_lengkap: anonymizeName(r.nama_lengkap),
      jalur_ppdb: r.jalur_ppdb || "Zonasi",
      alamat_domisili: cleanAddress(r.alamat_domisili),
      waktu_daftar: formatWaktuDaftar(r.waktu_daftar),
      status: status
    });
  }

  const config = await loadWebConfig();

  return <PPDBPortal pendaftarList={pendaftarList} config={config} />;
}
