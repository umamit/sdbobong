import { createClient } from '@supabase/supabase-js';

// Client-side image compression using HTML5 Canvas (Zero-dependency, lightweight)
export const compressImage = (file, maxW = 1920, maxH = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(file);
      return;
    }

    // Skip if not a compressable image or is vector/animated format (SVG, GIF)
    const isImage = file.type.startsWith('image/');
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    if (!isImage || isSvg || isGif) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down dimensions if exceeding max boundaries
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Use compressed file only if it's smaller than the original
          if (blob.size < file.size) {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

// Client-side teacher sorting helpers matching the server-side logic in database.js
export const getTeacherSortWeightClient = (teacher) => {
  const role = (teacher.role || "").toLowerCase();
  const details = (teacher.details || "").toLowerCase();

  // 1. Kepala Sekolah
  if (role.includes("kepala sekolah")) {
    return { priority: 1, classNum: 0 };
  }

  // 2. Tata Usaha
  if (role.includes("tata usaha") || role.includes("tu") || role.includes("koordinator tu")) {
    return { priority: 2, classNum: 0 };
  }

  // 3. Bendahara
  if (role.includes("bendahara")) {
    return { priority: 3, classNum: 0 };
  }

  // 4. Komite
  if (role.includes("komite")) {
    return { priority: 4, classNum: 0 };
  }

  // 5. Guru Kelas / Wali Kelas (Wali Kelas)
  let classMatch = role.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i) || details.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i);
  if (classMatch) {
    const rawClass = classMatch[1].toLowerCase();
    const romanMap = {
      'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6
    };
    const classNum = romanMap[rawClass] || 99;
    return { priority: 5, classNum: classNum };
  }

  if (role.includes("guru kelas") || role.includes("wali kelas")) {
    return { priority: 5, classNum: 99 };
  }

  // 6. Guru Mata Pelajaran / Bidang Studi / generic Guru
  if (role.includes("guru") || details.includes("pendidik bidang studi") || details.includes("guru") || role.includes("bidang studi")) {
    return { priority: 6, classNum: 0 };
  }

  // 7. Others
  return { priority: 7, classNum: 0 };
};

export const sortTeachersListClient = (teachersList) => {
  if (!Array.isArray(teachersList)) return [];
  return [...teachersList].sort((a, b) => {
    const weightA = getTeacherSortWeightClient(a);
    const weightB = getTeacherSortWeightClient(b);

    if (weightA.priority !== weightB.priority) {
      return weightA.priority - weightB.priority;
    }

    if (weightA.priority === 5) {
      if (weightA.classNum !== weightB.classNum) {
        return weightA.classNum - weightB.classNum;
      }
    }

    const nameA = (a.name || "").toLowerCase().trim();
    const nameB = (b.name || "").toLowerCase().trim();
    return nameA.localeCompare(nameB);
  });
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const clientSupabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;
