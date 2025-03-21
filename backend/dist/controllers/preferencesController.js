"use strict";
// backend/src/controllers/preferencesController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferences = exports.savePreferences = void 0;
const database_1 = __importDefault(require("../config/database"));
/**
 * savePreferences - Saves or updates a user's preferences.
 * Expects a JSON body: { userId, city, radius, foodPreference, allergies }
 */
const savePreferences = async (req, res) => {
    try {
        const { userId, city, radius, foodPreference, allergies } = req.body;
        if (!userId || !city || !radius || !foodPreference) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Check if preferences already exist for this user
        const [existing] = await database_1.default
            .promise()
            .query("SELECT * FROM user_preferences WHERE user_id = ?", [userId]);
        if (Array.isArray(existing) && existing.length > 0) {
            // Update existing preferences
            await database_1.default
                .promise()
                .query("UPDATE user_preferences SET city = ?, radius = ?, food_preference = ?, allergies = ? WHERE user_id = ?", [city, radius, foodPreference, allergies, userId]);
        }
        else {
            // Insert new preferences
            await database_1.default
                .promise()
                .query("INSERT INTO user_preferences (user_id, city, radius, food_preference, allergies) VALUES (?, ?, ?, ?, ?)", [userId, city, radius, foodPreference, allergies]);
        }
        return res.status(200).json({ message: "Preferences saved successfully" });
    }
    catch (err) {
        console.error("Save preferences error:", err);
        return res.status(500).json({ error: "Server error saving preferences" });
    }
};
exports.savePreferences = savePreferences;
/**
 * getPreferences - Retrieves preferences for a given user.
 * Expects a URL parameter: userId
 */
const getPreferences = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }
        const [rows] = await database_1.default
            .promise()
            .query("SELECT * FROM user_preferences WHERE user_id = ?", [userId]);
        if (Array.isArray(rows) && rows.length > 0) {
            return res.status(200).json({ preferences: rows[0] });
        }
        else {
            return res.status(200).json({ preferences: null });
        }
    }
    catch (err) {
        console.error("Get preferences error:", err);
        return res.status(500).json({ error: "Server error retrieving preferences" });
    }
};
exports.getPreferences = getPreferences;
