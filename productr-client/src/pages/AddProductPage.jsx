// src/pages/AddProductPage.jsx

import React, { useState } from "react";
import "../styles/AddProductPage.css";

const PRODUCT_TYPES = ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"];

const AddProductPage = ({ onClose, onProductCreated }) => {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    quantity: "",
    mrp: "",
    sellingPrice: "",
    brandName: "",
    exchangeEligible: "Yes",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.productName.trim())
      newErrors.productName = "Please enter product name";
    if (!formData.productType)
      newErrors.productType = "Please select product type";
    if (!formData.quantity)
      newErrors.quantity = "Please enter quantity";
    if (!formData.mrp)
      newErrors.mrp = "Please enter MRP";
    if (!formData.sellingPrice)
      newErrors.sellingPrice = "Please enter selling price";
    if (!formData.brandName.trim())
      newErrors.brandName = "Please enter brand name";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: API call to save product
      const product = {
        ...formData,
        images: images.map((img) => img.preview),
        totalImages: images.length,
      };
      console.log("Product created:", product);
      if (onProductCreated) onProductCreated(product);
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target.classList.contains("modal-overlay")) onClose();
    }}>
      <div className="add-product-container">
        {/* Header */}
        <div className="add-product-header">
          <h2>Add Product</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="product-form">

          {/* Product Name */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="CakeZone Walnut Brownie"
              value={formData.productName}
              onChange={handleChange}
              className={errors.productName ? "input-error" : ""}
            />
            {errors.productName && (
              <span className="error-msg">{errors.productName}</span>
            )}
          </div>

          {/* Product Type */}
          <div className="form-group">
            <label>Product Type</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className={errors.productType ? "input-error" : ""}
            >
              <option value="">Select product type</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.productType && (
              <span className="error-msg">{errors.productType}</span>
            )}
          </div>

          {/* Quantity Stock */}
          <div className="form-group">
            <label>Quantity Stock</label>
            <input
              type="number"
              name="quantity"
              placeholder="Total numbers of Stock available"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "input-error" : ""}
            />
            {errors.quantity && (
              <span className="error-msg">{errors.quantity}</span>
            )}
          </div>

          {/* MRP */}
          <div className="form-group">
            <label>MRP</label>
            <input
              type="number"
              name="mrp"
              placeholder="Total numbers of Stock available"
              value={formData.mrp}
              onChange={handleChange}
              className={errors.mrp ? "input-error" : ""}
            />
            {errors.mrp && (
              <span className="error-msg">{errors.mrp}</span>
            )}
          </div>

          {/* Selling Price */}
          <div className="form-group">
            <label>Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              placeholder="Total numbers of Stock available"
              value={formData.sellingPrice}
              onChange={handleChange}
              className={errors.sellingPrice ? "input-error" : ""}
            />
            {errors.sellingPrice && (
              <span className="error-msg">{errors.sellingPrice}</span>
            )}
          </div>

          {/* Brand Name */}
          <div className="form-group">
            <label>Brand Name</label>
            <input
              type="text"
              name="brandName"
              placeholder="Total numbers of Stock available"
              value={formData.brandName}
              onChange={handleChange}
              className={errors.brandName ? "input-error" : ""}
            />
            {errors.brandName && (
              <span className="error-msg">{errors.brandName}</span>
            )}
          </div>

          {/* Upload Product Images */}
          <div className="form-group">
            <div className="upload-header">
              <label>Upload Product Images</label>
              {images.length > 0 && (
                <label className="add-more-label">
                  Add More Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {images.length === 0 ? (
              <label className="upload-box">
                <span>Enter Description</span>
                <p>Browse</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="image-previews">
                {images.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img.preview} alt={`preview-${index}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exchange or return eligibility */}
          <div className="form-group">
            <label>Exchange or return eligibility</label>
            <select
              name="exchangeEligible"
              value={formData.exchangeEligible}
              onChange={handleChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Submit */}
          <div className="submit-wrapper">
            <button
              type="submit"
              className="create-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;