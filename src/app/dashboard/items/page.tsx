"use client";

import { useState, useEffect } from "react";
import styles from "../dashboard.module.css";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  category: Category;
}

export default function ItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [productForm, setProductForm] = useState({ name: "", categoryId: "", price: "", quantity: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "" });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData);
      setCategories(catData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
  };

  const getBadgeClass = (qty: number) => {
    if (qty < 5) return styles.badgeRed;
    if (qty < 10) return styles.badgeYellow;
    return styles.badgeGreen;
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setIsEditMode(true);
      setEditId(product.id);
      setProductForm({
        name: product.name,
        categoryId: product.categoryId.toString(),
        price: product.price.toString(),
        quantity: product.quantity.toString()
      });
    } else {
      setIsEditMode(false);
      setEditId(null);
      setProductForm({ name: "", categoryId: "", price: "", quantity: "" });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, categoryId, price, quantity } = productForm;
    if (!name || !categoryId || !price || !quantity) return alert("All fields are required");

    const payload = { name, categoryId: Number(categoryId), price: Number(price), quantity: Number(quantity) };
    const url = isEditMode ? `/api/products/${editId}` : "/api/products";
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsProductModalOpen(false);
      fetchData();
    } else {
      alert("Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return alert("Category name is required");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm)
    });

    if (res.ok) {
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: "" });
      fetchData();
    } else {
      alert("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete category");
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "all" || p.categoryId.toString() === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <div style={{ display: "flex", gap: "15px", flex: 1, maxWidth: "500px" }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className={styles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className={styles.select}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.toolbarActions}>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnPill}`} onClick={() => setIsCategoryModalOpen(true)}>
            + Tambah Kategori
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnPill}`} onClick={() => handleOpenProductModal()}>
            + Tambah Barang
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>Loading items...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>No</th>
                <th className={styles.th}>Product Name</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Stock</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => (
                <tr key={product.id} className={styles.tableRow}>
                  <td className={styles.td}>{idx + 1}</td>
                  <td className={styles.td}>{product.name}</td>
                  <td className={styles.td}>{product.category?.name}</td>
                  <td className={styles.td}>{formatRupiah(product.price)}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${getBadgeClass(product.quantity)}`}>{product.quantity}</span>
                  </td>
                  <td className={`${styles.td} ${styles.actionsCell}`}>
                    <button className={styles.actionBtn} onClick={() => handleOpenProductModal(product)}>Edit</button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2 className={styles.sectionTitle}>Categories</h2>
        <div className={styles.categoryList}>
          {categories.map(c => (
            <div key={c.id} className={styles.categoryPill}>
              {c.name}
              <button className={styles.categoryDelete} onClick={() => handleDeleteCategory(c.id)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {isProductModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsProductModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{isEditMode ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleProductSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input className={styles.input} required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select className={styles.select} required value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})}>
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price (Rp)</label>
                <input type="number" min="0" className={styles.input} required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Stock</label>
                <input type="number" min="0" className={styles.input} required value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: e.target.value})} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCategoryModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Category</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Name</label>
                <input className={styles.input} required value={categoryForm.name} onChange={e => setCategoryForm({ name: e.target.value })} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
