import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterDetails: React.FC = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [formLoadedTime, setFormLoadedTime] = useState<number>(Date.now());

  useEffect(() => {
    setFormLoadedTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

    // Client-side password check
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, including letters and numbers."
      );
      return;
    }

    const payload = {
      name,
      username,
      email,
      gender,
      password,
      phone,
      honeypotField: "", // The honeypot field; leave empty in a valid submission.
      captchaToken,
      formLoadedTime,
    };

    try {
      const res = await fetch("/auth/register-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during registration details submission");
    } finally {
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="screen-container">
      <h2>Complete Registration</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input type="text" name="honeypotField" style={{ display: "none" }} />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <p>Select Gender:</p>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={gender === "other"}
              onChange={(e) => setGender(e.target.value)}
            />
            Other
          </label>
        </div>
        <input
          type="password"
          placeholder="Password (8+ chars, letters & numbers)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone (05XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterDetails;
