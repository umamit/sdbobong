'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

  // Show Toast Helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Logout Handler
  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar dari portal guru?')) return;
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
      showToast('danger', 'Terjadi kesalahan logout: ' + err.message);
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
          <span>{toast.type === 'success' ? '✅' : '⚠️'} {toast.message}</span>
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
          <button className="btn-guru-logout" onClick={handleLogout} title="Keluar dari sistem">
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
            <div className="stat-icon">👥</div>
            <div className="stat-data">
              <h3>Total Siswa</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="guru-stat-card glass-card card-lengkap">
            <div className="stat-icon">🟢</div>
            <div className="stat-data">
              <h3>Rapor Lengkap</h3>
              <p>{stats.lengkap}</p>
            </div>
          </div>
          <div className="guru-stat-card glass-card card-sebagian">
            <div className="stat-icon">🟡</div>
            <div className="stat-data">
              <h3>Belum Lengkap</h3>
              <p>{stats.sebagian}</p>
            </div>
          </div>
          <div className="guru-stat-card glass-card card-belum">
            <div className="stat-icon">🔴</div>
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
                <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
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
                          >
                            📝 Input Nilai
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
                            <span className="empty-icon">🏫</span>
                            <p>Silakan pilih Kelas terlebih dahulu pada filter di atas untuk menampilkan daftar siswa.</p>
                          </>
                        ) : (
                          <>
                            <span className="empty-icon">🔍</span>
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
    </div>
  );
}
