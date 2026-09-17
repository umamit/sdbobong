const currentYear = new Date().getFullYear();

export const metadata = {
  title: 'Formulir Pendaftaran PPDB Online - SD Negeri Bobong',
  description: `Isi dan kirim formulir pendaftaran online calon siswa baru SD Negeri Bobong Tahun Ajaran ${currentYear}/${currentYear + 1} secara daring dan transparan.`,
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id/ppdb-online' }
};

export default function PPDBOnlineLayout({ children }) {
  return children;
}
