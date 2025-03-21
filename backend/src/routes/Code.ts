// backend/src/routes/code.ts
import { Router } from "express";
import { sendCode, verifyCode } from "../controllers/CodeController";

const router = Router();

// Endpoint to send the code (for both registration and login, if desired)
router.post("/send-code", sendCode);

// Endpoint to verify the code (for both registration and login)
router.post("/verify-code", verifyCode);

export default router;
