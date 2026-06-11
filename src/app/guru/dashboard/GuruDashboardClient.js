'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function GuruDashboardClient({ initialTeacher, initialStudents }) {
  const router = useRouter();
  const [students, setStudents] = useState(initialStudents || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
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
          <img src="/images/logo_sekolah.png" alt="Logo Sekolah" className="header-school-logo" />
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
            <div>
              <label>Filter Kelas</label>
              <div className="class-filter-buttons">
                {['All', '1', '2', '3', '4', '5', '6'].map(cls => (
                  <button
                    key={cls}
                    className={`btn-filter ${classFilter === cls ? 'active' : ''}`}
                    onClick={() => setClassFilter(cls)}
                  >
                    {cls === 'All' ? 'Semua' : `Kls ${cls}`}
                  </button>
                ))}
              </div>
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
                        <span className="empty-icon">🔍</span>
                        <p>Tidak ada data siswa yang cocok dengan filter atau pencarian Anda.</p>
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
      {isModalOpen && activeStudent && (
        <div className="guru-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="guru-modal-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Input Nilai Hasil Belajar</h2>
                <p className="modal-student-detail">
                  {activeStudent.name} • NISN: {activeStudent.nisn} • Kelas {activeStudent.class}
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveGrades}>
              <div className="modal-form-grid">
                {[
                  { key: 'ppkn', label: 'PPKn' },
                  { key: 'indonesia', label: 'Bahasa Indonesia' },
                  { key: 'matematika', label: 'Matematika' },
                  { key: 'ipas', label: 'IPAS (Sains & Sos)' },
                  { key: 'seni', label: 'Seni Budaya' },
                  { key: 'pjok', label: 'PJOK (Olahraga)' },
                  { key: 'inggris', label: 'Bahasa Inggris' },
                  { key: 'agama', label: 'Pendidikan Agama' },
                  { key: 'mulok', label: 'Muatan Lokal' }
                ].map((subject) => (
                  <div className="form-input-group" key={subject.key}>
                    <label htmlFor={`modal_subject_${subject.key}`}>{subject.label}</label>
                    <input
                      id={`modal_subject_${subject.key}`}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0 - 100"
                      value={gradesForm[subject.key]}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                          setGradesForm(prev => ({ ...prev, [subject.key]: val }));
                        }
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-modal-save"
                  disabled={isSaving}
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Nilai Rapor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX blocks to avoid Tailwind dependency and give rich/premium aesthetics */}
      <style jsx global>{`
        /* General Styles for Teacher Portal */
        .guru-dashboard-wrapper {
          min-height: 100vh;
          background: #060913; /* Dark Space Background */
          color: #f1f5f9;
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          padding-bottom: 3rem;
          overflow-x: hidden;
        }

        /* Ambient glows */
        .guru-dashboard-wrapper::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(11, 91, 139, 0.15) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          pointer-events: none;
          z-index: 1;
        }

        .guru-dashboard-wrapper::after {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, transparent 70%);
          bottom: 0%;
          right: -10%;
          pointer-events: none;
          z-index: 1;
        }

        .guru-main-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          position: relative;
          z-index: 10;
        }

        /* Glassmorphic card styling */
        .glass-card {
          background: rgba(22, 30, 46, 0.65);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.1);
        }

        /* Header Navigation Styles */
        .guru-header-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(11, 15, 23, 0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem 3rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
        }

        .header-logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-school-logo {
          width: 44px;
          height: 44px;
          filter: drop-shadow(0 0 8px rgba(11, 91, 139, 0.4));
        }

        .header-logo-section h1 {
          margin: 0;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #ffffff 50%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .school-name {
          margin: 0;
          font-size: 0.8rem;
          color: #38bdf8;
          font-weight: 700;
        }

        .header-profile-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .profile-info {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .profile-nip {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 1px;
        }

        .btn-guru-logout {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 0.5rem 0.95rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-guru-logout:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: #ef4444;
          color: #ffffff;
        }

        .btn-guru-logout svg {
          width: 16px;
          height: 16px;
        }

        /* Stats Section */
        .guru-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .guru-stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.25s;
        }

        .guru-stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-icon {
          font-size: 2.25rem;
          background: rgba(255, 255, 255, 0.05);
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-data h3 {
          margin: 0;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .stat-data p {
          margin: 4px 0 0 0;
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .card-total .stat-icon { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.15); }
        .card-lengkap .stat-icon { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.15); }
        .card-sebagian .stat-icon { background: rgba(234, 179, 8, 0.1); border-color: rgba(234, 179, 8, 0.15); }
        .card-belum .stat-icon { background: rgba(148, 163, 184, 0.1); border-color: rgba(148, 163, 184, 0.15); }

        /* Control Panel Filters */
        .guru-control-panel {
          padding: 1.75rem;
          margin-bottom: 2rem;
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 2.5rem;
          align-items: center;
        }

        @media (max-width: 991px) {
          .guru-control-panel {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .guru-control-panel label {
          display: block;
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input-wrapper input {
          width: 100%;
          padding: 0.75rem 1rem;
          padding-right: 2.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .search-input-wrapper input:focus {
          outline: none;
          background: rgba(255,255,255,0.08);
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .clear-search:hover {
          color: white;
        }

        .filter-group {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 576px) {
          .filter-group {
            flex-direction: column;
            gap: 1.25rem;
          }
        }

        .class-filter-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .btn-filter {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #cbd5e1;
          padding: 0.55rem 0.85rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-filter:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: white;
        }

        .btn-filter.active {
          background: #38bdf8;
          border-color: #38bdf8;
          color: #0b0f17;
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
        }

        .status-filter-select-group select {
          padding: 0.55rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(22, 30, 46, 0.8);
          color: #cbd5e1;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-filter-select-group select:focus {
          border-color: #38bdf8;
        }

        /* Student Table section */
        .guru-table-section {
          padding: 1.75rem;
        }

        .table-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1rem;
        }

        .table-header-flex h2 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 800;
        }

        .results-count {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .guru-responsive-table {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .guru-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .guru-table th {
          background: rgba(15, 23, 42, 0.4);
          padding: 0.9rem 1.2rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .guru-table td {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
          color: #cbd5e1;
        }

        .guru-table tr:hover td {
          background: rgba(255,255,255,0.015);
        }

        .nisn-column {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nisn-badge {
          font-weight: 700;
          color: #ffffff;
        }

        .nis-text {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .student-name-cell {
          font-weight: 700;
          color: #ffffff;
        }

        .class-badge {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid rgba(56, 189, 248, 0.15);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          text-align: center;
        }

        .status-complete {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .status-partial {
          background: rgba(234, 179, 8, 0.12);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.2);
        }

        .status-empty {
          background: rgba(148, 163, 184, 0.12);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .btn-edit-grades {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 0.9rem;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
        }

        .btn-edit-grades:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(2, 132, 199, 0.4);
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        }

        .table-no-data {
          padding: 4rem 0 !important;
          text-align: center;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .empty-icon {
          font-size: 2.5rem;
          opacity: 0.5;
        }

        .empty-state p {
          color: #94a3b8;
          margin: 0;
          font-size: 0.95rem;
        }

        /* Modal Backdrop & card */
        .guru-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(4, 6, 12, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fade-in 0.2s ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .guru-modal-card {
          width: 100%;
          max-width: 650px;
          padding: 2.25rem 2rem;
          z-index: 1010;
          animation: modal-appear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-sizing: border-box;
          max-height: 90vh;
          overflow-y: auto;
        }

        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 1rem;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
        }

        .modal-student-detail {
          margin: 4px 0 0 0;
          font-size: 0.85rem;
          color: #38bdf8;
          font-weight: 700;
        }

        .modal-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 4px;
        }

        .modal-close:hover {
          color: white;
        }

        .modal-form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 576px) {
          .modal-form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .form-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-input-group label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .form-input-group input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          text-align: center;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .form-input-group input:focus {
          outline: none;
          border-color: #38bdf8;
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 1.5rem;
        }

        .btn-modal-cancel {
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.65rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-cancel:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .btn-modal-save {
          background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
          color: #0b0f17;
          border: none;
          border-radius: 10px;
          padding: 0.65rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.25);
        }

        .btn-modal-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
          background: linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%);
        }

        .btn-modal-save:disabled, .btn-modal-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        /* Toast notifications */
        .guru-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1100;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          animation: toast-slide 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes toast-slide {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .toast-success {
          background: rgba(20, 83, 45, 0.9);
          border: 1px solid #22c55e;
          color: #bbf7d0;
        }

        .toast-danger {
          background: rgba(127, 29, 29, 0.9);
          border: 1px solid #ef4444;
          color: #fca5a5;
        }
      `}</style>
    </div>
  );
}
