import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * HomePage displays the main options for a returning user,
 * along with a dropdown menu for additional navigation.
 */
const HomePage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the dropdown menu.
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handlers for dropdown options.
  const handleProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const handleMessages = () => {
    navigate("/messages");
    setMenuOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setMenuOpen(false);
  };

  const handleTalkToUs = () => {
    navigate("/talk-to-us");
    setMenuOpen(false);
  };

  // Handlers for main options.
  const handleGiveFood = () => {
    navigate("/give-food");
  };

  const handleCollectFood = () => {
    navigate("/collect-food");
  };

  return (
    <div className="screen-container" style={{ position: "relative" }}>
      <header>
        <h1>Home</h1>
        <div>
          <button onClick={toggleMenu} aria-label="Open-menu">
            ☰
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={handleProfile}>Personal Profile</button>
              <button onClick={handleMessages}>Messages</button>
              <button onClick={handleSettings}>Settings</button>
              <button onClick={handleTalkToUs}>Talk to Us</button>
            </div>
          )}
        </div>
      </header>
      <main>
        <button onClick={handleGiveFood}>I want to give food</button>
        <button onClick={handleCollectFood}>I want to collect food</button>
      </main>
    </div>
  );
};

export default HomePage;
