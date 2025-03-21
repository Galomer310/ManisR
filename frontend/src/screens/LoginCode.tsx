// LoginCode.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { User } from "../types";

const LoginCode: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login code verification failed");
        return;
      }

      // If success, we expect data.user
      if (!data.user) {
        setError("User data not returned from server.");
        return;
      }

      const user: User = data.user;
      dispatch(setUser(user));

      // Then check preferences or navigate
      const prefRes = await fetch(`${API_BASE_URL}/preferences/${user.id}`);
      if (prefRes.ok) {
        navigate("/home");
      } else {
        navigate("/preferences/location");
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
