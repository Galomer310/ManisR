// backend/src/middlewares/upload.ts
import multer from "multer";
import path from "path";

// Configure storage options (you can store files in a folder like "uploads")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    // Save the file with a unique name, e.g., Date.now() + originalname
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
