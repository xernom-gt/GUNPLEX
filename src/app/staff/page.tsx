"use client";

import { useState, useEffect } from "react";
import styles from "./staff.module.css";

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

interface CartItem {
  product: Product;
  cartQuantity: number;
}

export default function StaffPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchData = async () => {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number);
  };

  const getStockClass = (qty: number) => {
    if (qty < 5) return styles.stockRed;
    if (qty < 10) return styles.stockYellow;
    return styles.stockGreen;
  };

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) return; // Cannot add out of stock

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        // Check if we exceed available stock
        if (existing.cartQuantity >= product.quantity) {
          alert(`Stok tidak mencukupi. Maksimal ${product.quantity}`);
          return prevCart;
        }
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, cartQuantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.cartQuantity + delta;
          if (newQty > item.product.quantity) {
            alert(`Stok tidak mencukupi. Maksimal ${item.product.quantity}`);
            return item;
          }
          return { ...item, cartQuantity: newQty };
        }
        return item;
      }).filter(item => item.cartQuantity > 0);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    const payload = {
      staffName: "Staff-1", // You can make this dynamic if needed
      total: cartTotal,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.cartQuantity,
        price: item.product.price
      }))
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setCart([]);
        fetchData(); // Refresh stock
      } else {
        alert("Transaksi Gagal");
      }
    } catch (error) {
      console.error("Checkout error", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "all" || p.categoryId.toString() === filterCategory;
    return matchSearch && matchCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.cartQuantity), 0);

  if (isLoading) {
    return <div className={styles.loading}>Initializing Gunplex Terminal...</div>;
  }

  return (
    <>
      {/* Left Panel: Catalog */}
      <div className={styles.catalogPanel}>
        <div className={styles.header}>
          <h1 className={styles.title}>GUNPLEX TERMINAL</h1>
          <div className={styles.toolbar}>
            <input 
              type="text" 
              placeholder="Cari Gunpla..." 
              className={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className={styles.select}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Semua Grade</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map(product => {
            const isOutOfStock = product.quantity <= 0;
            return (
              <div 
                key={product.id} 
                className={`${styles.card} ${isOutOfStock ? styles.disabled : ''}`}
                onClick={() => addToCart(product)}
              >
                <div>
                  <div className={styles.cardTop}>
                    <span className={styles.cardCategory}>{product.category?.name}</span>
                    <span className={`${styles.cardStock} ${getStockClass(product.quantity)}`}>
                      {isOutOfStock ? 'HABIS' : `${product.quantity} PCS`}
                    </span>
                  </div>
                  <h3 className={styles.cardName}>{product.name}</h3>
                </div>
                <p className={styles.cardPrice}>{formatRupiah(product.price)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className={styles.cartPanel}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>CURRENT CART</h2>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>Cart is empty. Select items from catalog.</div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <p className={styles.cartItemName}>{item.product.name}</p>
                  <p className={styles.cartItemPrice}>{formatRupiah(item.product.price)}</p>
                </div>
                <div className={styles.cartItemControls}>
                  <button className={styles.qtyBtn} onClick={() => updateCartQuantity(item.product.id, -1)}>-</button>
                  <span className={styles.qtyValue}>{item.cartQuantity}</span>
                  <button className={styles.qtyBtn} onClick={() => updateCartQuantity(item.product.id, 1)}>+</button>
                </div>
                <div className={styles.cartItemTotal}>
                  {formatRupiah(item.product.price * item.cartQuantity)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValue}>{formatRupiah(cartTotal)}</span>
          </div>
          <button 
            className={`${styles.checkoutBtn} ${cart.length > 0 && !isCheckingOut ? styles.checkoutBtnPulsing : ''}`} 
            disabled={cart.length === 0 || isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut ? 'PROCESSING...' : 'PROCESS PAYMENT'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successIcon}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className={styles.successText}>TRANSAKSI BERHASIL</div>
        </div>
      )}
    </>
  );
}
