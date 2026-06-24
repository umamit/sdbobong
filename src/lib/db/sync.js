import fs from 'fs';
import { supabase, isSupabaseEnabled, PENDAFTARAN_JSON, packBerkasIntoAlamat, unpackBerkasFromAlamat } from './core.js';

let cachedSupabaseColumns = null;

export async function getAvailableSupabaseColumns() {
  if (cachedSupabaseColumns) return cachedSupabaseColumns;
  const defaultColumns = ['id','nama_lengkap','nik_siswa','tempat_lahir','tanggal_lahir','jenis_kelamin','nama_ibu_kandung','nomor_hp_orangtua','alamat_domisili','jalur_ppdb','waktu_daftar','status'];
  if (!supabase || !isSupabaseEnabled()) { cachedSupabaseColumns = defaultColumns; return defaultColumns; }
  try {
    const newColumns = ['nama_panggilan','agama','anak_ke','dari_bersaudara','nama_ayah','pekerjaan_ayah','no_hp_ayah','pekerjaan_ibu','no_hp_ibu','nama_wali','pekerjaan_wali','tahun_ajaran','berkas_kk','berkas_akta','berkas_ktp','berkas_sptjm','berkas_kip','berkas_ijazah'];
    const { error: probeError } = await supabase.from("ppdb_sdn_bobong").select(`id, ${newColumns.join(', ')}`).limit(0);
    if (!probeError) { cachedSupabaseColumns = [...defaultColumns, ...newColumns]; return cachedSupabaseColumns; }
    const existing = [...defaultColumns];
    for (const col of newColumns) {
      const { error: colError } = await supabase.from("ppdb_sdn_bobong").select(col).limit(0);
      if (!colError) existing.push(col);
    }
    cachedSupabaseColumns = existing;
    return existing;
  } catch (e) { console.error("Error probing Supabase columns:", e); cachedSupabaseColumns = defaultColumns; return defaultColumns; }
}

export function loadLocalStatuses() {
  const localStatuses = {};
  if (fs.existsSync(PENDAFTARAN_JSON)) {
    try {
      const localData = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
      for (const ld of localData) {
        const nik = ld.nik || ld.nik_siswa;
        if (nik) localStatuses[String(nik)] = ld.status || "Diterima Sistem";
      }
    } catch (e) { console.error("Error loading local statuses:", e); }
  }
  return localStatuses;
}

