// frontend/src/screens/LoginCode.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginCode: React.FC = () => {
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
        setError(data.error || "Login code verification failed");
      } else {
        // Assume the response includes the user's id; store it
        const userId = data.user?.id || "1";
        localStorage.setItem("userId", userId);

        // Now, check if the user already has preferences
        const prefRes = await fetch(`/preferences/${userId}`);
        if (prefRes.ok) {
          // Preferences exist, navigate to HomePage
          navigate("/home");
        } else {
          // No preferences; navigate to preferences flow
          navigate("/preferences/location");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server error during code verification");
    }
  };

  return (
    <div className="screen-container">
      <h2>Enter Your Login Code</h2>
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

export default LoginCode;
