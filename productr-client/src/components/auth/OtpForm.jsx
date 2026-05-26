// src/components/auth/OtpForm.jsx

import React from "react";

const OtpForm = ({
  otpDigits,
  otpRefs,
  otpError,
  resendTimer,
  canResend,
  isLoading,
  handleOtpChange,
  handleOtpKeyDown,
  handleOtpPaste,
  handleEnterOtp,
  handleResend,
  OTP_LENGTH,
}) => {
  return (
    <form onSubmit={handleEnterOtp}>
      <label>Enter OTP</label>
      <div className="otp-input-group" onPaste={handleOtpPaste}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-box"
            value={otpDigits[index]}
            ref={(el) => (otpRefs.current[index] = el)}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
        ))}
      </div>
      {otpError && <p className="error-text">{otpError}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Enter your OTP"}
      </button>
      <p className="resend-text">
        Didn't receive OTP?{" "}
        {canResend ? (
          <span className="resend-link" onClick={handleResend}>
            Resend
          </span>
        ) : (
          <span className="resend-disabled">
            Resend in {resendTimer}s
          </span>
        )}
      </p>
    </form>
  );
};

export default OtpForm;