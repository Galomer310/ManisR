// frontend/src/screens/GiverUploadFood.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GiverUploadFood: React.FC = () => {
  const navigate = useNavigate();

  // Other state variables...
  const [itemDescription, setItemDescription] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [boxOption, setBoxOption] = useState("need"); // "need" or "noNeed"
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");

  // New state for the image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Toggle selection helper for checkboxes (same as before)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Build FormData object to send text fields and the image file
    const formData = new FormData();
    formData.append("itemDescription", itemDescription);
    formData.append("pickupAddress", pickupAddress);
    formData.append("boxOption", boxOption);
    formData.append("foodTypes", foodTypes.join(","));
    formData.append("ingredients", ingredients.join(","));
    formData.append("specialNotes", specialNotes);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Log the payload for debugging (note: FormData won't stringify nicely)
    console.log("Uploading food item...");

    try {
      const res = await fetch("/food/give", {
        method: "POST",
        // When using FormData, do not set Content-Type header manually.
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        console.error("Error uploading image and details:", data.error);
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
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
          <p>Special notes:</p>
          <textarea
            placeholder="Enter any special notes"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={3}
          />
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
        <button type="submit">Approve</button>
      </form>
    </div>
  );
};

export default GiverUploadFood;
