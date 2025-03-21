"use strict";
// backend/src/app.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "../.env" });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// Import route modules
const auth_1 = __importDefault(require("./routes/auth"));
const Code_1 = __importDefault(require("./routes/Code"));
const registerDetails_1 = __importDefault(require("./routes/registerDetails"));
const preferences_1 = __importDefault(require("./routes/preferences"));
const food_1 = __importDefault(require("./routes/food"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware for parsing JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Mount routes for various functionalities
app.use("/auth", auth_1.default);
app.use("/auth", Code_1.default);
app.use("/auth", registerDetails_1.default);
app.use("/preferences", preferences_1.default);
app.use("/food", food_1.default);
// Serve the frontend build (if available)
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist", "index.html"));
});
// Start the server and log errors if any.
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}).on("error", (err) => {
    console.error("Server error:", err);
});
