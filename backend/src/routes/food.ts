// backend/src/routes/food.ts
import { Router } from "express";
import upload from "../middlewares/upload";

const router = Router();

// Create an endpoint for giver uploading food; 'image' is the field name for the file.
router.post("/give", upload.single("image"), (req, res) => {
  // The file is now available in req.file, and other fields in req.body.
  console.log("Received file:", req.file);
  console.log("Other fields:", req.body);
  // TODO: Save food item details (including image path) in your database.
  res.status(200).json({ message: "Food item uploaded successfully" });
});

export default router;
