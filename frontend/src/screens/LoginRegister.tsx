import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MNSR_logo.svg";

/**
 * LoginRegister displays the initial authentication choice screen,
 * where the user can select registration or login.
 */
const LoginRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleAlreadyAccountClick = () => {
    navigate("/login");
  };

  return (
    <div className="screen-container">
      <img
        src={logo}
        alt="Manisr Logo"
        style={{ width: 200, marginBottom: 20 }}
      />
      <h1>מניש</h1>
      <button onClick={handleRegisterClick}>הרשמה</button>
      <button onClick={handleAlreadyAccountClick}>יש לי כבר חשבון</button>
    </div>
  );
};

export default LoginRegister;
