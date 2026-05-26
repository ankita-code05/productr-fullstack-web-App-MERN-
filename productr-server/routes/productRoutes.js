// productr-server/routes/productRoutes.js
const { upload } = require("../config/cloudinary");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
} = require("../controllers/productController");

// All product routes require authentication
router.use(authMiddleware);

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/publish", togglePublish);

router.post("/upload-images", authMiddleware, upload.array("images", 10), (req, res) => {
  try {
    const urls = req.files.map((file) => file.path);
    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed." });
  }
});

module.exports = router;