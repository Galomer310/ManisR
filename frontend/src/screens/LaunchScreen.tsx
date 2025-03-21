// frontend/src/screens/LaunchScreen.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MNSR_logo.svg";
import "animate.css";

const LaunchScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen screen-container">
      <img
        src={logo}
        alt="Manisr Logo"
        style={{ width: 200 }}
        className="animate__animated animate__heartBeat" // Added animation classes
      />
      <p>Loading...</p>
    </div>
  );
};

export default LaunchScreen;
