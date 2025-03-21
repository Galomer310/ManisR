// frontend/src/screens/RegisterPhone.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPhone: React.FC = () => {
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
        navigate("/register/code");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while sending code");
    }
  };

  return (
    <div className="screen-container">
      <h2>Enter Your Phone Number</h2>
      <input
        type="text"
        placeholder="05XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSendCode}>Send Verification Code</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterPhone;
