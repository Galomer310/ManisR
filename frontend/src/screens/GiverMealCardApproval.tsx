import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FoodItem } from "../types";

/**
 * GiverMealCardApproval displays the summary of a food item uploaded by a giver.
 * It reads the foodItemId from router state, fetches the record from the backend,
 * and shows all details (including the uploaded image if available).
 */
const GiverMealCardApproval: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the foodItemId from router state
  const stateFoodItemId = (location.state as { foodItemId: number })
    ?.foodItemId;

  // Keep track of the fetched meal or any error
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");

  // Use your environment variable or fallback to localhost:3000
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!stateFoodItemId) {
      setError("No food item ID provided. Please go back and upload again.");
      return;
    }

    // Fetch the meal details from the backend
    const fetchFoodItem = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/food/${stateFoodItemId}`);
        if (!res.ok) {
          // If server returns an error, parse it
          const data = await res.json();
          setError(data.error || "Error fetching food item");
        } else {
          // Otherwise parse JSON to get the meal
          const json = await res.json();
          setFoodItem(json.foodItem);
        }
      } catch (err) {
        console.error(err);
        setError("Server error retrieving food item");
      }
    };

    fetchFoodItem();
  }, [stateFoodItemId, API_BASE_URL]);

  // Approve button (placeholder behavior)
  const handleApprove = () => {
    if (foodItem) {
      navigate("/giver-meal-map", { state: { foodItemId: foodItem.id } });
    } else {
      setError("Food item data is missing.");
    }
  };

  // Cancel meal button (delete the meal from DB)
  const handleCancelMeal = async () => {
    if (!stateFoodItemId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/food/${stateFoodItemId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to cancel meal");
        return;
      }
      // If successful, navigate away or reset state
      navigate("/give-food");
    } catch (err) {
      console.error(err);
      setError("Server error cancelling meal");
    }
  };

  // If we have an error message, show it with a Back button
  if (error) {
    return (
      <div className="screen-container">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/give-food")}>Back</button>
      </div>
    );
  }

  // If we have no error but haven't fetched the meal yet, show loading
  if (!foodItem) {
    return (
      <div className="screen-container">
        <p>Loading food details...</p>
      </div>
    );
  }

  // Otherwise, render the meal card
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
        <button onClick={handleCancelMeal}>Cancel Meal</button>
        <button onClick={() => navigate("/give-food")}>Back</button>
      </div>
    </div>
  );
};

export default GiverMealCardApproval;
