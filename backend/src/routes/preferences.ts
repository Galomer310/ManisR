// backend/src/routes/preferences.ts
import { Router } from "express";
import { savePreferences, getPreferences } from "../controllers/preferencesController";

const router = Router();

// POST /preferences  → save or update preferences
router.post("/", savePreferences);

// GET /preferences/:userId  → get preferences for a user
router.get("/:userId", getPreferences);

export default router;
