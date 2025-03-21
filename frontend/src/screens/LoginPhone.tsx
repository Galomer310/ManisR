import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * LoginPhone prompts the user to enter their phone number to receive a login code.
 */
const LoginPhone: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    setError("");
    try {
      const res = await fetch("/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error sending code");
      } else {
        navigate("/login/code");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while sending code");
    }
  };

  return (
    <div className="screen-container">
      <h2>Login</h2>
      <p>Enter your phone number to receive a login code.</p>
      <input
        type="text"
        placeholder="05XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSendCode}>Send Code</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPhone;
