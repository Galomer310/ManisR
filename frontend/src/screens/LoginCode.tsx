// frontend/src/screens/LoginCode.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { User } from "../types";

const LoginCode: React.FC = () => {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

      // If success, we expect data.user and data.token
      if (!data.user || !data.token) {
        setError("User/token not returned from server.");
        return;
      }

      const user: User = data.user;
      dispatch(setUser(user));

      // Save JWT in localStorage (or cookie)
      localStorage.setItem("token", data.token);

      // Then check preferences or navigate to home, etc.
      navigate("/home");
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
