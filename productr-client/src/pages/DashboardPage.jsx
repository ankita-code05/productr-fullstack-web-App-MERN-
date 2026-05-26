// src/pages/DashboardPage.jsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/products/ProductCard";
import AddEditProductModal from "../components/products/AddEditProductModal";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import "../styles/Dashboard.css";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ProductsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="7" height="7"/>
    <rect x="15" y="3" width="7" height="7"/>
    <rect x="2" y="14" width="7" height="7"/>
    <path d="M17 17h4m-2-2v4"/>
  </svg>
);

const EmptyGridIcon = () => (
  <svg className="empty-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M17 17h4m-2-2v4"/>
  </svg>
);

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const {
    publishedProducts,
    unpublishedProducts,
    isLoading,
    updateProduct,
    deleteProduct,
    togglePublish,
  } = useProducts();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("published");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const displayProducts =
    activeTab === "published" ? publishedProducts : unpublishedProducts;

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

  // ── Edit product ─────────────────────────────────────────
  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        showToast("Product updated successfully");
      }
      setEditingProduct(null);
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
    <div className="dashboard-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img
            src="/images/logo.png"
            alt="Productr"
            className="logo-img"
          />
        </div>

        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <HomeIcon /> Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <ProductsIcon /> Products
          </NavLink>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <span>Home</span>
          </div>
          <div className="topbar-right">
            <div className="avatar-dropdown">
              <div
                className="avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {getInitials()}
                <span className="avatar-arrow">▾</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => setDropdownOpen(false)}>
                    {user?.identifier}
                  </button>
                  <button
                    className="logout"
                    onClick={() => { logout(); navigate("/login"); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="page-body">

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "published" ? "active" : ""}`}
              onClick={() => setActiveTab("published")}
            >
              Published
            </button>
            <button
              className={`tab-btn ${activeTab === "unpublished" ? "active" : ""}`}
              onClick={() => setActiveTab("unpublished")}
            >
              Unpublished
            </button>
          </div>

          {/* Loading */}
          {isLoading && displayProducts.length === 0 ? (
            <div className="empty-state">
              <p>Loading products...</p>
            </div>
          ) : displayProducts.length === 0 ? (
            /* Empty state */
            <div className="empty-state">
              <EmptyGridIcon />
              <h3>
                {activeTab === "published"
                  ? "No Published Products"
                  : "No Unpublished Products"}
              </h3>
              <p>
                {activeTab === "published"
                  ? "Your Published Products will appear here. Create your first product to publish."
                  : "Your Unpublished Products will appear here. Create your first product to publish."}
              </p>
            </div>
          ) : (
            /* Products grid */
            <div className="products-grid">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPublishToggle={() => togglePublish(product._id)}
                  onEdit={(p) => setEditingProduct(p)}
                  onDelete={(p) => setDeleteTarget(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

export default DashboardPage;