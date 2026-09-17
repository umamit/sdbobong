import QuizClient from './QuizClient';

export const metadata = {
  title: 'Kuis Cerdas Cermat | SDN Bobong',
  description: 'Uji pengetahuanmu dengan Kuis Edukasi Cerdas Cermat SDN Bobong! Soal AI interaktif untuk siswa SD — Matematika, IPA, Bahasa Indonesia, dan Sejarah Maluku.',
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id/akademik/kuis' }
};

export default function KuisPage() {
  return <QuizClient />;
}
