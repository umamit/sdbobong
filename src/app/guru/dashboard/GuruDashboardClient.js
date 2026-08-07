'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppleConfirmModal from '../../../components/ui/AppleConfirmModal';
import EditGradesModal from './EditGradesModal';

export default function GuruDashboardClient({ initialTeacher, initialStudents }) {
  const router = useRouter();
  const [students, setStudents] = useState(initialStudents || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // State for Editing Grades Modal
  const [activeStudent, setActiveStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradesForm, setGradesForm] = useState({
    ppkn: '',
    indonesia: '',
    matematika: '',
    ipas: '',
    seni: '',
    pjok: '',
    inggris: '',
    agama: '',
    mulok: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // Show Toast Helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Logout Handler
  const handleLogoutClick = () => {
    setShowConfirmLogout(true);
  };

  const handleLogoutConfirm = async () => {
    setShowConfirmLogout(false);
    try {
      const res = await fetch('/api/auth/guru', { method: 'DELETE' });
      if (res.ok) {
        localStorage.removeItem('teacher_session_expiry');
        localStorage.removeItem('teacher_info');
        router.push('/guru/login');
        router.refresh();
      } else {
        showToast('danger', 'Gagal memproses logout.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // Helper to determine student grades status
  const getGradesStatus = (student) => {
    const grades = student.grades;
    if (!grades) return { label: 'Belum Diisi', class: 'status-empty', count: 0 };
    
    const subjectKeys = ['ppkn', 'indonesia', 'matematika', 'ipas', 'seni', 'pjok', 'inggris', 'agama', 'mulok'];
    let filledCount = 0;
    
    subjectKeys.forEach(k => {
      if (grades[k] !== undefined && grades[k] !== null && grades[k] !== '') {
        filledCount++;
      }
    });

    if (filledCount === 0) {
      return { label: 'Belum Diisi', class: 'status-empty', count: 0 };
    } else if (filledCount === subjectKeys.length) {
      return { label: 'Lengkap', class: 'status-complete', count: filledCount };
    } else {
      return { label: `Sebagian (${filledCount}/9)`, class: 'status-partial', count: filledCount };
    }
  };

  // Filtering & Searching Logic
  const filteredStudents = useMemo(() => {
    if (!classFilter) return [];
    return students.filter(student => {
      // 1. Class filter
      if (classFilter !== 'All' && String(student.class) !== classFilter) {
        return false;
      }

      // 2. Search query (NISN or Name)
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const nameMatch = (student.name || '').toLowerCase().includes(query);
        const nisnMatch = (student.nisn || '').includes(query);
        const nisMatch = (student.nis || '').includes(query);
        if (!nameMatch && !nisnMatch && !nisMatch) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'All') {
        const status = getGradesStatus(student).label;
        if (statusFilter === 'Lengkap' && status !== 'Lengkap') return false;
        if (statusFilter === 'Sebagian' && !status.startsWith('Sebagian')) return false;
        if (statusFilter === 'Belum Diisi' && status !== 'Belum Diisi') return false;
      }

      return true;
    });
  }, [students, searchQuery, classFilter, statusFilter]);

  // Roster Statistics
  const stats = useMemo(() => {
    let lengkap = 0;
    let sebagian = 0;
    let belum = 0;

    students.forEach(s => {
      const status = getGradesStatus(s).label;
      if (status === 'Lengkap') lengkap++;
      else if (status.startsWith('Sebagian')) sebagian++;
      else belum++;
    });

    return { total: students.length, lengkap, sebagian, belum };
  }, [students]);

  // Open Edit Grades Modal
  const openEditGrades = (student) => {
    setActiveStudent(student);
    const existingGrades = student.grades || {};
    setGradesForm({
      ppkn: existingGrades.ppkn || '',
      indonesia: existingGrades.indonesia || '',
      matematika: existingGrades.matematika || '',
      ipas: existingGrades.ipas || '',
      seni: existingGrades.seni || '',
      pjok: existingGrades.pjok || '',
      inggris: existingGrades.inggris || '',
      agama: existingGrades.agama || '',
      mulok: existingGrades.mulok || ''
    });
    setIsModalOpen(true);
  };

  // Submit/Save Grades Handler
  const handleSaveGrades = async (e) => {
    e.preventDefault();
    if (!activeStudent) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/students/grades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: activeStudent.id,
          grades: gradesForm
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Gagal menyimpan nilai rapor.');
      }

      // Update local state
      setStudents(prev => prev.map(s => {
        if (s.id === activeStudent.id) {
          return { ...s, grades: resData.student.grades };
        }
        return s;
      }));

      showToast('success', `Nilai rapor untuk ${activeStudent.name} berhasil disimpan!`);
      setIsModalOpen(false);
      setActiveStudent(null);
    } catch (err) {
      showToast('danger', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="guru-dashboard-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div className={`guru-toast toast-${toast.type}`} role="alert">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {toast.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            )}
            {toast.message}
          </span>
        </div>
      )}

      {/* Header Panel */}
      <header className="guru-header-nav">
        <div className="header-logo-section">
          <img src="/images/logo_sekolah.png" alt="Logo Sekolah" width="36" height="36" className="header-school-logo" />
          <div>
            <h1>Portal Guru</h1>
            <p className="school-name">SD Negeri Bobong</p>
          </div>
        </div>

        <div className="header-profile-section">
          <div className="profile-info">
            <span className="profile-name">{initialTeacher.name}</span>
            <span className="profile-nip">NIP: {initialTeacher.nip || '-'}</span>
          </div>
          <a
            href="https://presensi.sdnegeribobong.sch.id"
            target="_blank"
            rel="nofollow noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 14 11 16 15 11"/></svg>
            <span>Presensi Online ↗</span>
          </a>
          <a
            href="https://ajar.sdnegeribobong.sch.id"
            target="_blank"
            rel="nofollow noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#d97706',
              color: '#ffffff',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span>Perangkat Ajar ↗</span>
          </a>
          <button className="btn-guru-logout" onClick={handleLogoutClick} title="Keluar dari sistem">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Dashboard Main Container */}
      <main className="guru-main-container">
        {/* Statistics Cards */}
        <section className="guru-stats-grid">
          <div className="guru-stat-card glass-card card-total">
            <div className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="stat-data">
              <h3>Total Siswa</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="guru-stat-card glass-card card-lengkap">
            <div className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="stat-data">
              <h3>Rapor Lengkap</h3>
              <p>{stats.lengkap}</p>
            </div>
          </div>
          <div className="guru-stat-card glass-card card-sebagian">
            <div className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="stat-data">
              <h3>Belum Lengkap</h3>
              <p>{stats.sebagian}</p>
            </div>
          </div>
          <div className="guru-stat-card glass-card card-belum">
            <div className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div className="stat-data">
              <h3>Belum Diisi</h3>
              <p>{stats.belum}</p>
            </div>
          </div>
        </section>

        {/* Filters & Control Panel */}
        <section className="guru-control-panel glass-card">
          <div className="search-group">
            <label htmlFor="search-input">Cari Siswa</label>
            <div className="search-input-wrapper">
              <input
                id="search-input"
                type="text"
                placeholder="Masukkan nama, NISN, atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')} aria-label="Hapus pencarian">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <div className="status-filter-select-group">
              <label htmlFor="class-select">Filter Kelas</label>
              <select
                id="class-select"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="">-- Pilih Kelas --</option>
                <option value="All">Semua Kelas</option>
                {['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D'].map(cls => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>
            </div>

            <div className="status-filter-select-group">
              <label htmlFor="status-select">Status Pengisian</label>
              <select
                id="status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Semua Status</option>
                <option value="Lengkap">Lengkap (9 Mapel)</option>
                <option value="Sebagian">Sebagian</option>
                <option value="Belum Diisi">Belum Diisi</option>
              </select>
            </div>
          </div>
        </section>

        {/* Student List Table */}
        <section className="guru-table-section glass-card">
          <div className="table-header-flex">
            <h2>Daftar Siswa SDN Bobong</h2>
            <span className="results-count">Menampilkan {filteredStudents.length} siswa</span>
          </div>

          <div className="guru-responsive-table">
            <table className="guru-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NISN / NIS</th>
                  <th>Nama Lengkap</th>
                  <th>Kelas</th>
                  <th>Jenis Kelamin</th>
                  <th>Status Rapor</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => {
                    const statusInfo = getGradesStatus(student);
                    return (
                      <tr key={student.id}>
                        <td>{idx + 1}</td>
                        <td className="nisn-column">
                          <span className="nisn-badge">{student.nisn || '-'}</span>
                          <span className="nis-text">NIS: {student.nis || '-'}</span>
                        </td>
                        <td className="student-name-cell">{student.name}</td>
                        <td><span className="class-badge">Kelas {student.class}</span></td>
                        <td>{student.gender}</td>
                        <td>
                          <span className={`status-badge ${statusInfo.class}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-edit-grades"
                            onClick={() => openEditGrades(student)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Input Nilai
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="table-no-data">
                      <div className="empty-state">
                        {!classFilter ? (
                          <>
                            <span className="empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                            </span>
                            <p>Silakan pilih Kelas terlebih dahulu pada filter di atas untuk menampilkan daftar siswa.</p>
                          </>
                        ) : (
                          <>
                            <span className="empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            </span>
                            <p>Tidak ada data siswa di kelas {classFilter === 'All' ? 'manapun' : classFilter} atau pencarian Anda tidak ditemukan.</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Input Grades Modal */}
      <EditGradesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeStudent={activeStudent}
        gradesForm={gradesForm}
        setGradesForm={setGradesForm}
        isSaving={isSaving}
        onSave={handleSaveGrades}
      />

      {/* Styled JSX blocks to avoid Tailwind dependency and give rich/premium aesthetics */}
      {/* Apple Confirm Modal for Logout */}
      <AppleConfirmModal
        isOpen={showConfirmLogout}
        title="Logout Portal Guru"
        message="Apakah Anda yakin ingin keluar dari portal guru?"
        confirmText="Logout"
        cancelText="Batal"
        type="warning"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowConfirmLogout(false)}
      />
    </div>
  );
}
