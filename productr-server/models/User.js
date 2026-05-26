// productr-server/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, default: null },
    phone: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);