export const JADWAL_PIKET_DATA = [
  {
    hari: 'Senin',
    hariIndex: 1,
    jam: '07.00 - 12.45 WIT',
    koordinator: 'DJAYANI A. GAFAR, A.Ma',
    anggota: ['RINI LAILA, S.Pd., Gr', 'Jumraeni La Mbone', 'KRISMAN'],
    posLayanan: 'Pintu Gerbang Utama & Ruang Guru Lantai 1',
    tugas: 'Penyambutan siswa pagi, penertiban upacara bendera, dan penerimaan tamu wali murid.'
  },
  {
    hari: 'Selasa',
    hariIndex: 2,
    jam: '07.15 - 12.30 WIT',
    koordinator: 'SUKMA ANI, S.Pd., Gr',
    anggota: ['AYU LESTARI, S.Pd., Gr', 'YUSNIAR, S.Pd., Gr.'],
    posLayanan: 'Ruang Kantor / Administrasi Lantai 1',
    tugas: 'Pemeriksaan presensi harian, penanganan kesehatan dasar UKS, dan layanan tamu dinas/umum.'
  },
  {
    hari: 'Rabu',
    hariIndex: 3,
    jam: '07.15 - 12.30 WIT',
    koordinator: 'MARDIANA, S.Pd',
    anggota: ['WA ODE SAMRIDA', 'Surahmi Wambes, S.Pd'],
    posLayanan: 'Lobi Masuk Gedung Utama',
    tugas: 'Pengawasan disiplin jam istirahat, literasi baca saung, dan informasi administrasi siswa.'
  },
  {
    hari: 'Kamis',
    hariIndex: 4,
    jam: '07.15 - 12.30 WIT',
    koordinator: 'Wa Sutini Idris',
    anggota: ['SURYANI NARIA, Ma.Pd', 'MAHARUDIN, S.Pd., Gr'],
    posLayanan: 'Selasar Gedung & Meja Informasi',
    tugas: 'Pengawasan KBM luar kelas, pemantauan ketertiban sarana, dan pengurusan surat izin siswa.'
  },
  {
    hari: 'Jumat',
    hariIndex: 5,
    jam: '07.00 - 11.30 WIT',
    koordinator: 'Siti Rahmatia',
    anggota: ['SISKA ANDAYANI, S.Pd', 'RADIA MANOMPO, S.Pd.'],
    posLayanan: 'Lapangan Sekolah & Ruang Guru',
    tugas: 'Koordinasi senam/kebersihan pagi, ibadah Jumat, serta penyampaian aspirasi orang tua.'
  },
  {
    hari: 'Sabtu',
    hariIndex: 6,
    jam: '07.15 - 12.00 WIT',
    koordinator: 'Hasnia La Kepe',
    anggota: ['SUKMAWATI ARSAN, S.Pd.I'],
    posLayanan: 'Pusat Layanan Kesiswaan & Ekstrakurikuler',
    tugas: 'Pendampingan kegiatan ekstrakurikuler Pramuka/Seni, koordinasi kepulangan, dan piket berkala.'
  }
];

export function getPiketHariIni(customSchedule = null) {
  const now = new Date();
  const dayIndex = now.getDay(); // 0 = Minggu, 1 = Senin, ... 6 = Sabtu
  if (dayIndex === 0) {
    return {
      isLibur: true,
      hari: 'Minggu',
      pesan: 'Hari Minggu adalah hari libur kegiatan belajar mengajar (KBM). Layanan kantor kembali aktif hari Senin pukul 07.15 WIT.'
    };
  }
  const scheduleList = (Array.isArray(customSchedule) && customSchedule.length > 0)
    ? customSchedule
    : JADWAL_PIKET_DATA;
  const match = scheduleList.find(p => p.hariIndex === dayIndex) || JADWAL_PIKET_DATA.find(p => p.hariIndex === dayIndex);
  return {
    isLibur: false,
    ...match
  };
}
