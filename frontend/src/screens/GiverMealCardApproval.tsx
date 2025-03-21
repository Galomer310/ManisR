import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Import the FoodItem type from our global types
import { FoodItem } from "../types";

/**
 * GiverMealCardApproval displays the summary of a food item uploaded by a giver.
 * It reads the foodItemId from router state, fetches the record from the backend,
 * and shows all details (including the uploaded image if available).
 */
const GiverMealCardApproval: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract foodItemId from router state
  const stateFoodItemId = (location.state as { foodItemId: number })
    ?.foodItemId;
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stateFoodItemId) {
      setError("No food item ID provided. Please go back and upload again.");
      return;
    }
    const fetchFoodItem = async () => {
      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${API_BASE_URL}/food/${stateFoodItemId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error fetching food item");
        } else {
          const json = await res.json();
          setFoodItem(json.foodItem);
        }
      } catch (err) {
        console.error(err);
        setError("Server error retrieving food item");
      }
    };
    fetchFoodItem();
  }, [stateFoodItemId]);

  const handleApprove = () => {
    // Optionally, update the record as approved in the backend.
    navigate("/home");
  };

  const handleBack = () => {
    // Navigate back to the upload screen for editing.
    navigate("/give-food", { state: { foodItemId: stateFoodItemId } });
  };

  if (error) {
    return (
      <div className="screen-container">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={handleBack}>Back</button>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="screen-container">
        <p>Loading food details...</p>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <h2>Meal Card Approval</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <p>
          <strong>Item:</strong> {foodItem.item_description}
        </p>
        <p>
          <strong>Pickup Address:</strong> {foodItem.pickup_address}
        </p>
        <p>
          <strong>Box Option:</strong>{" "}
          {foodItem.box_option === "need"
            ? "Need to bring box"
            : "No need to bring box"}
        </p>
        <p>
          <strong>Food Types:</strong> {foodItem.food_types}
        </p>
        <p>
          <strong>Ingredients:</strong> {foodItem.ingredients}
        </p>
        <p>
          <strong>Special Notes:</strong> {foodItem.special_notes}
        </p>
        {foodItem.image_url && (
          <div>
            <p>
              <strong>Uploaded Image:</strong>
            </p>
            <img
              src={foodItem.image_url}
              alt="Uploaded food"
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
        )}
      </div>
      <p>Are all the details correct?</p>
      <div style={{ display: "flex", gap: "16px" }}>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default GiverMealCardApproval;
