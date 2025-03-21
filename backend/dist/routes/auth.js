"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/auth.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
exports.default = router;
