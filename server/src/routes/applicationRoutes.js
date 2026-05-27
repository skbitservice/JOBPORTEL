import express from "express";
import { requireDb } from "../middleware/requireDb.js";
import { requireAdmin } from "../middleware/auth.js";
import { applicantUpload } from "../middleware/upload.js";
import { createApplication, downloadApplicantFile } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", requireDb, applicantUpload, createApplication);
router.get("/:id/file/:kind", requireDb, requireAdmin, downloadApplicantFile);

export default router;
