"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/preferences.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const preferencesController_1 = require("../controllers/preferencesController");
const router = (0, express_1.Router)();
// Protected routes
router.post("/", authMiddleware_1.verifyJWT, preferencesController_1.savePreferences);
router.get("/:userId", authMiddleware_1.verifyJWT, preferencesController_1.getPreferences);
exports.default = router;
