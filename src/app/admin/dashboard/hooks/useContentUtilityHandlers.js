import { useState } from 'react';

export default function useContentUtilityHandlers({
  config,
  setConfig,
  initialMessages = [],
  fetch,
  showToast,
  router
}) {
  // Downloads States
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState(null);
  const [downloadTitle, setDownloadTitle] = useState('');
  const [downloadCategory, setDownloadCategory] = useState('PPDB');
  const [downloadFileUrl, setDownloadFileUrl] = useState('');
  const [downloadSearch, setDownloadSearch] = useState('');

  // FAQs States
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqSearch, setFaqSearch] = useState('');

  // Messages / Guestbook States
  const [messages, setMessages] = useState(initialMessages);
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilterType, setMessageFilterType] = useState('all');
  const [messageFilterStatus, setMessageFilterStatus] = useState('all');

  // Downloads handlers
  const handleSaveDownload = async (e) => {
    e.preventDefault();
    const list = config.downloads || [];
    let updatedList;
    if (editingDownload) {
      updatedList = list.map(item => item.id === editingDownload.id ? { ...item, title: downloadTitle, category: downloadCategory, fileUrl: downloadFileUrl } : item);
    } else {
      const newItem = {
        id: `dl-${Date.now()}`,
        title: downloadTitle,
        category: downloadCategory,
        fileUrl: downloadFileUrl,
        date: new Date().toISOString().split('T')[0]
      };
      updatedList = [...list, newItem];
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'downloads', downloads: updatedList })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Pusat Unduhan berhasil diperbarui!');
        setConfig(prev => ({ ...prev, downloads: updatedList }));
        setDownloadModalOpen(false);
        setEditingDownload(null);
        setDownloadTitle('');
        setDownloadFileUrl('');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui Pusat Unduhan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteDownload = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berkas unduhan ini?')) return;
    const list = config.downloads || [];
    const updatedList = list.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'downloads', downloads: updatedList })
      });
      if (res.ok) {
        showToast('success', 'Berkas unduhan berhasil dihapus!');
        setConfig(prev => ({ ...prev, downloads: updatedList }));
        router.refresh();
      } else {
        showToast('danger', 'Gagal menghapus berkas unduhan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // FAQs handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    const list = config.faqs || [];
    let updatedList;
    if (editingFaq) {
      updatedList = list.map(item => item.id === editingFaq.id ? { ...item, question: faqQuestion, answer: faqAnswer } : item);
    } else {
      const newItem = {
        id: `faq-${Date.now()}`,
        question: faqQuestion,
        answer: faqAnswer
      };
      updatedList = [...list, newItem];
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'faqs', faqs: updatedList })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'FAQ Sekolah berhasil diperbarui!');
        setConfig(prev => ({ ...prev, faqs: updatedList }));
        setFaqModalOpen(false);
        setEditingFaq(null);
        setFaqQuestion('');
        setFaqAnswer('');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui FAQ.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return;
    const list = config.faqs || [];
    const updatedList = list.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'faqs', faqs: updatedList })
      });
      if (res.ok) {
        showToast('success', 'FAQ berhasil dihapus!');
        setConfig(prev => ({ ...prev, faqs: updatedList }));
        router.refresh();
      } else {
        showToast('danger', 'Gagal menghapus FAQ.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // Messages handlers
  const handleModerateMessage = async (id, status) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Status pesan berhasil diperbarui menjadi ${status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}`);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui status pesan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Pesan berhasil dihapus secara permanen!');
        setMessages(prev => prev.filter(m => m.id !== id));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus pesan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // Computations
  const filteredDownloads = (config.downloads || []).filter(item => {
    const q = downloadSearch.toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.category || '').toLowerCase().includes(q);
  });

  const filteredFaqs = (config.faqs || []).filter(item => {
    const q = faqSearch.toLowerCase();
    return (item.question || '').toLowerCase().includes(q) ||
           (item.answer || '').toLowerCase().includes(q);
  });

  const filteredMessages = messages.filter(item => {
    const q = messageSearch.toLowerCase();
    const matchesSearch = (item.name || '').toLowerCase().includes(q) ||
                          (item.message || '').toLowerCase().includes(q) ||
                          (item.role || '').toLowerCase().includes(q);
    const matchesType = messageFilterType === 'all' || item.type === messageFilterType;
    const matchesStatus = messageFilterStatus === 'all' || item.status === messageFilterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return {
    downloadModalOpen,
    setDownloadModalOpen,
    editingDownload,
    setEditingDownload,
    downloadTitle,
    setDownloadTitle,
    downloadCategory,
    setDownloadCategory,
    downloadFileUrl,
    setDownloadFileUrl,
    downloadSearch,
    setDownloadSearch,
    faqModalOpen,
    setFaqModalOpen,
    editingFaq,
    setEditingFaq,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    faqSearch,
    setFaqSearch,
    messages,
    setMessages,
    messageSearch,
    setMessageSearch,
    messageFilterType,
    setMessageFilterType,
    messageFilterStatus,
    setMessageFilterStatus,
    handleSaveDownload,
    handleDeleteDownload,
    handleSaveFaq,
    handleDeleteFaq,
    handleModerateMessage,
    handleDeleteMessage,
    filteredDownloads,
    filteredFaqs,
    filteredMessages
  };
}
