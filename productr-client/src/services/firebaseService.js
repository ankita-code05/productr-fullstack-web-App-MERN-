// src/services/firebaseService.js

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../config/firebase";

export const sendPhoneOtp = async (phone) => {
  try {
    // Clear existing reCAPTCHA if any
    if (window.recaptchaVerifier) {
      await window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }

    // Make sure container exists
    const container = document.getElementById("recaptcha-container");
    if (!container) {
      throw new Error("reCAPTCHA container not found.");
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          window.recaptchaVerifier = null;
        },
      }
    );

    await window.recaptchaVerifier.render();

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    window.confirmationResult = confirmationResult;
    return confirmationResult;

  } catch (error) {
    // Clean up on error
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    throw new Error(error.message || "Failed to send OTP.");
  }
};

export const verifyPhoneOtp = async (otp) => {
  if (!window.confirmationResult) {
    throw new Error("Session expired. Please request OTP again.");
  }
  try {
    const result = await window.confirmationResult.confirm(otp);
    return result;
  } catch (error) {
    throw new Error("Invalid OTP. Please try again.");
  }
};