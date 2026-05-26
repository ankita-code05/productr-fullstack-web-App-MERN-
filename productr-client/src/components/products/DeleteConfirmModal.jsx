// src/components/products/DeleteConfirmModal.jsx

import React from "react";
import "../../styles/Modal.css";

const DeleteConfirmModal = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h2>Delete Product</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        <p className="delete-msg">
          Are you sure you really want to delete this Product{" "}
          <strong>"{product?.productName}"</strong> ?
        </p>
        <div className="delete-actions">
          <button className="confirm-delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;