// frontend/src/screens/PreferencesFood.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PreferencesFood: React.FC = () => {
  const navigate = useNavigate();
  const [foodPreference, setFoodPreference] = useState("No preferences");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState("");
  const [error, setError] = useState("");

  const handleAllergyChange = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((item) => item !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Retrieve location preferences from localStorage
    const locationData = localStorage.getItem("locationPreferences");
    if (!locationData) {
      setError("Location preferences not set.");
      return;
    }
    const { city, radius } = JSON.parse(locationData);
    const selectedAllergies = allergies.includes("other")
      ? [...allergies.filter((a) => a !== "other"), otherAllergy]
      : allergies;

    // Assume the userId is stored from login; for testing, we use "1"
    const userId = localStorage.getItem("userId") || "1";
    const payload = {
      userId,
      city,
      radius,
      foodPreference,
      allergies: selectedAllergies.join(","), // join into a string
    };

    try {
      const res = await fetch("/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error saving preferences");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while saving preferences");
    }
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
              onChange={() => handleAllergyChange("Milk")}
            />{" "}
            Milk
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Gluten"
              checked={allergies.includes("Gluten")}
              onChange={() => handleAllergyChange("Gluten")}
            />{" "}
            Gluten
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Eggs"
              checked={allergies.includes("Eggs")}
              onChange={() => handleAllergyChange("Eggs")}
            />{" "}
            Eggs
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Peanuts"
              checked={allergies.includes("Peanuts")}
              onChange={() => handleAllergyChange("Peanuts")}
            />{" "}
            Peanuts
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Nuts"
              checked={allergies.includes("Nuts")}
              onChange={() => handleAllergyChange("Nuts")}
            />{" "}
            Nuts
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="other"
              checked={allergies.includes("other")}
              onChange={() => handleAllergyChange("other")}
            />{" "}
            Other
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="No allergies"
              checked={allergies.includes("No allergies")}
              onChange={() => handleAllergyChange("No allergies")}
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PreferencesFood;
