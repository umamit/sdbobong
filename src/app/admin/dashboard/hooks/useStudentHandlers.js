import { useState } from 'react';

export default function useStudentHandlers({
  initialStudents,
  fetch,
  showToast,
  router,
  confirmDialog
}) {
  const [students, setStudents] = useState(initialStudents);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('Semua');
  const [studentGenderFilter, setStudentGenderFilter] = useState('Semua');
  const [studentStatusFilter, setStudentStatusFilter] = useState('Semua');

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [studNisn, setStudNisn] = useState('');
  const [studNis, setStudNis] = useState('');
  const [studName, setStudName] = useState('');
  const [studClass, setStudClass] = useState('1A');
  const [studGender, setStudGender] = useState('Laki-laki');
  const [studBirthPlace, setStudBirthPlace] = useState('');
  const [studBirthDate, setStudBirthDate] = useState('');
  const [studAddress, setStudAddress] = useState('');
  const [studParentName, setStudParentName] = useState('');
  const [studParentPhone, setStudParentPhone] = useState('');
  const [studStatus, setStudStatus] = useState('Aktif');
  const [studGrades, setStudGrades] = useState({
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

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studNisn || !studName || !studClass || !studGender) {
      showToast('danger', 'Kolom NISN, Nama Lengkap, Kelas, dan Jenis Kelamin wajib diisi!');
      return;
    }
    if (!/^\d{10}$/.test(studNisn)) {
      showToast('danger', 'NISN harus berupa 10 digit angka!');
      return;
    }

    const payload = {
      id: editingStudent ? editingStudent.id : `stud-${Math.floor(Date.now() / 1000)}`,
      nisn: studNisn,
      nis: studNis,
      name: studName,
      class: studClass,
      gender: studGender,
      birth_place: studBirthPlace,
      birth_date: studBirthDate,
      address: studAddress,
      parent_name: studParentName,
      parent_phone: studParentPhone,
      status: studStatus,
      grades: studGrades
    };

    try {
      const res = await fetch('/api/students', {
        method: editingStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Data siswa ${studName} berhasil ${editingStudent ? 'diperbarui' : 'ditambahkan'}!`);
        if (editingStudent) {
          setStudents(prev => prev.map(item => item.id === editingStudent.id ? payload : item));
        } else {
          setStudents(prev => [payload, ...prev]);
        }
        setStudentModalOpen(false);
        setEditingStudent(null);
        setStudNisn('');
        setStudNis('');
        setStudName('');
        setStudClass('1A');
        setStudGender('Laki-laki');
        setStudBirthPlace('');
        setStudBirthDate('');
        setStudAddress('');
        setStudParentName('');
        setStudParentPhone('');
        setStudStatus('Aktif');
        setStudGrades({
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
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data siswa.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    const isConfirmed = confirmDialog
      ? await confirmDialog({ title: 'Hapus Data Siswa', message: 'Apakah Anda yakin ingin menghapus data siswa ini secara permanen?', type: 'danger' })
      : confirm('Apakah Anda yakin ingin menghapus data siswa ini secara permanen?');

    if (!isConfirmed) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data siswa berhasil dihapus secara permanen!');
        setStudents(prev => prev.filter(item => item.id !== id));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus data siswa.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // Filter students
  const filteredStudents = (students || []).filter(student => {
    const matchesSearch = studentSearch === '' || 
      (student.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.nisn || '').includes(studentSearch) ||
      (student.nis || '').includes(studentSearch) ||
      (student.address || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.parent_name || '').toLowerCase().includes(studentSearch.toLowerCase());

    const matchesClass = studentClassFilter === 'Semua' || student.class === studentClassFilter;
    const matchesGender = studentGenderFilter === 'Semua' || student.gender === studentGenderFilter;
    const matchesStatus = studentStatusFilter === 'Semua' || student.status === studentStatusFilter;

    return matchesSearch && matchesClass && matchesGender && matchesStatus;
  });

  return {
    students,
    setStudents,
    studentSearch,
    setStudentSearch,
    studentClassFilter,
    setStudentClassFilter,
    studentGenderFilter,
    setStudentGenderFilter,
    studentStatusFilter,
    setStudentStatusFilter,
    studentModalOpen,
    setStudentModalOpen,
    editingStudent,
    setEditingStudent,
    studNisn,
    setStudNisn,
    studNis,
    setStudNis,
    studName,
    setStudName,
    studClass,
    setStudClass,
    studGender,
    setStudGender,
    studBirthPlace,
    setStudBirthPlace,
    studBirthDate,
    setStudBirthDate,
    studAddress,
    setStudAddress,
    studParentName,
    setStudParentName,
    studParentPhone,
    setStudParentPhone,
    studStatus,
    setStudStatus,
    studGrades,
    setStudGrades,
    handleSaveStudent,
    handleDeleteStudent,
    filteredStudents
  };
}
