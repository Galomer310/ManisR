// backend/src/routes/auth.ts
import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware";
import pool from "../config/database";

const router = Router();

router.get("/me", verifyJWT, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const [rows]: any = await pool
      .promise()
      .query("SELECT id, username, phone FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("Error in /auth/me:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
