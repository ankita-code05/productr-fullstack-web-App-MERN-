// productr-server/controllers/authController.js

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../services/emailService");
const { sendOtpSms } = require("../services/smsService");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^\+?[0-9]{10,15}$/.test(value);
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// ── REQUEST OTP ──────────────────────────────────────────────────────
exports.requestOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email or phone is required." });
    }

    const identifierType = isEmail(identifier)
      ? "email"
      : isPhone(identifier)
      ? "phone"
      : null;

    if (!identifierType) {
      return res.status(400).json({ message: "Enter a valid email or phone number." });
    }

    const query = identifierType === "email"
      ? { email: identifier }
      : { phone: identifier };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "No account found. Please sign up." });
    }

    await Otp.deleteMany({ identifier });

    const otp = generateOtp();
    await Otp.create({
      identifier,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (identifierType === "email") {
      await sendOtpEmail(identifier, otp);
    } else {
      await sendOtpSms(identifier, otp);
    }

    res.json({ success: true, message: `OTP sent to your ${identifierType}.` });

  } catch (error) {
    console.error("requestOtp error:", error.message);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

// ── VERIFY OTP ───────────────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: "Identifier and OTP are required." });
    }

    const record = await Otp.findOne({ identifier });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found. Request a new one." });
    }

    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ identifier });
      return res.status(400).json({ message: "OTP has expired. Request a new one." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    await Otp.deleteOne({ identifier });

    const query = isEmail(identifier)
      ? { email: identifier }
      : { phone: identifier };

    const user = await User.findOne(query);

    const token = jwt.sign(
      { userId: user._id, identifier },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, userId: user._id });

  } catch (error) {
    console.error("verifyOtp error:", error.message);
    res.status(500).json({ message: "Verification failed. Please try again." });
  }
};

// ── RESEND OTP ───────────────────────────────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Identifier is required." });
    }

    const identifierType = isEmail(identifier) ? "email" : "phone";
    const query = identifierType === "email"
      ? { email: identifier }
      : { phone: identifier };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "No account found." });
    }

    await Otp.deleteMany({ identifier });

    const otp = generateOtp();
    await Otp.create({
      identifier,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (identifierType === "email") {
      await sendOtpEmail(identifier, otp);
    } else {
      await sendOtpSms(identifier, otp);
    }

    res.json({ success: true, message: "OTP resent successfully." });

  } catch (error) {
    console.error("resendOtp error:", error.message);
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};

// ── PHONE LOGIN (after Firebase OTP verification) ────────────────────
exports.phoneLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "No account found. Please sign up." });
    }

    const token = jwt.sign(
      { userId: user._id, identifier: phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, userId: user._id });

  } catch (error) {
    console.error("phoneLogin error:", error.message);
    res.status(500).json({ message: "Phone login failed. Please try again." });
  }
};