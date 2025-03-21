import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * RegisterCode prompts the user to enter the code sent to their phone
 * during registration.
 */
const RegisterCode: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    try {
      const res = await fetch("/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Code verification failed");
      } else {
        // On successful verification, navigate to registration details.
        navigate("/register/details");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during code verification");
    }
  };

  return (
    <div className="screen-container">
      <h2>Enter the Code Sent to Your Phone</h2>
      <input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone (05XXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterCode;
