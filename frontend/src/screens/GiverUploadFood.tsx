import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import the FoodData type from our global types file.
import { FoodData } from "../types";

/**
 * GiverUploadFood collects details for a food item being uploaded by a giver.
 * It allows the user to enter text details, select options, and optionally upload an image.
 * On successful submission, it sends the data (via FormData) to the backend and navigates
 * to the Meal Card Approval page with the new food item ID.
 */
const GiverUploadFood: React.FC = () => {
  const navigate = useNavigate();

  // Form state for food details.
  const [itemDescription, setItemDescription] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [boxOption, setBoxOption] = useState<FoodData["boxOption"]>("need");
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  // Toggle checkbox selection for food types or ingredients.
  const toggleSelection = (
    value: string,
    currentSelection: string[],
    setSelection: (sel: string[]) => void
  ) => {
    if (currentSelection.includes(value)) {
      setSelection(currentSelection.filter((item) => item !== value));
    } else {
      setSelection([...currentSelection, value]);
    }
  };

  // Handle file input change.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submission: create FormData and send to backend.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("itemDescription", itemDescription);
    formData.append("pickupAddress", pickupAddress);
    formData.append("boxOption", boxOption);
    formData.append("foodTypes", foodTypes.join(","));
    formData.append("ingredients", ingredients.join(","));
    formData.append("specialNotes", specialNotes);
    // In production, include the logged-in user's ID; here we hardcode "1" for example.
    formData.append("userId", "1");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_BASE_URL}/food/give`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error uploading food item");
      } else {
        // Navigate to the approval page passing the food item ID via router state.
        navigate("/giver-meal-approval", {
          state: { foodItemId: data.foodItemId },
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Server error during food upload");
    }
  };

  // 1) Add a handler for “Cancel”
  const handleCancel = () => {
    // 2) Just navigate back to home
    navigate("/home");
  };

  return (
    <div className="screen-container">
      <h2>Giver Upload Food</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label htmlFor="itemDescription">I want to give:</label>
          <input
            id="itemDescription"
            type="text"
            placeholder="Describe the food item"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="pickupAddress">Address for pick up:</label>
          <input
            id="pickupAddress"
            type="text"
            placeholder="Enter the pick-up address"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <p>Do you need to bring a box?</p>
          <label>
            <input
              type="radio"
              name="boxOption"
              value="need"
              checked={boxOption === "need"}
              onChange={() => setBoxOption("need")}
            />
            Need to bring box
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="boxOption"
              value="noNeed"
              checked={boxOption === "noNeed"}
              onChange={() => setBoxOption("noNeed")}
            />
            No need to bring box
          </label>
        </div>
        <div>
          <p>Mark if relevant:</p>
          <label>
            <input
              type="checkbox"
              value="Kosher vegetarian"
              checked={foodTypes.includes("Kosher vegetarian")}
              onChange={() =>
                toggleSelection("Kosher vegetarian", foodTypes, setFoodTypes)
              }
            />
            Kosher vegetarian
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Veg"
              checked={foodTypes.includes("Veg")}
              onChange={() => toggleSelection("Veg", foodTypes, setFoodTypes)}
            />
            Veg
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Vegan"
              checked={foodTypes.includes("Vegan")}
              onChange={() => toggleSelection("Vegan", foodTypes, setFoodTypes)}
            />
            Vegan
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Vegetarian + fish"
              checked={foodTypes.includes("Vegetarian + fish")}
              onChange={() =>
                toggleSelection("Vegetarian + fish", foodTypes, setFoodTypes)
              }
            />
            Vegetarian + fish
          </label>
        </div>
        <div>
          <p>
            Mark if one or more of the following ingredients are in the dish:
          </p>
          <label>
            <input
              type="checkbox"
              value="Dairy"
              checked={ingredients.includes("Dairy")}
              onChange={() =>
                toggleSelection("Dairy", ingredients, setIngredients)
              }
            />
            Dairy
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Gluten"
              checked={ingredients.includes("Gluten")}
              onChange={() =>
                toggleSelection("Gluten", ingredients, setIngredients)
              }
            />
            Gluten
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Eggs"
              checked={ingredients.includes("Eggs")}
              onChange={() =>
                toggleSelection("Eggs", ingredients, setIngredients)
              }
            />
            Eggs
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Peanuts"
              checked={ingredients.includes("Peanuts")}
              onChange={() =>
                toggleSelection("Peanuts", ingredients, setIngredients)
              }
            />
            Peanuts
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Nuts"
              checked={ingredients.includes("Nuts")}
              onChange={() =>
                toggleSelection("Nuts", ingredients, setIngredients)
              }
            />
            Nuts
          </label>
        </div>
        <div>
          <label htmlFor="foodImage">Upload an Image (optional):</label>
          <input
            id="foodImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p>Special notes:</p>
          <textarea
            placeholder="Enter any special notes"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit">Approve</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GiverUploadFood;
