export function applyPageDraft(draft, tab, handleFieldChange, pageContents) {
  if (!draft) return;
  if (tab === 'beranda') {
    if (draft.welcome_title) handleFieldChange('beranda', 'welcome_title', draft.welcome_title);
    if (draft.welcome_quote) handleFieldChange('beranda', 'welcome_quote', draft.welcome_quote);
    if (draft.welcome_p1) handleFieldChange('beranda', 'welcome_p1', draft.welcome_p1);
    if (draft.welcome_p2) handleFieldChange('beranda', 'welcome_p2', draft.welcome_p2);
    if (draft.hero_title) handleFieldChange('beranda', 'hero_title', draft.hero_title);
    if (draft.hero_text) handleFieldChange('beranda', 'hero_text', draft.hero_text);
  } else if (tab === 'profil') {
    if (draft.visi) handleFieldChange('profil', 'visi', draft.visi);
    if (Array.isArray(draft.misi)) handleFieldChange('profil', 'misi', draft.misi);
    if (draft.sejarah_title) handleFieldChange('profil', 'sejarah_title', draft.sejarah_title);
    if (draft.sejarah_p1) handleFieldChange('profil', 'sejarah_p1', draft.sejarah_p1);
    if (draft.sejarah_p2) handleFieldChange('profil', 'sejarah_p2', draft.sejarah_p2);
  } else if (tab === 'akademik') {
    if (draft.kurikulum_title) handleFieldChange('akademik', 'kurikulum_title', draft.kurikulum_title);
    if (draft.kurikulum_p1) handleFieldChange('akademik', 'kurikulum_p1', draft.kurikulum_p1);
    if (draft.kurikulum_p2) handleFieldChange('akademik', 'kurikulum_p2', draft.kurikulum_p2);
    if (Array.isArray(draft.tata_tertib)) handleFieldChange('akademik', 'tata_tertib', draft.tata_tertib);
  } else if (tab === 'kesiswaan') {
    if (draft.mode === 'prestasi' || draft.rank) {
      const curPres = pageContents.kesiswaan?.prestasi || [];
      const newPres = {
        rank: draft.rank || '1st',
        title: draft.title || 'Juara Lomba Siswa',
        level: draft.level || 'Tingkat Kabupaten',
        desc: draft.desc || '',
        icon: draft.icon || 'trophy'
      };
      handleFieldChange('kesiswaan', 'prestasi', [...curPres, newPres]);
    } else if (draft.mode === 'karya' || (draft.category && draft.title && !draft.rank)) {
      const curKarya = pageContents.kesiswaan?.karya || [];
      const newKarya = {
        icon: draft.icon || 'crafts',
        title: draft.title || 'Karya Siswa',
        category: draft.category || 'Proyek P5',
        desc: draft.desc || ''
      };
      handleFieldChange('kesiswaan', 'karya', [...curKarya, newKarya]);
    } else if (draft.nama) {
      const cur = pageContents.kesiswaan?.ekstrakurikuler || [];
      const newEk = {
        id: 'ekskul_' + Date.now(),
        nama: draft.nama,
        deskripsi: draft.deskripsi || '',
        jadwal: draft.jadwal || '',
        is_wajib: !!draft.is_wajib,
        image: '/images/ekskul_pramuka.svg'
      };
      handleFieldChange('kesiswaan', 'ekstrakurikuler', [...cur, newEk]);
    } else {
      if (draft.banner_title) handleFieldChange('kesiswaan', 'banner_title', draft.banner_title);
      if (draft.banner_text) handleFieldChange('kesiswaan', 'banner_text', draft.banner_text);
    }
  } else if (tab === 'ppdb') {
    if (draft.banner_title) handleFieldChange('ppdb', 'banner_title', draft.banner_title);
    if (draft.banner_text) handleFieldChange('ppdb', 'banner_text', draft.banner_text);
    if (draft.syarat_usia) handleFieldChange('ppdb', 'syarat_usia', draft.syarat_usia);
    if (Array.isArray(draft.syarat_berkas)) handleFieldChange('ppdb', 'syarat_berkas', draft.syarat_berkas);
  }
}
