import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLocation } from "../store/slices/preferencesSlice";
import { LocationPreferences } from "../types";

/**
 * PreferencesLocation collects the user's location preferences,
 * such as city and search radius, then saves them to Redux.
 */
const PreferencesLocation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: LocationPreferences = { city, radius };
    dispatch(setLocation(payload));
    navigate("/preferences/food");
  };

  return (
    <div className="screen-container">
      <h2>Location Preferences</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="city">City:</label>
        <input
          id="city"
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label htmlFor="radius">Search Radius: {radius} km</label>
        <input
          id="radius"
          type="range"
          min="1"
          max="10"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <button type="submit">Approve</button>
      </form>
    </div>
  );
};

export default PreferencesLocation;
