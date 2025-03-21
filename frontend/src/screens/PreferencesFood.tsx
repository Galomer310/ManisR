import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFoodPreferences } from "../store/slices/preferencesSlice";
import { FoodPreferences } from "../types";

/**
 * PreferencesFood allows the user to select their food preference and allergies.
 * The selections are dispatched to Redux and then the user is navigated to Home.
 */
const PreferencesFood: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [foodPreference, setFoodPreference] = useState("No preferences");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState("");

  const toggleSelection = (value: string) => {
    if (allergies.includes(value)) {
      setAllergies(allergies.filter((a) => a !== value));
    } else {
      setAllergies([...allergies, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAllergies = allergies.includes("other")
      ? [...allergies.filter((a) => a !== "other"), otherAllergy]
      : allergies;
    const payload: FoodPreferences = {
      foodPreference,
      allergies: selectedAllergies,
    };
    dispatch(setFoodPreferences(payload));
    // In production, you might send these preferences to the backend.
    navigate("/home");
  };

  return (
    <div className="screen-container">
      <h2>Food Preferences</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <p>Select Food Preference:</p>
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="Kosher vegetarian"
              checked={foodPreference === "Kosher vegetarian"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />{" "}
            Kosher vegetarian
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="Vegan"
              checked={foodPreference === "Vegan"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />{" "}
            Vegan
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="Vegetarian + fish"
              checked={foodPreference === "Vegetarian + fish"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />{" "}
            Vegetarian + fish
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="No preferences"
              checked={foodPreference === "No preferences"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />{" "}
            No preferences
          </label>
        </div>
        <div>
          <p>Select Allergies (if any):</p>
          <label>
            <input
              type="checkbox"
              value="Milk"
              checked={allergies.includes("Milk")}
              onChange={() => toggleSelection("Milk")}
            />{" "}
            Milk
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Gluten"
              checked={allergies.includes("Gluten")}
              onChange={() => toggleSelection("Gluten")}
            />{" "}
            Gluten
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Eggs"
              checked={allergies.includes("Eggs")}
              onChange={() => toggleSelection("Eggs")}
            />{" "}
            Eggs
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Peanuts"
              checked={allergies.includes("Peanuts")}
              onChange={() => toggleSelection("Peanuts")}
            />{" "}
            Peanuts
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Nuts"
              checked={allergies.includes("Nuts")}
              onChange={() => toggleSelection("Nuts")}
            />{" "}
            Nuts
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="other"
              checked={allergies.includes("other")}
              onChange={() => toggleSelection("other")}
            />{" "}
            Other
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="No allergies"
              checked={allergies.includes("No allergies")}
              onChange={() => toggleSelection("No allergies")}
            />{" "}
            No allergies
          </label>
          {allergies.includes("other") && (
            <div>
              <input
                type="text"
                placeholder="Please specify other allergies"
                value={otherAllergy}
                onChange={(e) => setOtherAllergy(e.target.value)}
              />
            </div>
          )}
        </div>
        <button type="submit">Approve</button>
      </form>
    </div>
  );
};

export default PreferencesFood;
