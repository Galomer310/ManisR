import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MNSR_logo.svg";
import "animate.css";

/**
 * LaunchScreen displays a splash screen with the logo and a heartbeat animation.
 * After 2 seconds, it navigates to the authentication choice screen.
 */
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
        className="animate__animated animate__heartBeat"
      />
      <p>Loading...</p>
    </div>
  );
};

export default LaunchScreen;
