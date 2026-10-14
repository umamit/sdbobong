import { loadWebConfig, loadAchievements } from '../../lib/database';
import PrestasiClient from './PrestasiClient';

export const revalidate = 60;

export const metadata = {
  title: 'Papan Prestasi & Hall of Fame Siswa - SD Negeri Bobong',
  description: 'Daftar rekam jejak juara dan prestasi membanggakan murid SD Negeri Bobong tingkat kecamatan, kabupaten, hingga provinsi.',
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id/prestasi' }
};

export default async function PrestasiPage() {
  const [config, achievementsDb] = await Promise.all([
    loadWebConfig().catch(() => ({})),
    loadAchievements().catch(() => [])
  ]);

  const configPrestasi = config?.stats?.page_contents?.kesiswaan?.prestasi || [];
  
  // Format normalized achievements list
  const allAchievements = [
    ...configPrestasi.map((p, i) => ({
      id: `cfg-${i}`,
      title: p.title || 'Prestasi Siswa',
      level: p.level || 'Tingkat Kabupaten',
      rank: p.rank || 'Juara',
      year: (p.desc && p.desc.match(/\b(20\d{2})\b/)) ? p.desc.match(/\b(20\d{2})\b/)[1] : '2025',
      desc: p.desc || '',
      category: p.title?.toLowerCase().includes('pidato') || p.title?.toLowerCase().includes('kaligrafi') ? 'Seni & Bahasa' : 'Umum'
    })),
    ...achievementsDb.map((a, i) => ({
      id: a.id || `db-${i}`,
      title: a.title,
      level: a.level || 'Tingkat Kabupaten',
      rank: 'Juara',
      year: String(a.year || '2025'),
      desc: a.description || '',
      category: 'Akademik'
    }))
  ];

  // Remove duplicates based on title
  const uniqueAchievements = [];
  const seenTitles = new Set();
  for (const item of allAchievements) {
    const key = item.title.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueAchievements.push(item);
    }
  }

  return <PrestasiClient initialAchievements={uniqueAchievements} />;
}
