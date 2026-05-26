// productr-server/controllers/productController.js

const Product = require("../models/Product");

// ── GET ALL PRODUCTS FOR USER ────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, products });
  } catch (error) {
    console.error("getProducts error:", error.message);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// ── CREATE PRODUCT ───────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const {
      productName, productType, quantity,
      mrp, sellingPrice, brandName,
      exchangeEligible, images,
    } = req.body;

    if (!productName || !productType || !quantity || !mrp || !sellingPrice || !brandName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const product = await Product.create({
      userId: req.userId,
      productName,
      productType,
      quantity,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligible,
      images: images || [],
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("createProduct error:", error.message);
    res.status(500).json({ message: "Failed to create product." });
  }
};

// ── UPDATE PRODUCT ───────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json({ success: true, product: updated });
  } catch (error) {
    console.error("updateProduct error:", error.message);
    res.status(500).json({ message: "Failed to update product." });
  }
};

// ── DELETE PRODUCT ───────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted." });
  } catch (error) {
    console.error("deleteProduct error:", error.message);
    res.status(500).json({ message: "Failed to delete product." });
  }
};

// ── TOGGLE PUBLISH ───────────────────────────────────────
exports.togglePublish = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.published = !product.published;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    console.error("togglePublish error:", error.message);
    res.status(500).json({ message: "Failed to update product." });
  }
};