"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/code.ts
const express_1 = require("express");
const CodeController_1 = require("../controllers/CodeController");
const router = (0, express_1.Router)();
// Endpoint to send the code (for both registration and login, if desired)
router.post("/send-code", CodeController_1.sendCode);
// Endpoint to verify the code (for both registration and login)
router.post("/verify-code", CodeController_1.verifyCode);
exports.default = router;
