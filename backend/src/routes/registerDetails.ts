import { Router } from "express";
import { registerDetails } from "../controllers/authController";

const router = Router();

router.post("/register-details", registerDetails);

export default router;
