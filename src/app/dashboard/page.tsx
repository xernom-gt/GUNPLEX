"use client";

import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";

interface LowStockProduct {
  id: number;
  name: string;
  quantity: number;
  category: {
    name: string;
  };
}

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalTransactions: number;
  totalRevenue: number;
  totalUsers: number;
  lowStockProducts: LowStockProduct[];
}

function AnimatedCounter({ value, isCurrency = false }: { value: number, isCurrency?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number);
  };

  return <>{isCurrency ? formatRupiah(count) : count}</>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className={styles.loading}>Loading Overview...</div>;
  if (!stats) return <div className={styles.loading}>Failed to load stats.</div>;

  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </span>
            <span className={styles.statLabel}>Total Products</span>
          </div>
          <div className={styles.statValue}><AnimatedCounter value={stats.totalProducts} /></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            </span>
            <span className={styles.statLabel}>Total Categories</span>
          </div>
          <div className={styles.statValue}><AnimatedCounter value={stats.totalCategories} /></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </span>
            <span className={styles.statLabel}>Total Transactions</span>
          </div>
          <div className={styles.statValue}><AnimatedCounter value={stats.totalTransactions} /></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </span>
            <span className={styles.statLabel}>Total Revenue</span>
          </div>
          <div className={styles.statValue}><AnimatedCounter value={stats.totalRevenue} isCurrency={true} /></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.statValue}><AnimatedCounter value={stats.totalUsers} /></div>
        </div>
      </div>

      <div className={styles.lowStockSection}>
        <h2 className={styles.sectionTitle}>Low Stock Alert ( {"<="} 5 PCS )</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Product Name</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map((product, idx) => (
                <tr key={product.id} className={styles.lowStockRow} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <td className={styles.td}>{product.name}</td>
                  <td className={styles.td}>{product.category.name}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeRed}`}>
                      {product.quantity}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "20px", color: "#A0A5AA" }}>
                    All products have sufficient stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
