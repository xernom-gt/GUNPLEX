"use client";

import { useState, useEffect } from "react";
import styles from "../staff.module.css";
import Link from "next/link";

interface Product {
  name: string;
}

interface TransactionItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

interface Transaction {
  id: number;
  createdAt: string;
  staffName: string | null;
  total: number;
  items: TransactionItem[];
}

export default function StaffHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", padding: "40px", overflowY: "auto" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>TRANSACTION HISTORY</h1>
        <div className={styles.toolbar}>
          <Link href="/staff">
            <button className={`${styles.btn} ${styles.btnSecondary}`}>BACK TO POS</button>
          </Link>
        </div>
      </div>

      <div style={{ background: "rgba(31, 40, 51, 0.7)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "20px" }}>
        {isLoading ? (
          <div className={styles.loading}>Loading history...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#A0A5AA" }}>Transaction ID</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#A0A5AA" }}>Date & Time</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#A0A5AA" }}>Staff</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#A0A5AA" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ padding: "15px", borderBottom: "1px dashed rgba(255,255,255,0.05)" }}>#{tx.id}</td>
                  <td style={{ padding: "15px", borderBottom: "1px dashed rgba(255,255,255,0.05)" }}>{formatDate(tx.createdAt)}</td>
                  <td style={{ padding: "15px", borderBottom: "1px dashed rgba(255,255,255,0.05)" }}>{tx.staffName || "—"}</td>
                  <td style={{ padding: "15px", borderBottom: "1px dashed rgba(255,255,255,0.05)" }}>{formatRupiah(tx.total)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#A0A5AA" }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
