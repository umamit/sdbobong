import AlumniClient from './AlumniClient';
import { loadAlumni } from '../../lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Portal Alumni Resmi - SD Negeri Bobong',
  description: 'Direktori resmi alumni, formulir pendaftaran angkatan lulusan, dan testimoni alumni SD Negeri Bobong.',
};

export default async function AlumniPage() {
  let initialAlumni = [];
  try {
    const allAlumni = await loadAlumni().catch(() => []);
    initialAlumni = (allAlumni || []).filter(a => a.status === 'Approved');
  } catch (err) {
    console.error('Error fetching initial alumni:', err);
  }

  return <AlumniClient initialAlumni={initialAlumni} />;
}