export async function syncLocalToSupabase() {
  if (!isSupabaseEnabled()) return;
  let localRecords = [];
  if (fs.existsSync(PENDAFTARAN_JSON)) {
    try { localRecords = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8')); }
    catch (e) { console.error("Error reading local pendaftaran file:", e); }
  }
  const localByNik = {};
  for (const r of localRecords) {
    const nik = String(r.nik || r.nik_siswa || "").trim();
    if (nik) localByNik[nik] = r;
  }
  try {
    const { data: supabaseRecords, error } = await supabase.from("ppdb_sdn_bobong").select("*");
    if (error) throw error;
    const supabaseByNik = {};
    for (const r of (supabaseRecords || [])) {
      const nik = String(r.nik_siswa || r.nik || "").trim();
      if (nik) supabaseByNik[nik] = r;
    }
    let syncedToSupabaseCount = 0;
    const availableCols = await getAvailableSupabaseColumns();
    for (const [nik, localR] of Object.entries(localByNik)) {
      if (!supabaseByNik[nik]) {
        const fullMap = {
          nama_lengkap: localR.nama_lengkap || "", nik_siswa: nik, tempat_lahir: localR.tempat_lahir || "",
          tanggal_lahir: localR.tanggal_lahir || "", jenis_kelamin: localR.jenis_kelamin || "",
          nama_ibu_kandung: localR.nama_ibu || localR.nama_ibu_kandung || "",
          alamat_domisili: localR.alamat || localR.alamat_domisili || "",
          nomor_hp_orangtua: localR.no_hp || localR.nomor_hp_orangtua || "",
          jalur_ppdb: localR.jalur_ppdb || "Zonasi",
          waktu_daftar: localR.waktu_daftar || new Date().toISOString().replace('T',' ').split('.')[0],
          status: localR.status || "Diterima Sistem",
          tahun_ajaran: localR.tahun_ajaran || (localR.waktu_daftar && /^\d{4}/.test(localR.waktu_daftar) ? `${localR.waktu_daftar.substring(0,4)}/${parseInt(localR.waktu_daftar.substring(0,4),10)+1}` : "2026/2027"),
          nama_panggilan: localR.nama_panggilan || "", agama: localR.agama || "",
          anak_ke: localR.anak_ke ? parseInt(localR.anak_ke, 10) : null,
          dari_bersaudara: localR.dari_bersaudara ? parseInt(localR.dari_bersaudara, 10) : null,
          nama_ayah: localR.nama_ayah || "", pekerjaan_ayah: localR.pekerjaan_ayah || "", no_hp_ayah: localR.no_hp_ayah || "",
          pekerjaan_ibu: localR.pekerjaan_ibu || "", no_hp_ibu: localR.no_hp_ibu || "",
          nama_wali: localR.nama_wali || "", pekerjaan_wali: localR.pekerjaan_wali || "",
          berkas_kk: localR.berkas_kk || "", berkas_akta: localR.berkas_akta || "", berkas_ktp: localR.berkas_ktp || "",
          berkas_sptjm: localR.berkas_sptjm || "", berkas_kip: localR.berkas_kip || "", berkas_ijazah: localR.berkas_ijazah || ""
        };
        const supabaseData = {};
        for (const [col, val] of Object.entries(fullMap)) { if (availableCols.includes(col)) supabaseData[col] = val; }
        const missingBerkasCols = ['berkas_kk','berkas_akta','berkas_ktp','berkas_sptjm','berkas_kip','berkas_ijazah'].some(c => !availableCols.includes(c));
        if (missingBerkasCols) {
          const berkasData = { berkas_kk: localR.berkas_kk||"", berkas_akta: localR.berkas_akta||"", berkas_ktp: localR.berkas_ktp||"", berkas_sptjm: localR.berkas_sptjm||"", berkas_kip: localR.berkas_kip||"", berkas_ijazah: localR.berkas_ijazah||"" };
          supabaseData.alamat_domisili = packBerkasIntoAlamat(localR.alamat || localR.alamat_domisili || "", berkasData);
        }
        try { await supabase.from("ppdb_sdn_bobong").insert(supabaseData); syncedToSupabaseCount++; }
        catch (e) {
          if (supabaseData.status) delete supabaseData.status;
          try { await supabase.from("ppdb_sdn_bobong").insert(supabaseData); syncedToSupabaseCount++; }
          catch (e2) { console.error(`Failed syncing local record NIK ${nik} to Supabase:`, e2.message || e2); }
        }
      } else {
        const supabaseR = supabaseByNik[nik];
        const localStatus = localR.status, supabaseStatus = supabaseR.status;
        if (localStatus !== supabaseStatus) {
          if (["Terverifikasi","Ditolak"].includes(localStatus) && !["Terverifikasi","Ditolak"].includes(supabaseStatus)) {
            try { await supabase.from("ppdb_sdn_bobong").update({ status: localStatus }).eq("nik_siswa", nik); } catch (e) {}
          } else if (["Terverifikasi","Ditolak"].includes(supabaseStatus) && !["Terverifikasi","Ditolak"].includes(localStatus)) {
            localR.status = supabaseStatus;
          }
        }
      }
    }
    for (const [nik, supabaseR] of Object.entries(supabaseByNik)) {
      const unpackedAlamat = unpackBerkasFromAlamat(supabaseR.alamat_domisili || "");
      const localFormat = {
        id: String(supabaseR.id), nama_lengkap: supabaseR.nama_lengkap||"", nama_panggilan: supabaseR.nama_panggilan||"",
        nik, tempat_lahir: supabaseR.tempat_lahir||"", tanggal_lahir: supabaseR.tanggal_lahir||"",
        jenis_kelamin: supabaseR.jenis_kelamin||"", agama: supabaseR.agama||"",
        anak_ke: supabaseR.anak_ke != null ? String(supabaseR.anak_ke) : "",
        dari_bersaudara: supabaseR.dari_bersaudara != null ? String(supabaseR.dari_bersaudara) : "",
        alamat: unpackedAlamat.cleanAlamat||"", jalur_ppdb: supabaseR.jalur_ppdb||"Zonasi",
        nama_ayah: supabaseR.nama_ayah||"", pekerjaan_ayah: supabaseR.pekerjaan_ayah||"", no_hp_ayah: supabaseR.no_hp_ayah||"",
        nama_ibu: supabaseR.nama_ibu_kandung||"", pekerjaan_ibu: supabaseR.pekerjaan_ibu||"", no_hp_ibu: supabaseR.no_hp_ibu||"",
        no_hp: supabaseR.nomor_hp_orangtua||"", nama_wali: supabaseR.nama_wali||"", pekerjaan_wali: supabaseR.pekerjaan_wali||"",
        waktu_daftar: supabaseR.waktu_daftar||"", status: supabaseR.status||"Diterima Sistem", tahun_ajaran: supabaseR.tahun_ajaran||"",
        berkas_kk: supabaseR.berkas_kk||unpackedAlamat.berkas.berkas_kk||"",
        berkas_akta: supabaseR.berkas_akta||unpackedAlamat.berkas.berkas_akta||"",
        berkas_ktp: supabaseR.berkas_ktp||unpackedAlamat.berkas.berkas_ktp||"",
        berkas_sptjm: supabaseR.berkas_sptjm||unpackedAlamat.berkas.berkas_sptjm||"",
        berkas_kip: supabaseR.berkas_kip||unpackedAlamat.berkas.berkas_kip||"",
        berkas_ijazah: supabaseR.berkas_ijazah||unpackedAlamat.berkas.berkas_ijazah||""
      };
      if (localFormat.waktu_daftar?.includes('T')) {
        try { localFormat.waktu_daftar = localFormat.waktu_daftar.replace('T',' ').split('+')[0].split('.')[0]; } catch (e) {}
      }
      if (localByNik[nik]) {
        const existingLocal = localByNik[nik];
        if (["Terverifikasi","Ditolak"].includes(existingLocal.status)) localFormat.status = existingLocal.status;
        localByNik[nik] = { ...existingLocal, ...localFormat };
      } else { localByNik[nik] = localFormat; }
    }
    const mergedRecords = Object.values(localByNik);
    mergedRecords.sort((a, b) => (b.waktu_daftar||"").localeCompare(a.waktu_daftar||""));
    try { fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify(mergedRecords, null, 4), 'utf-8'); if (syncedToSupabaseCount > 0) console.log(`Sync: ${syncedToSupabaseCount} local records uploaded to Supabase.`); }
    catch (e) { console.error("Error saving merged records locally:", e); }
  } catch (e) { console.error("Error during Supabase sync check:", e.message || e); }
}
