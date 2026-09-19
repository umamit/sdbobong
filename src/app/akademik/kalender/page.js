import { loadWebConfig } from '../../../lib/database';
import Link from 'next/link';
import CalendarClient from './CalendarClient';
import { generateEventSchema } from '../../../lib/seo-schemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Kalender Pendidikan & RPE - SD Negeri Bobong',
  description: 'Informasi kalender akademik resmi, rekapitulasi pekan efektif (RPE), hari libur nasional, dan masa ujian di SD Negeri Bobong.',
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id/akademik/kalender' }
};

export default async function KalenderPendidikanPage() {
  const config = await loadWebConfig().catch(() => ({}));
  const calendarData = config.stats?.page_contents?.akademik?.calendar || [];
  const eventSchema = generateEventSchema(calendarData);
  
  const kepalaSekolah = config.profil?.kepala_sekolah || 'HUSNITA USMAN, S.Pd., M.Pd';
  const nipKepalaSekolah = config.profil?.nip_kepala_sekolah || '19961027 201903 2 006';

  return (
    <>
      {eventSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      )}
      <CalendarClient 
        initialCalendar={calendarData} 
        kepalaSekolah={kepalaSekolah}
        nipKepalaSekolah={nipKepalaSekolah}
      />
    </>
  );
}
