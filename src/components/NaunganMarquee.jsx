'use client';

import styles from './NaunganMarquee.module.css';

export default function NaunganMarquee() {
  const items = [
    {
      href: "https://taliabukab.go.id",
      title: "Pemerintah Kabupaten Pulau Taliabu",
      imgSrc: "/images/logo_pemda_taliabu.png",
      alt: "Logo Pemda Taliabu",
      text: "Pemerintah Kabupaten Pulau Taliabu",
      isLink: true
    },
    {
      href: null,
      title: "Dinas Pendidikan Kabupaten Pulau Taliabu",
      imgSrc: "/images/logo_dinas_pendidikan.png",
      alt: "Logo Dinas Pendidikan",
      text: "Dinas Pendidikan Taliabu",
      isLink: false
    },
    {
      href: "https://kemendikdasmen.go.id",
      title: "Pendidikan Bermutu Untuk Semua - Kemendikdasmen RI",
      imgSrc: "/images/badge_pendidikan_bermutu.png",
      alt: "Pendidikan Bermutu Untuk Semua",
      text: "Pendidikan Bermutu Untuk Semua",
      isLink: true
    },
    {
      href: "https://kemendikdasmen.go.id",
      title: "Sekolah Ramah Anak - Kemendikdasmen RI",
      imgSrc: "/images/badge_kemendikdasmen_ramah.png",
      alt: "Kemendikdasmen Ramah",
      text: "Kemendikdasmen Ramah",
      isLink: true
    },
    {
      href: "https://kemendikdasmen.go.id",
      title: "Rumah Pendidikan - Kemendikdasmen RI",
      imgSrc: "/images/badge_rumah_pendidikan.png",
      alt: "Rumah Pendidikan",
      text: "Rumah Pendidikan",
      isLink: true
    },
    {
      href: null,
      title: "Kurikulum Merdeka - Merdeka Belajar",
      imgSrc: "/images/logo_kurikulum_merdeka.png",
      alt: "Logo Kurikulum Merdeka",
      text: "Kurikulum Merdeka",
      isLink: false
    },
    {
      href: null,
      title: "BerAKHLAK - Core Values ASN & Pelayanan Publik",
      imgSrc: "/images/badge_berakhlak.png",
      alt: "Logo BerAKHLAK",
      text: "BerAKHLAK",
      isLink: false
    },
    {
      href: null,
      title: "#bangga melayani bangsa - Slogan Pelayanan Publik",
      imgSrc: "/images/badge_bangga_melayani.png",
      alt: "Logo Bangga Melayani Bangsa",
      text: "#bangga melayani bangsa",
      isLink: false
    },
    {
      href: null,
      title: "Bangga Buatan Indonesia - Gerakan Nasional BBI",
      imgSrc: "/images/badge_bangga_buatan_indonesia.png",
      alt: "Logo Bangga Buatan Indonesia",
      text: "Bangga Buatan Indonesia",
      isLink: false
    }
  ];

  return (
    <div className={`container ${styles.footerAffiliations}`}>
      <div className={styles.affiliationsDivider}></div>
      <div className={styles.affiliationsContent}>
        <span className={styles.affiliationsLabel}>Naungan &amp; Program Resmi:</span>
        
        {/* Continuous Autoplay Marquee Slider */}
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className={styles.marqueeGroup}>
                {items.map((item, itemIdx) => (
                  item.isLink ? (
                    <a
                      key={`${loopIdx}-${itemIdx}`}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.affiliationItem}
                      title={item.title}
                    >
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        className={styles.affiliationLogo}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className={styles.affiliationText}>{item.text}</span>
                    </a>
                  ) : (
                    <div
                      key={`${loopIdx}-${itemIdx}`}
                      className={styles.affiliationItem}
                      title={item.title}
                    >
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        className={styles.affiliationLogo}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className={styles.affiliationText}>{item.text}</span>
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
