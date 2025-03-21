// backend/src/routes/preferences.ts

import { Router } from "express";
import { savePreferences, getPreferences } from "../controllers/preferencesController";

const router = Router();

// POST /preferences - Save or update user preferences
router.post("/", savePreferences);

// GET /preferences/:userId - Retrieve preferences for a given user
router.get("/:userId", getPreferences);

export default router;
