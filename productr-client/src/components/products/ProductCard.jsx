// src/components/products/ProductCard.jsx

import React, { useState } from "react";
import "../../styles/ProductCard.css";

const ProductCard = ({ product, onPublishToggle, onEdit, onDelete }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const hasImages = product.images?.length > 0;
  const total = product.images?.length || 0;

  const prev = () => setImgIndex((i) => (i - 1 + total) % total);
  const next = () => setImgIndex((i) => (i + 1) % total);

  return (
    <div className="product-card">
      {/* Image Carousel */}
      <div className="card-image">
        {hasImages ? (
          <>
            <img src={product.images[imgIndex]} alt={product.productName} />
            {total > 1 && (
              <>
                <button className="carousel-btn left" onClick={prev}>‹</button>
                <button className="carousel-btn right" onClick={next}>›</button>
                <div className="carousel-dots">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${i === imgIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      {/* Details */}
      <div className="card-body">
        <h4 className="card-title">{product.productName}</h4>
        <div className="card-details">
          {[
            ["Product type", product.productType],
            ["Quantity Stock", product.quantity],
            ["MRP", `₹ ${product.mrp}`],
            ["Selling Price", `₹ ${product.sellingPrice}`],
            ["Brand Name", product.brandName],
            ["Total Number of Images", product.images?.length || 0],
            ["Exchange Eligibility", product.exchangeEligible],
          ].map(([label, value]) => (
            <div key={label} className="detail-row">
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="card-actions">
          <button
            className={`publish-btn ${product.published ? "unpublish" : "publish"}`}
            onClick={() => onPublishToggle(product._id)}
          >
            {product.published ? "Unpublish" : "Publish"}
          </button>
          <button className="edit-btn" onClick={() => onEdit(product)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(product)}>
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;