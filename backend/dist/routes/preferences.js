"use strict";
// backend/src/routes/preferences.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const preferencesController_1 = require("../controllers/preferencesController");
const router = (0, express_1.Router)();
// POST /preferences - Save or update user preferences
router.post("/", preferencesController_1.savePreferences);
// GET /preferences/:userId - Retrieve preferences for a given user
router.get("/:userId", preferencesController_1.getPreferences);
exports.default = router;
