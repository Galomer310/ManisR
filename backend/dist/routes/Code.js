"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/code.ts
const express_1 = require("express");
const CodeController_1 = require("../controllers/CodeController");
const router = (0, express_1.Router)();
// Endpoint to send a verification code
router.post("/send-code", CodeController_1.sendCode);
// Endpoint to verify the provided code (and get JWT)
router.post("/verify-code", CodeController_1.verifyCode);
exports.default = router;
