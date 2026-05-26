// productr-server/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  resendOtp,
  phoneLogin,
} = require("../controllers/authController");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/phone-login", phoneLogin);

module.exports = router;