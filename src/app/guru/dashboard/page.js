import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyTeacherToken } from '../../../lib/auth';
import { loadStudents } from '../../../lib/database';
import GuruDashboardClient from './GuruDashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GuruDashboardPage() {
  // 1. Get teacher session cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('teacher_session_token')?.value;

  // 2. Verify teacher session
  const teacherInfo = await verifyTeacherToken(token);
  if (!teacherInfo) {
    redirect('/guru/login');
  }

  // 3. Load students list
  const studentsList = await loadStudents();

  return (
    <GuruDashboardClient 
      initialTeacher={teacherInfo} 
      initialStudents={studentsList} 
    />
  );
}
