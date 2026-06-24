'use client';

import React from 'react';

export default function EditGradesModal({
  isOpen,
  onClose,
  activeStudent,
  gradesForm,
  setGradesForm,
  isSaving,
  onSave
}) {
  if (!isOpen || !activeStudent) return null;

  return (
    <div className="guru-modal-backdrop" onClick={onClose}>
      <div className="guru-modal-card glass-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Input Nilai Hasil Belajar</h2>
            <p className="modal-student-detail">
              {activeStudent.name} • NISN: {activeStudent.nisn} • Kelas {activeStudent.class}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onSave}>
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
              onClick={onClose}
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
  );
}
