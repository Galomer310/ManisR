// frontend/src/screens/GiverMealMapScreen.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GiverOSMMap from "../components/GiverOSMMap";
import { FoodItem } from "../types";

const GiverMealMapScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the foodItemId from router state
  const { foodItemId } = (location.state as { foodItemId: number }) || {};

  // State for the fetched meal
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");

  // For the map's coordinates
  const [lat] = useState(32.0853); // Default to Tel Aviv area
  const [lng] = useState(34.7818);

  // Base URL for your backend
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // 1) Fetch the meal from the backend
  useEffect(() => {
    if (!foodItemId) {
      setError("No food item ID provided");
      return;
    }

    const fetchMeal = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/food/${foodItemId}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Error fetching meal");
          return;
        }
        const data = await res.json();
        setFoodItem(data.foodItem);

        // If your backend also returns lat/lng in foodItem, do:
        // setLat(data.foodItem.lat);
        // setLng(data.foodItem.lng);

        // OR if you only have an address, optionally call a geocoding API
        // to convert data.foodItem.pickup_address -> lat/lng
      } catch (err) {
        console.error(err);
        setError("Server error fetching meal");
      }
    };

    fetchMeal();
  }, [foodItemId]);

  // 3) "Cancel Meal" button
  const handleCancelMeal = async () => {
    if (!foodItemId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/food/${foodItemId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to cancel meal");
        return;
      }
      // Successfully canceled
      navigate("/give-food");
    } catch (err) {
      console.error(err);
      setError("Server error canceling meal");
    }
  };

  if (error) {
    return (
      <div className="screen-container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="screen-container">
        <p>Loading meal details...</p>
      </div>
    );
  }

  return (
    // A vertical split: map on top, meal details bottom
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        border: "1px solid red,",
      }}
    >
      {/* Top half: the Leaflet map */}
      <div style={{ flex: 1 }}>
        <GiverOSMMap lat={lat} lng={lng} />
      </div>

      {/* Bottom half: Meal details */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          borderTop: "1px solid #ccc",
        }}
      >
        <h2>{foodItem.item_description}</h2>
        <p>
          <strong>Pickup Address:</strong> {foodItem.pickup_address}
        </p>
        <p>
          <strong>Box Option:</strong> {foodItem.box_option}
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

        <div style={{ marginTop: "16px" }}>
          <button onClick={handleCancelMeal}>Cancel/Edit Meal</button>
        </div>
      </div>
    </div>
  );
};

export default GiverMealMapScreen;
