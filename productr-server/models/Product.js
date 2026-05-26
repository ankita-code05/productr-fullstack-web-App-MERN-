// productr-server/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    productType: { type: String, required: true },
    quantity: { type: Number, required: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    brandName: { type: String, required: true, trim: true },
    exchangeEligible: { type: String, enum: ["Yes", "No"], default: "Yes" },
    images: [{ type: String }], // Cloudinary URLs
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);