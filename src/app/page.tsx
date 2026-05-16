"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Parallax effect for video
      if (videoRef.current) {
        const scrolled = window.scrollY;
        videoRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for Fade-in and Glow animations
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    const animatedElements = document.querySelectorAll(`.${styles.fadeUp}, .${styles.profileVisual}`);
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={`container ${styles.navContainer}`}>
          <Link href={'/'} className={styles.logo}>GUNPLEX</Link>
          <ul className={styles.navLinks}>
            <li><a href="#grades" className={styles.navLink}>Supported Grades</a></li>
            <li><a href="#system" className={styles.navLink}>System Profile</a></li>
            <li><a href="#contact" className={styles.navLink}>Contact Us</a></li>
          </ul>
          <div className={styles.navActions}>
            <Link href={'/dashboard'} className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Belanja Sekarang</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.videoContainer} ref={videoRef}>
          <video 
            className={styles.videoBg} 
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.videoOverlay}></div>
        
        <div className={`container ${styles.heroContent}`}>
          <span className={`${styles.eyebrow} ${styles.slideUp} ${styles.delay1}`}>The Best GUNPLA STORE</span>
          <h1 className={`${styles.headline} ${styles.slideUp} ${styles.delay2}`}>Build your dream gundam and collect them all.</h1>
          <p className={`${styles.subheadline} ${styles.slideUp} ${styles.delay3}`}>
            Toko GUNPLA dengan 3T. Terpercaya, Terlengkap, dan Termurah se Indonesia.
          </p>
          <div className={`${styles.heroActions} ${styles.slideUp} ${styles.delay3}`}>
            <Link href={'/dashboard'} className={`${styles.btn} ${styles.btnPrimary}`}>Belanja Sekarang</Link>
            </div>
        </div>
      </section>

      {/* Grade Showcase (Hover to Expand / Flip Card) */}
      <section id="grades" className={styles.gradeSection}>
        <div className={`container ${styles.fadeUp}`}>
          <div className={styles.sectionHeader}>
            <h5 className={styles.sectionSubtitle}>Supported Inventory</h5>
            <h2 className={styles.sectionTitle}>Gunpla Grades Management</h2>
          </div>

          <div className={styles.gradeGrid}>
            {/* HG */}
            <div className={styles.gradeCard}>
              <div className={styles.gradeCardInner}>
                <div className={styles.gradeCardFront}>
                  <h3>HG</h3>
                  <p>High Grade</p>
                  <span className={styles.hoverHint}>Hover to View</span>
                </div>
                <div className={styles.gradeCardBack}>
                  <div className={styles.gradeCardImage}>
                    <Image src="/hg.png" alt="High Grade Gunpla" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.gradeCardContent}>
                    <h4>High Grade (HG)</h4>
                    <p>Sangat cocok untuk anda yang ingin terjun kedunia gunpla karena mudah di rakit dan banyak sekali varian yang tersedia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RG */}
            <div className={styles.gradeCard}>
              <div className={styles.gradeCardInner}>
                <div className={styles.gradeCardFront}>
                  <h3>RG</h3>
                  <p>Real Grade</p>
                  <span className={styles.hoverHint}>Hover to View</span>
                </div>
                <div className={styles.gradeCardBack}>
                  <div className={styles.gradeCardImage}>
                    <Image src="/rg.png" alt="Real Grade Gunpla" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.gradeCardContent}>
                    <h4>Real Grade (RG)</h4>
                    <p>Memiliki frame di dalamnya yang sangat detail sehingga mirip dengan aslinya,cocok untuk anda yang sudah mahir merakit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MG */}
            <div className={styles.gradeCard}>
              <div className={styles.gradeCardInner}>
                <div className={styles.gradeCardFront}>
                  <h3>MG</h3>
                  <p>Master Grade</p>
                  <span className={styles.hoverHint}>Hover to View</span>
                </div>
                <div className={styles.gradeCardBack}>
                  <div className={styles.gradeCardImage}>
                    <Image src="/mg.png" alt="Master Grade Gunpla" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.gradeCardContent}>
                    <h4>Master Grade (MG)</h4>
                    <p>Memiliki tingkat kerumitan yang cukup tinggi dan membutuhkan waktu yang lama untuk merakitnya,cocok untuk anda yang sudah mahir merakit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PG */}
            <div className={styles.gradeCard}>
              <div className={styles.gradeCardInner}>
                <div className={styles.gradeCardFront}>
                  <h3>PG</h3>
                  <p>Perfect Grade</p>
                  <span className={styles.hoverHint}>Hover to View</span>
                </div>
                <div className={styles.gradeCardBack}>
                  <div className={styles.gradeCardImage}>
                    <Image src="/pg.png" alt="Perfect Grade Gunpla" fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.gradeCardContent}>
                    <h4>Perfect Grade (PG)</h4>
                    <p>Memiliki tingkat kerumitan yang sangat tinggi dan membutuhkan waktu yang lama untuk merakitnya,cocok untuk anda yang sudah mahir merakit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POS System Profile */}
      <section id="system" className={styles.profileSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h5 className={styles.sectionSubtitle}>System Profile</h5>
            <h2 className={styles.sectionTitle}>About GUNPLEX STORE</h2>
          </div>

          {/* Row 1 */}
          <div className={`${styles.profileRow} ${styles.fadeUp}`}>
            <div className={styles.profileText}>
              <h3>Banyak varian gundam yang tersedia</h3>
              <p>
                Kami memiliki berbagai macam gundam dari berbagai seri dan grade yang bisa anda pilih sesuai dengan keinginan anda.
              </p>
            </div>
            <div className={styles.profileVisual}>
              <div className={styles.visualIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div className={styles.visualStats}>
                <div className={styles.statBox}>
                  <h5>500+</h5>
                  <p>varian gundam</p>
                </div>
                <div className={styles.statBox}>
                  <h5>99%</h5>
                  <p>Akurasi Data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className={`${styles.profileRow} ${styles.fadeUp}`}>
            <div className={styles.profileText}>
              <h3>Selalu ada Update stock terbaru</h3>
              <p>
                Kami selalu memperbarui stok kami agar anda selalu mendapatkan produk terbaru. 
              </p>
            </div>
            <div className={styles.profileVisual}>
              <div className={styles.visualIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className={styles.visualStats}>
                <div className={styles.statBox}>
                  <h5>24/7</h5>
                  <p>Stock selalu update </p>
                </div>
                <div className={styles.statBox}>
                  <h5>100%</h5>
                  <p>Data dijamin akurat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className={`${styles.profileRow} ${styles.fadeUp}`}>
            <div className={styles.profileText}>
              <h3>Harga terjangkau</h3>
              <p>
                Dengan harga terjangkau anda bisa mendapatkan gundam impian anda. 
              </p>
            </div>
            <div className={styles.profileVisual}>
              <div className={styles.visualIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                  <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                  <line x1="7" y1="12" x2="17" y2="12"></line>
                </svg>
              </div>
              <div className={styles.visualStats}>
                <div className={styles.statBox}>
                  <h5>Harga Ramah Di Kantong</h5>
                  <p>Harga termurah bisa mendapatkan gundam impian anda</p>
                </div>
                <div className={styles.statBox}>
                  <h5>Banyak Bonus</h5>
                  <p>Dapatkan banyak bonus menarik untuk setiap pembelian</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span className={styles.logo}>GUNPLEX</span>
              <p className={styles.footerDesc}>
                GUNPLEX adalah toko gunpla yang menjual berbagai macam gundam dan aksesoris untuk memenuhi hobby anda.
              </p>
            </div>
            
            <div className={styles.footerLinks}>
              <h4>Produk</h4>
              <ul>
                <li><a href="#">Fitur</a></li>
                <li><a href="#">Integrasi Scanner</a></li>
                <li><a href="#">Keamanan Data</a></li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h4>Perusahaan</h4>
              <ul>
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="#">Hubungi Tim Sales</a></li>
                <li><a href="#">Partner Ekosistem</a></li>
              </ul>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            &copy; {new Date().getFullYear()} Gunplex. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
