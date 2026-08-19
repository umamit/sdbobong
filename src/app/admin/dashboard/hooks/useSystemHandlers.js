"use client";

import useOverviewHandlers from './useOverviewHandlers';
import useSecurityHandlers from './useSecurityHandlers';
import useBackupHandlers from './useBackupHandlers';

export default function useSystemHandlers(props) {
  const overview = useOverviewHandlers({
    fetch: props.fetch, showToast: props.showToast, initialStorageInfo: props.initialStorageInfo,
    router: props.router, confirmDialog: props.confirmDialog, alertDialog: props.alertDialog
  });
  const security = useSecurityHandlers({
    config: props.config, setConfig: props.setConfig, fetch: props.fetch,
    showToast: props.showToast, initialAuditLogs: props.initialAuditLogs, router: props.router
  });
  const backup = useBackupHandlers({
    config: props.config, setConfig: props.setConfig, newsList: props.newsList, setNewsList: props.setNewsList,
    teachers: props.teachers, setTeachers: props.setTeachers, achievements: props.achievements, setAchievements: props.setAchievements,
    records: props.records, setRecords: props.setRecords, students: props.students, setStudents: props.setStudents,
    graduation: props.graduation, setGraduation: props.setGraduation, messages: props.messages, setMessages: props.setMessages,
    setPageContents: props.setPageContents, fetch: props.fetch, showToast: props.showToast, router: props.router
  });
  return { ...overview, ...security, ...backup };
}
