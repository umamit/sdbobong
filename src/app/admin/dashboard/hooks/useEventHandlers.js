import { useState } from 'react';

export default function useEventHandlers({
  pageContents,
  setPageContents,
  handlePageContentsSave,
  showToast
}) {
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = add, else = event object
  const [eventTitle, setEventTitle] = useState('');
  const [eventDates, setEventDates] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventMonth, setEventMonth] = useState('Juli 2025');

  const handleSaveAgendaEvent = async (e) => {
    e.preventDefault();
    const currentCalendar = pageContents.akademik?.calendar || [];
    let updatedCalendar = [];

    if (editingEvent) {
      updatedCalendar = currentCalendar.map(evt =>
        evt.id === editingEvent.id
          ? { ...evt, month: eventMonth, dates: eventDates, desc: eventDesc }
          : evt
      );
    } else {
      const newEvt = {
        id: 'cal_' + Date.now(),
        month: eventMonth,
        dates: eventDates,
        desc: eventDesc
      };
      updatedCalendar = [...currentCalendar, newEvt];
    }

    const updatedAkademik = {
      ...pageContents.akademik,
      calendar: updatedCalendar
    };

    setPageContents(prev => ({
      ...prev,
      akademik: updatedAkademik
    }));

    await handlePageContentsSave('akademik', updatedAkademik);

    setAgendaModalOpen(false);
    setEditingEvent(null);
    setEventDates('');
    setEventDesc('');
  };

  const handleDeleteAgendaEvent = async (eventId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda kegiatan ini?')) return;

    const currentCalendar = pageContents.akademik?.calendar || [];
    const updatedCalendar = currentCalendar.filter(evt => evt.id !== eventId);

    const updatedAkademik = {
      ...pageContents.akademik,
      calendar: updatedCalendar
    };

    setPageContents(prev => ({
      ...prev,
      akademik: updatedAkademik
    }));

    await handlePageContentsSave('akademik', updatedAkademik);
  };

  // Computations
  const calendarEvents = pageContents.akademik?.calendar || [];
  const filteredEvents = calendarEvents.filter(evt => {
    const query = agendaSearch.toLowerCase();
    return (evt.month || '').toLowerCase().includes(query) ||
           (evt.dates || '').toLowerCase().includes(query) ||
           (evt.desc || '').toLowerCase().includes(query);
  });

  return {
    agendaSearch,
    setAgendaSearch,
    agendaModalOpen,
    setAgendaModalOpen,
    editingEvent,
    setEditingEvent,
    eventTitle,
    setEventTitle,
    eventDates,
    setEventDates,
    eventDesc,
    setEventDesc,
    eventMonth,
    setEventMonth,
    handleSaveAgendaEvent,
    handleDeleteAgendaEvent,
    calendarEvents,
    filteredEvents
  };
}
