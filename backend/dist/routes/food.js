"use strict";
// backend/src/routes/food.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("../middlewares/upload"));
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
/**
 * POST /food/give
 * Allows only one active meal per user.
 */
router.post("/give", upload_1.default.single("image"), async (req, res) => {
    try {
        const { itemDescription, pickupAddress, boxOption, foodTypes, ingredients, specialNotes, userId, } = req.body;
        // 1) Check if user already has a meal row
        const [existingMeals] = await database_1.default
            .promise()
            .query(
        // if no row exist 
        "SELECT id FROM food_items WHERE user_id = ?", [userId]);
        if (existingMeals.length > 0) {
            // If user already has a meal, return an error
            return res.status(400).json({
                error: "You already have an active meal. Please cancel or complete it first."
            });
        }
        // 2) If no meal, insert the new row
        const imageUrl = req.file ? req.file.path : null;
        const [result] = await database_1.default
            .promise()
            .query(`INSERT INTO food_items
         (user_id, item_description, pickup_address, box_option,
          food_types, ingredients, special_notes, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            userId,
            itemDescription,
            pickupAddress,
            boxOption,
            foodTypes,
            ingredients,
            specialNotes,
            imageUrl,
        ]);
        const foodItemId = result.insertId;
        return res.status(200).json({
            message: "Food item uploaded successfully",
            foodItemId,
        });
    }
    catch (err) {
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
        const [rows] = await database_1.default
            .promise()
            .query("SELECT * FROM food_items WHERE id = ?", [foodItemId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Food item not found" });
        }
        return res.status(200).json({ foodItem: rows[0] });
    }
    catch (err) {
        console.error("Get food item error:", err);
        return res.status(500).json({ error: "Server error retrieving food item" });
    }
});
/**
 * DELETE /food/:foodItemId
 * Cancels (deletes) the meal row by ID.
 */
router.delete("/:foodItemId", async (req, res) => {
    try {
        const { foodItemId } = req.params;
        const [result] = await database_1.default
            .promise()
            .query("DELETE FROM food_items WHERE id = ?", [foodItemId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Meal not found or already deleted" });
        }
        return res.status(200).json({ message: "Meal canceled successfully" });
    }
    catch (err) {
        console.error("Cancel meal error:", err);
        return res.status(500).json({ error: "Server error canceling meal" });
    }
});
exports.default = router;
