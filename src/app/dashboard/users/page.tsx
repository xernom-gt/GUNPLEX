"use client";

import { useState, useEffect } from "react";
import styles from "../dashboard.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "", role: "staff" });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setIsEditMode(true);
      setEditId(user.id);
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setIsEditMode(false);
      setEditId(null);
      setFormData({ name: "", email: "", role: "staff" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, role } = formData;
    if (!name || !email || !role) return alert("All fields are required");

    const url = isEditMode ? `/api/users/${editId}` : "/api/users";
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchUsers();
    } else {
      alert("Failed to save user");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div style={{ flex: 1 }}></div>
        <div className={styles.toolbarActions}>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnPill}`} onClick={() => handleOpenModal()}>
            + Tambah User
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>Loading users...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>No</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Role</th>
                <th className={styles.th}>Created At</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={styles.tableRow}>
                  <td className={styles.td}>{idx + 1}</td>
                  <td className={styles.td}>{user.name}</td>
                  <td className={styles.td}>{user.email}</td>
                  <td className={styles.td}>
                    <span className={user.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeStaff}>
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.td}>{formatDate(user.createdAt)}</td>
                  <td className={`${styles.td} ${styles.actionsCell}`}>
                    <button className={styles.actionBtn} onClick={() => handleOpenModal(user)}>Edit</button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#A0A5AA" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{isEditMode ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input className={styles.input} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input type="email" className={styles.input} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role</label>
                <select className={styles.select} required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
