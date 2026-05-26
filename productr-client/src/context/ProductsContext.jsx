// src/context/ProductsContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ProductsContext = createContext();

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://productr-fullstack-web-app-mern.onrender.com";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getJsonHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Load all products from backend ──────────────────────
  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/products`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ── Upload images to Cloudinary via backend ──────────────
  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await fetch(`${BASE_URL}/products/upload-images`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Image upload failed.");
    return data.urls;
  };

  // ── Add product ──────────────────────────────────────────
  const addProduct = async (productData) => {
    setIsLoading(true);
    try {
      // Upload new image files first
      let imageUrls = [];
      if (productData.imageFiles?.length > 0) {
        imageUrls = await uploadImages(productData.imageFiles);
      }

      const response = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: getJsonHeader(),
        body: JSON.stringify({
          ...productData,
          images: imageUrls,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProducts((prev) => [data.product, ...prev]);
      return data.product;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update product ───────────────────────────────────────
  const updateProduct = async (id, productData) => {
    setIsLoading(true);
    try {
      // Keep existing URLs + upload any new files
      let imageUrls = productData.images || [];
      if (productData.imageFiles?.length > 0) {
        const newUrls = await uploadImages(productData.imageFiles);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: getJsonHeader(),
        body: JSON.stringify({
          ...productData,
          images: imageUrls,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.product : p))
      );
      return data.product;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Delete product ───────────────────────────────────────
  const deleteProduct = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Toggle publish ───────────────────────────────────────
  const togglePublish = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}/publish`, {
        method: "PATCH",
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.product : p))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const publishedProducts = products.filter((p) => p.published);
  const unpublishedProducts = products.filter((p) => !p.published);

  return (
    <ProductsContext.Provider
      value={{
        products,
        publishedProducts,
        unpublishedProducts,
        isLoading,
        error,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublish,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}