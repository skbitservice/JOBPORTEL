import express from "express";
import { requireDb } from "../middleware/requireDb.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send", requireDb, sendOtp);
router.post("/verify", requireDb, verifyOtp);

export default router;
