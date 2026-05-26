// src/pages/ProductsPage.jsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/products/ProductCard";
import AddEditProductModal from "../components/products/AddEditProductModal";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import "../styles/Products.css";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 10L12 3L21 10" /><path d="M5 9.5V20H19V9.5" />
  </svg>
);

const ProductsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M17.5 14V21" /><path d="M14 17.5H21" />
  </svg>
);

const EmptyGridIcon = () => (
  <svg className="empty-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M17.5 14V21" /><path d="M14 17.5H21" />
  </svg>
);

const ProductsPage = () => {
  const { user, logout } = useAuth();
  const {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
  } = useProducts();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = () => {
    if (!user?.identifier) return "U";
    if (user.identifier.includes("@"))
      return user.identifier.split("@")[0].slice(0, 2).toUpperCase();
    return user.identifier.slice(-2);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Add or Edit product ──────────────────────────────────
  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        showToast("Product updated successfully");
      } else {
        await addProduct(productData);
        showToast("Product added Successfully");
      }
      setEditingProduct(null);
      setShowAddModal(false);
    } catch (err) {
      showToast(err.message || "Something went wrong. Please try again.");
    }
  };

  // ── Delete product ───────────────────────────────────────
  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteTarget._id);
      setDeleteTarget(null);
      showToast("Product Deleted Successfully");
    } catch (err) {
      showToast(err.message || "Failed to delete product.");
    }
  };

  return (
    <div className="products-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/images/logo1.png" alt="Productr" className="logo-img" />
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <HomeIcon /><span>Home</span>
          </NavLink>
          <NavLink to="/products"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <ProductsIcon /><span>Products</span>
          </NavLink>
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="products-main">

        {/* Topbar */}
        <header className="products-topbar">
          <div className="breadcrumb">Products</div>
          <div className="topbar-right">
            <input
              type="text"
              placeholder="Search Services, Products"
              className="top-search"
            />
            <div className="avatar-dropdown">
              <div
                className="profile-circle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {getInitials()}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => setDropdownOpen(false)}>
                    {user?.identifier}
                  </button>
                  <button
                    className="logout-btn"
                    onClick={() => { logout(); navigate("/login"); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="products-body">

          {/* Loading state */}
          {isLoading && products.length === 0 ? (
            <div className="empty-state">
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            /* Empty state */
            <div className="empty-state">
              <EmptyGridIcon />
              <h2>Feels a little empty over here...</h2>
              <p>
                You can create products without connecting store<br />
                you can add products to store anytime
              </p>
              <button
                className="add-product-btn"
                onClick={() => setShowAddModal(true)}
              >
                Add your Products
              </button>
            </div>
          ) : (
            /* Products grid */
            <div className="products-grid-section">
              <div className="products-grid-header">
                <h3>Products</h3>
                <button
                  className="add-products-top"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Products
                </button>
              </div>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onPublishToggle={() => togglePublish(product._id)}
                    onEdit={(p) => setEditingProduct(p)}
                    onDelete={(p) => setDeleteTarget(p)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Add Modal ── */}
      {showAddModal && (
        <AddEditProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleProductSubmit}
        />
      )}

      {/* ── Edit Modal ── */}
      {editingProduct && (
        <AddEditProductModal
          editProduct={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleProductSubmit}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteConfirmModal
          product={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="toast">
          <span style={{ color: "#12b76a" }}>✓</span>
          <span>{toast}</span>
          <button onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;