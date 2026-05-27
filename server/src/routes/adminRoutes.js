import express from "express";
import { requireDb } from "../middleware/requireDb.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  exportApplicantsExcel,
  exportApplicantsPdf,
  getAdminProfile,
  getApplicant,
  listApplicants,
  loginAdmin,
  updateApplicantStatus
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", requireDb, loginAdmin);
router.get("/me", requireDb, requireAdmin, getAdminProfile);
router.get("/applicants", requireDb, requireAdmin, listApplicants);
router.get("/applicants/export/excel", requireDb, requireAdmin, exportApplicantsExcel);
router.get("/applicants/export/pdf", requireDb, requireAdmin, exportApplicantsPdf);
router.get("/applicants/:id", requireDb, requireAdmin, getApplicant);
router.patch("/applicants/:id/status", requireDb, requireAdmin, updateApplicantStatus);

export default router;
