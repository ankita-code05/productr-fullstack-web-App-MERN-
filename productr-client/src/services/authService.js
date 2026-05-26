// src/services/authService.js

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const requestOtp = async (identifier) => {
  const response = await fetch(`${BASE_URL}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to send OTP.");
  return data;
};

export const verifyOtp = async (identifier, otp) => {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, otp }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Invalid OTP.");
  return data;
};

export const resendOtp = async (identifier) => {
  const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to resend OTP.");
  return data;
};

export const phoneLoginBackend = async (phone) => {
  const response = await fetch(`${BASE_URL}/auth/phone-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Phone login failed.");
  return data;
};