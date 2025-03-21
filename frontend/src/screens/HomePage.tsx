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
      <header
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Home</h1>
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleMenu}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
            aria-label="Open menu"
          >
            ☰
          </button>
          {menuOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "4px",
                padding: "10px",
                zIndex: 1000,
              }}
            >
              <button
                onClick={handleProfile}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Personal Profile
              </button>
              <button
                onClick={handleMessages}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Messages
              </button>
              <button
                onClick={handleSettings}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Settings
              </button>
              <button
                onClick={handleTalkToUs}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Talk to Us
              </button>
            </div>
          )}
        </div>
      </header>
      <main style={{ marginTop: "50px" }}>
        <button
          onClick={handleGiveFood}
          style={{ margin: "20px", padding: "15px 30px", fontSize: "1.2rem" }}
        >
          I want to give food
        </button>
        <button
          onClick={handleCollectFood}
          style={{ margin: "20px", padding: "15px 30px", fontSize: "1.2rem" }}
        >
          I want to collect food
        </button>
      </main>
    </div>
  );
};

export default HomePage;
