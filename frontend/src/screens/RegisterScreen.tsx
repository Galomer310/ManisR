import React, { useState, useRef, useEffect, FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";

/**
 * RegisterScreen is the initial registration form.
 * It collects username, phone, and password; uses honeypot and reCAPTCHA for security.
 * On success, it shows a modal and then navigates to the login page.
 */
const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formLoadedTime, setFormLoadedTime] = useState<number>(Date.now());

  useEffect(() => {
    setFormLoadedTime(Date.now());
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setMessage("Please complete the CAPTCHA");
      return;
    }

    // Access honeypot field value
    const honeypotValue = (e.currentTarget as HTMLFormElement).honeypotField
      .value;

    const payload = {
      username,
      phone,
      password,
      honeypotField: honeypotValue,
      captchaToken,
      formLoadedTime,
    };

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Registration failed");
      } else {
        setMessage(data.message || "Registration successful");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during registration");
    } finally {
      recaptchaRef.current?.reset();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="screen-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Honeypot input */}
        <input
          type="text"
          name="honeypotField"
          style={{ display: "none" }}
          tabIndex={-1}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Phone (05XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Password (8+ chars, letters+digits)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="off"
        />

        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
        />

        <button type="submit">Register</button>
      </form>
      <p>{message}</p>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Registration Successful</h3>
            <p>You can now log in.</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterScreen;
