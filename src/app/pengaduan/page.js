import PengaduanClient from './PengaduanClient';

export const metadata = {
  title: 'Layanan Pengaduan & Aspirasi Ramah Anak - SD Negeri Bobong',
  description: 'Saluran resmi pengaduan, aspirasi, dan pencegahan perundungan (anti-bullying) yang aman, rahasia, dan terpercaya bagi murid dan wali murid SD Negeri Bobong.',
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id/pengaduan' }
};

export default function PengaduanPage() {
  return <PengaduanClient />;
}
