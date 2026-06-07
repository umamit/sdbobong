import EditTeacherClient from './EditTeacherClient';
import { loadTeachers } from '../../../../../lib/database';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditTeacherPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const teachers = await loadTeachers();
  const teacher = teachers.find(t => t.id === id);

  if (!teacher) {
    notFound();
  }

  return (
    <EditTeacherClient teacher={teacher} />
  );
}
