import AlumniClient from './AlumniClient';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Portal Alumni Resmi - SD Negeri Bobong',
  description: 'Direktori resmi alumni, formulir pendaftaran angkatan lulusan, dan testimoni alumni SD Negeri Bobong.',
};

export default async function AlumniPage() {
  let initialAlumni = [];
  try {
    initialAlumni = await prisma.alumni.findMany({
      where: { status: 'Approved' },
      orderBy: { id: 'desc' },
    });
  } catch (err) {
    console.error('Error fetching initial alumni:', err);
  }

  return <AlumniClient initialAlumni={initialAlumni} />;
}
