"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/auth.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
router.get("/me", authMiddleware_1.verifyJWT, async (req, res) => {
    try {
        const userId = req.userId;
        const [rows] = await database_1.default
            .promise()
            .query("SELECT id, username, phone FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user: rows[0] });
    }
    catch (err) {
        console.error("Error in /auth/me:", err);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.default = router;
