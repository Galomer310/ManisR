"use strict";
// backend/src/routes/registerDetails.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST /auth/register-details - Save final registration details
router.post("/register-details", authController_1.registerDetails);
exports.default = router;
