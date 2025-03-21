// backend/src/app.ts

import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";

// Import route modules
import authRoutes from "./routes/auth";
import codeRoutes from "./routes/Code";
import registerDetailsRoutes from "./routes/registerDetails";
import preferencesRoutes from "./routes/preferences";
import foodRoutes from "./routes/food";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Mount routes for various functionalities
app.use("/auth", authRoutes);

app.use("/auth", codeRoutes);
app.use("/auth", registerDetailsRoutes);

app.use("/preferences", preferencesRoutes);
app.use("/food", foodRoutes);

// Serve the frontend build (if available)
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

// Start the server and log errors if any.
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("Server error:", err);
});
