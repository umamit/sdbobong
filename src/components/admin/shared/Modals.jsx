'use client';


import TeacherModals from './modals/TeacherModals';
import PpdbModals from './modals/PpdbModals';
import EventModals from './modals/EventModals';
import ContentUtilityModals from './modals/ContentUtilityModals';
import StudentModals from './modals/StudentModals';
import GraduationModals from './modals/GraduationModals';
import SystemModals from './modals/SystemModals';

export default function Modals() {
  return (
    <>
      <TeacherModals />
      <PpdbModals />
      <EventModals />
      <ContentUtilityModals />
      <StudentModals />
      <GraduationModals />
      <SystemModals />
    </>
  );
}
