// src/pages/LoginPage.jsx

import React from "react";
import { useLogin } from "../hooks/useLogin";
import CredentialsForm from "../components/auth/CredentialsForm";
import OtpForm from "../components/auth/OtpForm";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const loginProps = useLogin();

  return (
    <div className="login-container">

      {/* Required for Firebase phone OTP — must be in DOM */}
      <div id="recaptcha-container"></div>

      <div className="left-section">
        <img
          src="./images/login.png"
          alt="login-banner"
          className="left-image"
        />
      </div>

      <div className="right-section">
        <div className="login-box">
          <h2>Login to your Productr Account</h2>

          {loginProps.step === "credentials" && (
            <CredentialsForm {...loginProps} />
          )}

          {loginProps.step === "otp" && (
            <OtpForm {...loginProps} />
          )}

          {loginProps.step === "credentials" && (
            <div className="signup-box">
              <p>Don't have a Productr Account</p>
              <span>SignUp Here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;