// backend/src/routes/food.ts

import { Router } from "express";
import upload from "../middlewares/upload";
import pool from "../config/database";

const router = Router();

/**
 * POST /food/give
 * Handles food item upload from a giver.
 * Expects a multipart/form-data request with an optional image file.
 */
router.post("/give", upload.single("image"), async (req, res) => {
  try {
    const {
      itemDescription,
      pickupAddress,
      boxOption,
      foodTypes,
      ingredients,
      specialNotes,
      userId  // Assume this is provided from a logged-in session or token.
    } = req.body;

    // If an image was uploaded, its file path is available in req.file.path
    const imageUrl = req.file ? req.file.path : null;

    // Insert the food item into the food_items table.
    const [result]: any = await pool
      .promise()
      .query(
        "INSERT INTO food_items (user_id, item_description, pickup_address, box_option, food_types, ingredients, special_notes, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [userId, itemDescription, pickupAddress, boxOption, foodTypes, ingredients, specialNotes, imageUrl]
      );

    // Return the inserted food item ID.
    const foodItemId = result.insertId;
    return res.status(200).json({
      message: "Food item uploaded successfully",
      foodItemId,
    });
  } catch (err) {
    console.error("Food upload error:", err);
    return res.status(500).json({ error: "Server error during food upload" });
  }
});

/**
 * GET /food/:id
 * Retrieves a food item by its ID.
 */
router.get("/:id", async (req, res) => {
  try {
    const foodItemId = req.params.id;
    const [rows]: any = await pool
      .promise()
      .query("SELECT * FROM food_items WHERE id = ?", [foodItemId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }
    return res.status(200).json({ foodItem: rows[0] });
  } catch (err) {
    console.error("Get food item error:", err);
    return res.status(500).json({ error: "Server error retrieving food item" });
  }
});

export default router;
