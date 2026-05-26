// src/hooks/useLogin.js

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { requestOtp, verifyOtp, resendOtp, phoneLoginBackend } from "../services/authService";
import { sendPhoneOtp, verifyPhoneOtp } from "../services/firebaseService";

export const OTP_LENGTH = 6;

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Step tracking ────────────────────────────────────────────────
  const [step, setStep] = useState("credentials");

  // ── Credentials step state ───────────────────────────────────────
  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [identifierType, setIdentifierType] = useState(null);

  // ── OTP step state ───────────────────────────────────────────────
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // ── Start countdown when OTP screen mounts ───────────────────────
  useEffect(() => {
    if (step === "otp") {
      startResendTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const startResendTimer = () => {
    setResendTimer(20);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Credentials form handler ─────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmed = identifier.trim();

    if (!trimmed) {
      setIdentifierError("Please enter your email or phone number.");
      return;
    }

    const type = isEmail(trimmed) ? "email" : "phone";
    setIdentifierType(type);
    setIsLoading(true);

    try {
      if (type === "email") {
        await requestOtp(trimmed);
      } else {
        const formattedPhone = trimmed.startsWith("+")
          ? trimmed
          : `+91${trimmed}`;
        await sendPhoneOtp(formattedPhone);
      }
      setIdentifierError("");
      setStep("otp");
    } catch (err) {
      setIdentifierError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handlers ───────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });
    setOtpDigits(updated);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── OTP verification handler ─────────────────────────────────────
  const handleEnterOtp = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");

    if (otp.length < OTP_LENGTH) {
      setOtpError("Please enter a valid OTP.");
      return;
    }

    setIsLoading(true);
    try {
      if (identifierType === "email") {
        // Email OTP → backend verification → store token → redirect
        const result = await verifyOtp(identifier, otp);
        login({ identifier }, result.token);
        navigate("/dashboard");
      } else {
        // Step 1 — Firebase verifies the OTP
        await verifyPhoneOtp(otp);

        // Step 2 — Get real JWT from our backend
        const formattedPhone = identifier.startsWith("+")
          ? identifier
          : `+91${identifier}`;
        const result = await phoneLoginBackend(formattedPhone);

        // Step 3 — Store real token and navigate
        login({ identifier: formattedPhone }, result.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setOtpError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP handler ───────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    try {
      if (identifierType === "email") {
        await resendOtp(identifier);
      } else {
        const formattedPhone = identifier.startsWith("+")
          ? identifier
          : `+91${identifier}`;
        await sendPhoneOtp(formattedPhone);
      }
      startResendTimer();
      otpRefs.current[0]?.focus();
    } catch (err) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return {
    // Shared
    step, isLoading, OTP_LENGTH,
    // Credentials
    identifier, setIdentifier,
    identifierError, setIdentifierError,
    handleLogin,
    // OTP
    otpDigits, otpRefs, otpError,
    resendTimer, canResend,
    handleOtpChange, handleOtpKeyDown,
    handleOtpPaste, handleEnterOtp, handleResend,
  };
};