import { loadWebConfig } from '../../lib/database';
import PerpustakaanClient from './PerpustakaanClient';

export const revalidate = 60;

export const metadata = {
  title: 'Perpustakaan Digital & Buku SIBI - SD Negeri Bobong',
  description: 'Pusat literasi dan perpustakaan digital SD Negeri Bobong: katalog buku teks Kurikulum Merdeka (SIBI) kelas 1-6 dan koleksi buku bacaan anak.',
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id/perpustakaan' }
};

export default async function PerpustakaanPage() {
  const config = (await loadWebConfig().catch(err => {
    console.error('Error loadWebConfig in Perpustakaan:', err);
    return {};
  })) || {};

  const allDownloads = config.downloads || [];
  const sibiBooks = allDownloads.filter(d => d.category === 'Buku SIBI');

  return <PerpustakaanClient sibiBooks={sibiBooks} />;
}
