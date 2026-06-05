/**
 * SD Negeri Bobong - Interaction & UI Optimization Script
 * Designed for light footprint, high performance, and smooth mobile behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent background scrolling when menu is active
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu when clicking link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // 2. Active Menu Link Highlighter
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    let pageFound = false;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Check if href is present and matches current path
        if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
            link.classList.add('active');
            pageFound = true;
        } else {
            link.classList.remove('active');
        }
    });

    // Fallback: If no exact page matched, default to index.html if we are at home path
    if (!pageFound && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '')) {
        const homeLink = document.querySelector('.nav-link[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }

    // 3. Accordion Component Toggle (FAQs, Academics Rules)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Check if item is already active
            const isActive = item.classList.contains('active');
            
            // Close other accordion items
            const parent = item.parentElement;
            const siblingItems = parent.querySelectorAll('.accordion-item');
            siblingItems.forEach(sibling => {
                sibling.classList.remove('active');
            });
            
            // Toggle active state for current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 4. Lightbox Modal for Gallery Images
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryImages.length > 0 && lightbox && lightboxImg) {
        galleryImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                lightboxImg.setAttribute('src', src);
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop scrolling
            });
        });

        // Close lightbox
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.setAttribute('src', '');
            document.body.style.overflow = 'auto'; // Resume scrolling
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard support for closing
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }

    // 5. Dynamic Academic Calendar Info Highlight (Current Month Alert)
    const highlightCurrentMonth = () => {
        const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
        const currentMonthName = months[new Date().getMonth()];
        const calendarRows = document.querySelectorAll('.calendar-row');
        
        calendarRows.forEach(row => {
            const rowMonth = row.getAttribute('data-month');
            if (rowMonth && rowMonth.toLowerCase() === currentMonthName) {
                row.style.borderLeft = '4px solid var(--secondary)';
                row.style.backgroundColor = 'var(--accent-bg)';
                
                const badge = row.querySelector('.calendar-month-badge');
                if (badge) {
                    badge.classList.remove('badge-accent');
                    badge.classList.add('badge-secondary');
                    badge.innerHTML = badge.innerHTML + ' (Bulan Ini)';
                }
            }
        });
    };
    
    if (document.querySelector('.calendar-row')) {
        highlightCurrentMonth();
    }

    // 6. WebMCP Integration (Browser-side AI Assistant Agent Discovery)
    try {
        if (typeof navigator !== 'undefined' && navigator.modelContext && navigator.modelContext.provideContext) {
            navigator.modelContext.provideContext({
                tools: [
                    {
                        name: "baca_profil_sdn_bobong",
                        description: "Membaca sejarah, visi, misi, dan struktur dewan guru SD Negeri Bobong.",
                        inputSchema: {
                            type: "object",
                            properties: {}
                        }
                    },
                    {
                        name: "pendaftaran_ppdb_online",
                        description: "Mendaftarkan calon siswa baru secara otomatis melalui jalur Zonasi, Afirmasi, Prestasi, atau Perpindahan Orang Tua.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                nama_lengkap: { type: "string", description: "Nama lengkap calon siswa baru" },
                                NIK: { type: "string", description: "Nomor Induk Kependudukan 16 digit siswa" },
                                tempat_lahir: { type: "string", description: "Tempat lahir calon siswa" },
                                tanggal_lahir: { type: "string", description: "Tanggal lahir dengan format YYYY-MM-DD" },
                                jenis_kelamin: { type: "string", enum: ["Laki-laki", "Perempuan"] },
                                nama_ibu_kandung: { type: "string", description: "Nama ibu kandung calon siswa" },
                                nomor_hp_orangtua: { type: "string", description: "Nomor WhatsApp aktif orang tua" },
                                alamat_domisili: { type: "string", description: "Alamat domisili lengkap" },
                                jalur_ppdb: { type: "string", enum: ["Zonasi", "Afirmasi", "Perpindahan Orang Tua", "Prestasi"] }
                            },
                            required: ["nama_lengkap", "NIK", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "nama_ibu_kandung", "nomor_hp_orangtua", "alamat_domisili", "jalur_ppdb"]
                        }
                    }
                ]
            });
            console.log("WebMCP capabilities initialized for browser AI agents.");
        }
    } catch (webmcpErr) {
        console.warn("WebMCP initialization failed or unsupported:", webmcpErr);
    }
});
