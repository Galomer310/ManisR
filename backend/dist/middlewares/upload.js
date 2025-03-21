"use strict";
// backend/src/middlewares/upload.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure Multer storage options to store uploaded files in the "uploads" folder.
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the "uploads" directory exists at the backend root.
        cb(null, path_1.default.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the current timestamp and original filename.
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// Export the configured multer middleware.
exports.default = upload;
