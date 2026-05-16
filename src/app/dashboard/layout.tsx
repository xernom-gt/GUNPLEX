"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './layout.module.css';

interface User {
  id: number;
  name: string;
  role: string;
  photo?: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('/api/users');
        const users: User[] = await res.json();
        const admin = users.find(u => u.role === 'admin');
        if (admin) setAdminUser(admin);
      } catch (e) {
        console.error('Failed to fetch admin', e);
      }
    };
    fetchAdmin();
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/dashboard/items': return 'Manage Items';
      case '/dashboard/users': return 'Manage Users';
      case '/dashboard/history': return 'Transaction History';
      case '/dashboard/profile': return 'Admin Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div className={styles.layout}>
          {/* LEFT SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.topSection}>
              <div className={styles.logo}>GUNPLEX</div>
              <nav className={styles.nav}>
                <Link 
                  href="/dashboard" 
                  className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/items" 
                  className={`${styles.navItem} ${pathname === '/dashboard/items' ? styles.active : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Items
                </Link>
                <Link 
                  href="/dashboard/users" 
                  className={`${styles.navItem} ${pathname === '/dashboard/users' ? styles.active : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Users
                </Link>
                <Link 
                  href="/dashboard/history" 
                  className={`${styles.navItem} ${pathname === '/dashboard/history' ? styles.active : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  History
                </Link>

                <Link 
                  href="/staff" 
                  className={`${styles.navItem} ${pathname === '/staff' ? styles.active : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Staff
                </Link>

              </nav>
            </div>

            <div className={styles.bottomSection}>
              <Link href="/dashboard/profile" className={styles.profileContainer}>
                {adminUser?.photo ? (
                  <img src={adminUser.photo} alt="Avatar" className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {adminUser ? adminUser.name.charAt(0) : 'A'}
                  </div>
                )}
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{adminUser ? adminUser.name : 'No Admin Found'}</span>
                  <span className={`${styles.roleBadge} ${adminUser?.role === 'staff' ? styles.roleBadgeStaff : styles.roleBadgeAdmin}`}>
                    {adminUser ? adminUser.role : 'admin'}
                  </span>
                </div>
              </Link>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className={styles.contentArea}>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
            </header>
            <main className={styles.mainContent}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
