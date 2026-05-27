import path from "path";
import crypto from "crypto";
import multer from "multer";

const resumeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const photoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "resume" ? "resumes" : "photos";
    cb(null, path.resolve("uploads", folder));
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === "resume" && resumeTypes.has(file.mimetype)) {
    return cb(null, true);
  }

  if (file.fieldname === "photo" && photoTypes.has(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Invalid file type. Resume must be PDF, DOC, or DOCX. Photo must be JPG, PNG, or WebP."));
};

export const applicantUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 2
  }
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]);
