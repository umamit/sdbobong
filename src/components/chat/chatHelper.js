'use client';

// Helper TTS: Membersihkan markdown & ekspansi singkatan agar pengucapan terdengar natural
export const cleanTextForSpeech = (rawText) => {
  if (!rawText) return '';
  let text = rawText;

  // 1. Bersihkan formatting markdown
  text = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // bersihkan bold
    .replace(/\*(.*?)\*/g, '$1')     // bersihkan italic
    .replace(/__(.*?)__/g, '$1')     // bersihkan underline
    .replace(/_(.*?)_/g, '$1')       // bersihkan italic-2
    .replace(/`([^`]+)`/g, '$1');    // bersihkan inline code

  // 2. Ekspansi singkatan akademis, gelar, mata uang, & istilah administratif agar fasih
  const expansions = [
    { pattern: /\bS\.?Pd\b\.?/gi, replacement: 'Sarjana Pendidikan' },
    { pattern: /\bM\.?Pd\b\.?/gi, replacement: 'Magister Pendidikan' },
    { pattern: /\bS\.?Kom\b\.?/gi, replacement: 'Sarjana Computer' },
    { pattern: /\bS\.?T\b\.?/gi, replacement: 'Sarjana Teknik' },
    { pattern: /\bS\.?E\b\.?/gi, replacement: 'Sarjana Ekonomi' },
    { pattern: /\bS\.?Sos\b\.?/gi, replacement: 'Sarjana Ilmu Sosial' },
    { pattern: /\bH\b\.?\s+(?=[A-Z])/g, replacement: 'Haji ' },
    { pattern: /\bHj\b\.?\s+(?=[A-Z])/gi, replacement: 'Hajah ' },
    { pattern: /\bPPDB\b/gi, replacement: 'P P D B' }, // Dieja per huruf agar tidak dibaca 'pepedeb'
    { pattern: /\bSDN\b/gi, replacement: 'S D N' },     // Dieja per huruf
    { pattern: /\bSD\b/gi, replacement: 'S D' },       // Dieja per huruf
    { pattern: /\bAI\b/gi, replacement: 'A I' },       // Dieja per huruf
    { pattern: /\bSMP\b/gi, replacement: 'S M P' },
    { pattern: /\bSMA\b/gi, replacement: 'S M A' },
    { pattern: /\bSMK\b/gi, replacement: 'S M K' },
    { pattern: /\bPTN\b/gi, replacement: 'P T N' },
    { pattern: /\bPTS\b/gi, replacement: 'P T S' },
    { pattern: /\bKec\b\.?/gi, replacement: 'Kecamatan' },
    { pattern: /\bKab\b\.?/gi, replacement: 'Kabupaten' },
    { pattern: /\bProv\b\.?/gi, replacement: 'Provinsi' },
    { pattern: /\bJl\b\.?/gi, replacement: 'Jalan' },
    { pattern: /\bNo\b\.?/gi, replacement: 'Nomor' },
    { pattern: /\bWA\b/gi, replacement: 'WhatsApp' },
    { pattern: /\bTelp\b\.?/gi, replacement: 'Telepon' },
    { pattern: /\bHp\b\.?/gi, replacement: 'Handphone' },
    { pattern: /\bRp\.?\s*(\d+)/gi, replacement: '$1 Rupiah' }, 
    { pattern: /\bWIB\b/gi, replacement: 'Waktu Indonesia Barat' },
    { pattern: /\bWITA\b/gi, replacement: 'Waktu Indonesia Tengah' },
    { pattern: /\bWIT\b/gi, replacement: 'Waktu Indonesia Timur' },
    { pattern: /\bTh\.?/gi, replacement: 'Tahun' },
    { pattern: /\bTgl\.?/gi, replacement: 'Tanggal' },
    { pattern: /\bKls\b\.?/gi, replacement: 'Kelas' },
    { pattern: /\bKurmer\b/gi, replacement: 'Kurikulum Merdeka' },
  ];

  expansions.forEach(({ pattern, replacement }) => {
    text = text.replace(pattern, replacement);
  });

  // 3. Hapus titik pemisah ribuan pada nominal angka agar dibaca utuh
  text = text.replace(/(\d+)\.(\d{3})/g, '$1$2');
  text = text.replace(/(\d+)\.(\d{3})/g, '$1$2');

  // 4. Konversi emotikon & emoji spesifik menjadi kata-kata pendukung yang relevan
  text = text
    .replace(/✨/g, '')
    .replace(/🏫/g, ' di sekolah ')
    .replace(/🎒/g, ' tas sekolah ')
    .replace(/📞/g, ' hubungi telepon ')
    .replace(/📍/g, ' berlokasi di ')
    .replace(/💰/g, ' biaya ')
    .replace(/😊|👍|👋|🤖|📝|📅|✉️|📧|💬|ℹ️/g, ' ') // hapus emoji umum dengan spasi penengah
    .replace(/⚠️/g, ' Peringatan! ')
    .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, ''); // hapus emoji sisa lainnya

  // 5. Bersihkan spasi ganda berlebih
  text = text.replace(/\s+/g, ' ').trim();

  return text;
};

// Helper TTS: Menghentikan Pembacaan Suara
export const stopSpeaking = (setActiveSpeakingIndex) => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (setActiveSpeakingIndex) {
    setActiveSpeakingIndex(null);
  }
};

// Helper TTS: Melisankan Balasan Asisten
export const speakText = (text, index, setActiveSpeakingIndex) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // Hentikan suara yang sedang aktif
  stopSpeaking(setActiveSpeakingIndex);
  setActiveSpeakingIndex(index);

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    setActiveSpeakingIndex(null);
    return;
  }

  // Pemilihan suara premium
  let bestVoice = null;
  if (window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    const idVoices = voices.filter(v => 
      v.lang.startsWith('id') || 
      v.lang.includes('ID') || 
      v.lang.toLowerCase().includes('indonesia')
    );

    if (idVoices.length > 0) {
      const voiceScores = idVoices.map(voice => {
        const name = voice.name.toLowerCase();
        let score = 0;
        
        if (name.includes('natural') || name.includes('neural')) {
          score += 100;
        }
        if (name.includes('damayanti') || name.includes('siri')) {
          score += 90;
        }
        if (name.includes('google')) {
          score += 80;
        }
        if (name.includes('microsoft') || name.includes('gadis') || name.includes('ardi')) {
          score += 70;
        }
        if (voice.localService) {
          score += 10;
        }
        return { voice, score };
      });

      voiceScores.sort((a, b) => b.score - a.score);
      bestVoice = voiceScores[0].voice;
    }
  }

  // Memecah teks menjadi potongan kalimat logis
  const clauses = cleanedText
    .replace(/([.!?;\n])\s*/g, "$1|")
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (clauses.length === 0) {
    setActiveSpeakingIndex(null);
    return;
  }

  // Mengantrekan setiap potongan kalimat
  clauses.forEach((clause, idx) => {
    const utterance = new SpeechSynthesisUtterance(clause);
    utterance.lang = 'id-ID';

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    if (idx === clauses.length - 1) {
      utterance.onend = () => {
        setActiveSpeakingIndex(null);
      };
      utterance.onerror = (e) => {
        console.error('[Aim AI TTS End Error]', e);
        setActiveSpeakingIndex(null);
      };
    } else {
      utterance.onerror = (e) => {
        console.error('[Aim AI TTS Mid Error]', e);
        stopSpeaking(setActiveSpeakingIndex);
      };
    }

    window.speechSynthesis.speak(utterance);
  });
};

// Send Chat Message helper to API
export async function sendChatMessage(messagesHistory, userMessage) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messagesHistory, userMessage] }),
      signal: controller.signal,
    });
    const data = await response.json();
    return { ok: response.ok, reply: data.reply };
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return { ok: false, error: isTimeout ? 'timeout' : 'error' };
  } finally {
    clearTimeout(timeoutId);
  }
}

// QUICK_PROMPTS static list
export const QUICK_PROMPTS = [
  { label: '🎒 Cara Daftar PPDB?', query: 'Bagaimana cara mendaftar PPDB online maupun offline di SDN Bobong?' },
  { label: '📞 Kontak Panitia?', query: 'Siapa kontak resmi panitia PPDB yang bisa dihubungi di WhatsApp?' },
  { label: '📍 Alamat Sekolah?', query: 'Di mana alamat lengkap dan lokasi peta SD Negeri Bobong?' },
  { label: '💰 Biaya Pendaftaran?', query: 'Berapa biaya pendaftaran masuk ke sekolah SD Negeri Bobong?' }
];

