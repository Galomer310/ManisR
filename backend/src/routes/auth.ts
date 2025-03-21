// backend/src/routes/auth.ts

import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

// Route for user registration (initial step)
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

export default router;
