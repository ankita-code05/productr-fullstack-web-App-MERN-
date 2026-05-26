// src/components/auth/CredentialsForm.jsx

import React from "react";

const CredentialsForm = ({
  identifier,
  setIdentifier,
  identifierError,
  setIdentifierError,
  isLoading,
  handleLogin,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <label>Email or Phone number</label>
      <input
        type="text"
        placeholder="Enter email or phone number"
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.target.value);
          setIdentifierError("");
        }}
      />
      {identifierError && (
        <p className="error-text">{identifierError}</p>
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Please wait..." : "Login"}
      </button>
    </form>
  );
};

export default CredentialsForm;