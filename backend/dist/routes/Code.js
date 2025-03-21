"use strict";
// backend/src/routes/code.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CodeController_1 = require("../controllers/CodeController");
const router = (0, express_1.Router)();
// Endpoint to send a verification code
router.post("/send-code", CodeController_1.sendCode);
// Endpoint to verify the provided code
router.post("/verify-code", CodeController_1.verifyCode);
exports.default = router;
