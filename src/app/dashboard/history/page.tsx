"use client";

import { useState, useEffect } from "react";
import styles from "../dashboard.module.css";

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

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

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
    <div>
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>Loading history...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Transaction ID</th>
                <th className={styles.th}>Date & Time</th>
                <th className={styles.th}>Staff</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className={styles.historyRow}>
                  <td className={styles.td}>#{tx.id}</td>
                  <td className={`${styles.td} ${styles.historyTime}`}>{formatDate(tx.createdAt)}</td>
                  <td className={styles.td}>{tx.staffName || "—"}</td>
                  <td className={`${styles.td} ${styles.historyTotal}`}>{formatRupiah(tx.total)}</td>
                  <td className={styles.td}>
                    <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnPill}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedTx(tx)}>
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#A0A5AA" }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedTx && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTx(null)}>
          <div className={styles.modal} style={{ width: '600px' }} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Transaction Detail</h2>
            <div style={{ marginBottom: '20px', color: '#A0A5AA' }}>
              <p><strong>ID:</strong> #{selectedTx.id}</p>
              <p><strong>Date:</strong> {formatDate(selectedTx.createdAt)}</p>
              <p><strong>Staff:</strong> {selectedTx.staffName || "—"}</p>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              {selectedTx.items.map(item => (
                <div key={item.id} className={styles.txCard}>
                  <div className={styles.txCardInfo}>
                    <span className={styles.txCardName}>{item.product?.name || "Unknown Product"}</span>
                    <span className={styles.txCardQty}>
                      {item.quantity} PCS @ {formatRupiah(item.price)}
                    </span>
                  </div>
                  <div className={styles.txCardTotal}>
                    {formatRupiah(item.quantity * item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.grandTotal}>
              Total: {formatRupiah(selectedTx.total)}
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setSelectedTx(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
